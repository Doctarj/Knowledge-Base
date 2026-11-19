"""Convert extracted client documentation into the KB web part's data files.

Input : source-docs/_extracted/<REGION>/<zip name>/...   (run tools/extract_sources.py first)
Output: src/webparts/knowledgeBase2/data/clients/<CODE>.json          client tree (docs + screenshots)
        src/webparts/knowledgeBase2/data/clients/<CODE>/pNN.json      one photo gallery per file
        src/webparts/knowledgeBase2/data/clientLoaders.ts             generated lazy-import map

Usage:  tools/.venv/Scripts/python.exe tools/build_kb_data.py            # convert every mapped client
        tools/.venv/Scripts/python.exe tools/build_kb_data.py ARB TRC    # only these codes
        tools/.venv/Scripts/python.exe tools/build_kb_data.py --loaders  # only regenerate clientLoaders.ts

Each client folder must be mapped in SOURCES below to its code from CLIENTS in KnowledgeBase2.tsx.
"""
import base64
import datetime
import io
import json
import os
import re
import shutil
import sys
import xml.etree.ElementTree as ET
import zipfile

import docx
import openpyxl
from docx.oxml.ns import qn
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXTRACTED = os.path.join(ROOT, 'source-docs', '_extracted')
DATA_DIR = os.path.join(ROOT, 'src', 'webparts', 'knowledgeBase2', 'data')
CLIENTS_DIR = os.path.join(DATA_DIR, 'clients')

# <REGION>/<extracted folder name>  ->  (client code, display name)
SOURCES = {
    'BC/Beach Grove Golf Club': ('BGR', 'Beach Grove Golf Club'),
    'BC/Marine Drive Golf Club': ('MDG', 'Marine Drive GC'),
    'BC/Pitt Meadows Golf Club': ('PIT', 'Pitt Meadows Golf Club'),
    'BC/Point Grey Golf & Country Club': ('PGR', 'Point Grey G&CC'),
    'BC/Richmond Country Club': ('RIC', 'Richmond Country Club'),
    'BC/Shaughnessy Golf & Country Club': ('SHA', 'Shaughnessy G&CC'),
    'BC/The Arbutus Club': ('ARB', 'The Arbutus Club'),
    'BC/The Royal Vancouver Yacht Club': ('RVYC', 'The Royal Vancouver Yacht Club'),
    'BC/The Vancouver Golf Club': ('VGC', 'The Vancouver Golf Club'),
    'BC/Vancouver Lawn Tennis & Badminton Club': ('VLT', 'Vancouver Lawn Tennis & Badminton Club'),
    'BC/Vancouver Rowing Club': ('VRC', 'Vancouver Rowing Club'),
    'US/IGC - Inverness Golf Club': ('INV', 'Inverness Golf Club'),
    'US/LCCC - La Cumbre': ('LCC', 'La Cumbre Country Club'),
    'US/Reserve Club': ('TRC', 'The Reserve Club'),
}

IMAGE_EXT = ('.jpg', '.jpeg', '.jfif', '.png', '.gif', '.bmp', '.webp')
DOC_EXT = ('.docx', '.odt', '.xlsx')

# Screenshots embedded in documents: kept sharp enough to read UI text.
SHOT_MAX_W, SHOT_QUALITY = 1000, 80
# Site photos: large enough to read labels/serials in the lightbox, small enough to load quickly.
PHOTO_MAX_SIDE, PHOTO_QUALITY = 1280, 62

# Tab order inside General > Guides (anything else follows alphabetically).
GUIDE_ORDER = ['Information', 'Network Drives', 'New User setup', 'User disable', 'Workstation setup',
               'Proper Server Shutdown and Startup Procedure']
NETWORK_ORDER = ['Overview', 'VPN', 'RDP']


def lp(path: str) -> str:
    """Long-path safe absolute path on Windows."""
    path = os.path.abspath(path)
    return '\\\\?\\' + path if os.name == 'nt' and not path.startswith('\\\\?\\') else path


# ── text helpers ─────────────────────────────────────────────

def clean(text: str) -> str:
    text = text.replace('\xa0', ' ').replace('​', '').replace('\r', '')
    lines = [re.sub(r' {2,}', ' ', ln).rstrip() for ln in text.split('\n')]
    lines = [ln if ln.strip() else '' for ln in lines]
    return re.sub(r'\n{3,}', '\n\n', '\n'.join(lines)).strip('\n ')


def norm(text: str) -> str:
    return re.sub(r'[^a-z0-9]', '', text.lower())


def link(text: str, url: str) -> str:
    text, url = text.strip(), url.strip()
    # Only web links become clickable; file:// (UNC paths), mailto: and anchors keep their text,
    # which highlight() already styles (UNC paths, emails).
    if not re.match(r'(?i)^https?://', url):
        return text
    if not text or norm(text) == norm(url):
        return url
    return f'[{text}]({url})'


def is_note_prefix(text: str) -> bool:
    return bool(re.match(r'^(note|important|warning|caution|reminder)\b', text, re.I))


def is_shouting(text: str) -> bool:
    letters = re.sub(r'[^A-Za-z]', '', text)
    return len(letters) > 20 and letters.isupper()


# ── images ───────────────────────────────────────────────────

def to_jpeg(data: bytes, max_w: int = 0, max_side: int = 0, quality: int = 80):
    im = Image.open(io.BytesIO(data))
    im = ImageOps.exif_transpose(im)
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA')
        bg = Image.new('RGB', im.size, (255, 255, 255))
        bg.paste(im, mask=im.split()[-1])
        im = bg
    elif im.mode != 'RGB':
        im = im.convert('RGB')
    w, h = im.size
    scale = 1.0
    if max_w and w > max_w:
        scale = max_w / w
    if max_side and max(w, h) * scale > max_side:
        scale = max_side / max(w, h)
    if scale < 1:
        im = im.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS)
    out = io.BytesIO()
    im.save(out, 'JPEG', quality=quality, optimize=True, progressive=True)
    return base64.b64encode(out.getvalue()).decode('ascii'), im.size[0], im.size[1]


def screenshot_block(data: bytes):
    try:
        b64, w, h = to_jpeg(data, max_w=SHOT_MAX_W, quality=SHOT_QUALITY)
    except Exception as e:  # unsupported (emf/wmf) or corrupt image
        print('    ! skipped embedded image:', e)
        return None
    if w < 24 or h < 24:  # bullets, spacer pixels
        return None
    return {'type': 'image', 'b64': b64, 'w': w, 'h': h}


# ── block assembly shared by docx/odt ────────────────────────

class Blocks:
    """Collects paragraphs and groups lists / indented lines / numbered steps."""

    def __init__(self):
        self.out = []
        self.counters = {}

    def _last(self, type_, **match):
        if self.out and self.out[-1]['type'] == type_ and all(self.out[-1].get(k) == v for k, v in match.items()):
            return self.out[-1]
        return None

    def add(self, block):
        if block:
            self.out.append(block)

    def para(self, text, bold=False, heading=False):
        text = clean(text)
        if not text:
            return
        single = '\n' not in text
        if is_note_prefix(text):
            self.out.append({'type': 'note', 'text': text})
        elif single and (heading or (bold and len(text) <= 90)):
            self.out.append({'type': 'sub', 'text': text.rstrip(':').strip()})
        elif is_shouting(text):  # e.g. "ADAPTED FROM WORKSTATION SETUP, DOUBLE CHECK..."
            self.out.append({'type': 'note', 'text': text})
        elif text.startswith('\t'):
            lines = [ln.lstrip('\t').strip() for ln in text.split('\n')]
            prev = self._last('indent')
            body = '\n'.join(ln for ln in lines)
            if prev:
                prev['text'] += '\n' + body
            else:
                self.out.append({'type': 'indent', 'text': body})
        else:
            self.out.append({'type': 'p', 'text': text.replace('\t', ' ')})

    def item(self, text, numbered, level, counter_key=None):
        text = clean(text).replace('\t', ' ')
        if not text:
            return
        if numbered and level == 0:
            n = self.counters.get(counter_key, 0) + 1
            prev = self._last('step')
            if n == 1 and prev:
                # Authors often build one sequence out of several one-item lists ("1. 1. 1."):
                # a new list starting right after a step continues that sequence.
                n = prev['num'] + 1
            self.counters[counter_key] = n
            self.out.append({'type': 'step', 'num': n, 'text': text})
            return
        lvl = min(level, 2)
        prev = self._last('list')
        if prev and prev.get('level', 0) == lvl:
            prev['items'].append(text)
        else:
            blk = {'type': 'list', 'items': [text]}
            if lvl:
                blk['level'] = lvl
            self.out.append(blk)

    def finish(self, title=''):
        out = self.out
        # Drop a leading title that only repeats the tab/file name.
        if out and out[0]['type'] in ('sub', 'p') and title:
            t, n = norm(out[0]['text']), norm(title)
            if t == n or t in (n + 'guide', 'network' + n) or (len(t) > 3 and t in n):
                out = out[1:]
        # Drop a trailing empty heading.
        while out and out[-1]['type'] == 'sub':
            out = out[:-1]
        return out


# ── DOCX ─────────────────────────────────────────────────────

class DocxNumbering:
    def __init__(self, document):
        self.fmt = {}      # (numId, ilvl) -> numFmt
        self.abstract = {}  # numId -> abstractNumId
        try:
            root = document.part.numbering_part.element
        except Exception:
            return
        abstract_fmts = {}
        for an in root.findall(qn('w:abstractNum')):
            aid = an.get(qn('w:abstractNumId'))
            for lvl in an.findall(qn('w:lvl')):
                f = lvl.find(qn('w:numFmt'))
                abstract_fmts[(aid, lvl.get(qn('w:ilvl')))] = f.get(qn('w:val')) if f is not None else 'decimal'
        for num in root.findall(qn('w:num')):
            nid = num.get(qn('w:numId'))
            aid = num.find(qn('w:abstractNumId')).get(qn('w:val'))
            self.abstract[nid] = aid
            for ilvl in range(9):
                self.fmt[(nid, str(ilvl))] = abstract_fmts.get((aid, str(ilvl)), 'decimal')

    def lookup(self, nid, ilvl):
        return self.fmt.get((nid, ilvl), 'decimal'), self.abstract.get(nid, nid)


def docx_runs_text(el, rels):
    """Text of a paragraph (or hyperlink) element, with hyperlinks as [text](url)."""
    parts = []
    field_url, field_text, in_field_result = None, [], False
    for child in el.iterchildren():
        tag = child.tag
        if tag == qn('w:hyperlink'):
            rid = child.get(qn('r:id'))
            url = rels[rid].target_ref if rid and rid in rels else ''
            parts.append(link(docx_runs_text(child, rels), url))
        elif tag in (qn('w:r'), qn('w:ins'), qn('w:smartTag'), qn('w:customXml')):
            if tag != qn('w:r'):
                parts.append(docx_runs_text(child, rels))
                continue
            for r in child.iterchildren():
                if r.tag == qn('w:fldChar'):
                    kind = r.get(qn('w:fldCharType'))
                    if kind == 'separate' and field_url is not None:
                        in_field_result = True
                    elif kind == 'end' and field_url is not None:
                        parts.append(link(''.join(field_text), field_url))
                        field_url, field_text, in_field_result = None, [], False
                elif r.tag == qn('w:instrText'):
                    m = re.search(r'HYPERLINK\s+"([^"]+)"', r.text or '')
                    if m:
                        field_url = m.group(1)
                else:
                    txt = ''
                    if r.tag == qn('w:t'):
                        txt = r.text or ''
                    elif r.tag == qn('w:tab'):
                        txt = '\t'
                    elif r.tag in (qn('w:br'), qn('w:cr')):
                        txt = '\n'
                    if in_field_result:
                        field_text.append(txt)
                    else:
                        parts.append(txt)
        elif tag == qn('w:fldSimple'):
            m = re.search(r'HYPERLINK\s+"([^"]+)"', child.get(qn('w:instr')) or '')
            inner = docx_runs_text(child, rels)
            parts.append(link(inner, m.group(1)) if m else inner)
    return ''.join(parts)


def docx_is_bold(p_el):
    runs = [r for r in p_el.iter(qn('w:r')) if ''.join(t.text or '' for t in r.iter(qn('w:t'))).strip()]
    if not runs:
        return False
    for r in runs:
        b = r.find(qn('w:rPr') + '/' + qn('w:b'))
        if b is None or b.get(qn('w:val')) in ('0', 'false'):
            return False
    return True


def docx_images(el, part):
    blocks = []
    for blip in el.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}blip'):
        rid = blip.get(qn('r:embed'))
        if rid and rid in part.rels:
            blocks.append(screenshot_block(part.rels[rid].target_part.blob))
    for im in el.iter('{urn:schemas-microsoft-com:vml}imagedata'):
        rid = im.get(qn('r:id'))
        if rid and rid in part.rels:
            blocks.append(screenshot_block(part.rels[rid].target_part.blob))
    return [b for b in blocks if b]


def table_rows(rows):
    rows = [[clean(c) for c in r] for r in rows]
    rows = [r for r in rows if any(r)]
    if not rows:
        return []
    width = max(len(r) for r in rows)
    rows = [r + [''] * (width - len(r)) for r in rows]
    keep = [i for i in range(width) if any(r[i] for r in rows)]
    return [[r[i] for i in keep] for r in rows]


def convert_docx(path, title):
    d = docx.Document(path)
    numbering = DocxNumbering(d)
    rels = d.part.rels
    b = Blocks()

    def walk(container):
        for el in container.iterchildren():
            if el.tag == qn('w:sdt'):
                content = el.find(qn('w:sdtContent'))
                if content is not None:
                    walk(content)
            elif el.tag == qn('w:p'):
                paragraph(el)
            elif el.tag == qn('w:tbl'):
                table(el)

    def paragraph(el):
        text = docx_runs_text(el, rels)
        pstyle = el.find(qn('w:pPr') + '/' + qn('w:pStyle'))
        style = pstyle.get(qn('w:val')) if pstyle is not None else ''
        heading = bool(re.match(r'(?i)^(heading|title)', style))
        num = el.find(qn('w:pPr') + '/' + qn('w:numPr'))
        if num is not None and clean(text):
            nid_el, lvl_el = num.find(qn('w:numId')), num.find(qn('w:ilvl'))
            nid = nid_el.get(qn('w:val')) if nid_el is not None else '0'
            ilvl = lvl_el.get(qn('w:val')) if lvl_el is not None else '0'
            fmt, abstract = numbering.lookup(nid, ilvl)
            if nid != '0' and fmt != 'none':
                b.item(text, numbered=fmt != 'bullet', level=int(ilvl), counter_key=abstract)
            else:
                b.para(text, bold=docx_is_bold(el), heading=heading)
        else:
            b.para(text, bold=docx_is_bold(el), heading=heading)
        for img in docx_images(el, d.part):
            b.add(img)

    def table(el):
        rows, images = [], []
        for tr in el.findall(qn('w:tr')):
            row = []
            for tc in tr.findall(qn('w:tc')):
                paras = [docx_runs_text(p, rels) for p in tc.iter(qn('w:p'))]
                row.append('\n'.join(clean(p) for p in paras if clean(p)))
                images.extend(docx_images(tc, d.part))
            rows.append(row)
        rows = table_rows(rows)
        if len(rows) == 1 and len(rows[0]) == 1:
            b.para(rows[0][0])
        elif rows:
            b.add({'type': 'table', 'rows': rows})
        for img in images:
            b.add(img)

    walk(d.element.body)
    return b.finish(title)


# ── ODT ──────────────────────────────────────────────────────

NS = {
    'office': 'urn:oasis:names:tc:opendocument:xmlns:office:1.0',
    'text': 'urn:oasis:names:tc:opendocument:xmlns:text:1.0',
    'style': 'urn:oasis:names:tc:opendocument:xmlns:style:1.0',
    'fo': 'urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0',
    'table': 'urn:oasis:names:tc:opendocument:xmlns:table:1.0',
    'xlink': 'http://www.w3.org/1999/xlink',
}


def T(ns, name):
    return '{%s}%s' % (NS[ns], name)


def convert_odt(path, title):
    with zipfile.ZipFile(path) as z:
        root = ET.fromstring(z.read('content.xml'))
        styles_root = ET.fromstring(z.read('styles.xml')) if 'styles.xml' in z.namelist() else None

    bold_styles, numbered_lists = set(), {}
    for sroot in (styles_root, root):
        if sroot is None:
            continue
        for st in sroot.iter(T('style', 'style')):
            tp = st.find(T('style', 'text-properties'))
            if tp is not None and tp.get(T('fo', 'font-weight')) in ('bold', '600', '700', '800'):
                bold_styles.add(st.get(T('style', 'name')))
        for ls in sroot.iter(T('text', 'list-style')):
            first = next(iter(ls), None)
            numbered_lists[ls.get(T('style', 'name'))] = first is not None and first.tag == T('text', 'list-level-style-number')

    def text_of(el):
        parts = [el.text or '']
        for c in el:
            if c.tag == T('text', 's'):
                parts.append(' ' * int(c.get(T('text', 'c'), '1')))
            elif c.tag == T('text', 'tab'):
                parts.append('\t')
            elif c.tag == T('text', 'line-break'):
                parts.append('\n')
            elif c.tag == T('text', 'a'):
                parts.append(link(text_of(c), c.get(T('xlink', 'href'), '')))
            else:
                parts.append(text_of(c))
            parts.append(c.tail or '')
        return ''.join(parts)

    def is_bold(el):
        if el.get(T('text', 'style-name')) in bold_styles:
            return True
        spans = [s for s in el.iter(T('text', 'span')) if (s.text or '').strip()]
        own = (el.text or '').strip()
        return bool(spans) and not own and all(s.get(T('text', 'style-name')) in bold_styles for s in spans)

    b = Blocks()

    def walk(container, list_level=-1, numbered=False, list_key=None):
        for el in container:
            if el.tag == T('text', 'h'):
                b.para(text_of(el), heading=True)
            elif el.tag == T('text', 'p'):
                if list_level >= 0:
                    b.item(text_of(el), numbered, list_level, list_key)
                else:
                    b.para(text_of(el), bold=is_bold(el))
            elif el.tag == T('text', 'list'):
                name = el.get(T('text', 'style-name'))
                num = numbered_lists.get(name, numbered) if name else numbered
                walk(el, list_level + 1, num, list_key or name or id(el))
            elif el.tag in (T('text', 'list-item'), T('text', 'list-header'), T('text', 'section')):
                walk(el, list_level, numbered, list_key)
            elif el.tag == T('table', 'table'):
                rows = [[clean('\n'.join(text_of(p) for p in cell.iter(T('text', 'p'))))
                         for cell in row.iter(T('table', 'table-cell'))]
                        for row in el.iter(T('table', 'table-row'))]
                rows = table_rows(rows)
                if rows:
                    b.add({'type': 'table', 'rows': rows})

    walk(root.find(T('office', 'body')).find(T('office', 'text')))
    return b.finish(title)


# ── XLSX ─────────────────────────────────────────────────────

def cell_str(v):
    if v is None:
        return ''
    if isinstance(v, datetime.datetime):
        return v.strftime('%Y-%m-%d') if v.time() == datetime.time() else v.strftime('%Y-%m-%d %H:%M')
    if isinstance(v, float) and v.is_integer():
        return str(int(v))
    return str(v).strip()


def convert_xlsx(path, title):
    wb = openpyxl.load_workbook(path, data_only=True)
    out = []
    sheets = [ws for ws in wb.worksheets if ws.sheet_state == 'visible']
    for ws in sheets:
        rows = table_rows([[cell_str(v) for v in r] for r in ws.iter_rows(values_only=True)])
        if not rows:
            continue
        if len(sheets) > 1:
            out.append({'type': 'sub', 'text': ws.title})
        header, body = rows[0], rows[1:]
        sheet, chunk = [], []

        def flush():
            if chunk:
                # Section-label columns are empty inside a section, so drop columns with no data here.
                keep = [i for i in range(len(header)) if any(r[i] for r in chunk)]
                sheet.append({'type': 'table', 'rows': [[r[i] for i in keep] for r in [header] + chunk]})
                chunk.clear()

        for r in body:
            filled = [c for c in r if c]
            if len(filled) == 1 and r[0] and len(r) > 2:  # section label row, e.g. "Club House"
                flush()
                sheet.append({'type': 'sub', 'text': filled[0]})
            else:
                chunk.append(r)
        flush()
        if not any(b['type'] == 'table' for b in sheet):
            # Only headings and section labels: an unfilled template. Say so instead of showing empty headings.
            sections = [r[0] for r in body if r and r[0]]
            sheet = [{'type': 'note', 'text': 'No entries yet: the source spreadsheet is an empty template.'},
                     {'type': 'p', 'text': 'Columns: ' + ', '.join(h for h in header if h)}]
            if sections:
                sheet.append({'type': 'p', 'text': 'Sections: ' + ', '.join(sections)})
        out += sheet
    return out


def convert_doc(path, title):
    ext = os.path.splitext(path)[1].lower()
    if ext == '.docx':
        return convert_docx(path, title)
    if ext == '.odt':
        return convert_odt(path, title)
    if ext == '.xlsx':
        return convert_xlsx(path, title)
    return []


# ── tree building ────────────────────────────────────────────

def doc_title(filename, code):
    t = os.path.splitext(filename)[0]
    t = re.sub(r'\s*\+\s*form\s*$', '', t, flags=re.I)
    t = re.sub(r'^(%s|RES|IGC|LCCC)\s*-\s*' % re.escape(code), '', t)
    t = re.sub(r'^Current\s+', 'Current ', t)
    return t.strip()


def ordered(names, order):
    rank = {n.lower(): i for i, n in enumerate(order)}
    return sorted(names, key=lambda n: (rank.get(n.lower(), len(order)), n.lower()))


class PhotoWriter:
    def __init__(self, code):
        self.code = code
        self.dir = os.path.join(CLIENTS_DIR, code)
        self.n = 0
        self.bytes = 0

    def gallery(self, name, files, note=None):
        photos = []
        for f in sorted(files, key=lambda p: os.path.basename(p).lower()):
            with open(f, 'rb') as fh:
                data = fh.read()
            try:
                b64, w, h = to_jpeg(data, max_side=PHOTO_MAX_SIDE, quality=PHOTO_QUALITY)
            except Exception as e:
                print('    ! skipped photo', os.path.basename(f), e)
                continue
            caption = os.path.splitext(os.path.basename(f))[0].strip()
            photos.append({'name': caption, 'b64': b64, 'w': w, 'h': h})
        if not photos:
            return None
        self.n += 1
        chunk = 'p%02d' % self.n
        os.makedirs(self.dir, exist_ok=True)
        text = json.dumps(photos, ensure_ascii=False, separators=(',', ':'))
        self.bytes += len(text)
        with open(os.path.join(self.dir, chunk + '.json'), 'w', encoding='utf-8') as fh:
            fh.write(text)
        node = {'type': 'photos', 'name': name, 'count': len(photos), 'chunk': f'{self.code}/{chunk}'}
        if note:
            node['note'] = note
        return node


def folder_note(docs):
    notes = []
    for f in docs:
        blocks = convert_doc(f, '')
        text = ' '.join(b.get('text', '') for b in blocks).strip()
        notes.append(text or os.path.splitext(os.path.basename(f))[0])
    return ' '.join(notes) or None


def photo_tree(path, name, writer):
    """Folder of photos -> photos node, or folder node with sub-galleries."""
    entries = sorted(os.listdir(path), key=str.lower)
    images = [os.path.join(path, e) for e in entries if e.lower().endswith(IMAGE_EXT)]
    docs = [os.path.join(path, e) for e in entries if e.lower().endswith(DOC_EXT)]
    subdirs = [e for e in entries if os.path.isdir(os.path.join(path, e))]
    note = folder_note(docs) if docs else None
    children = [c for c in (photo_tree(os.path.join(path, s), s, writer) for s in subdirs) if c]
    if not children:
        return writer.gallery(name, images, note)
    if images:
        g = writer.gallery('General photos', images)
        if g:
            children.insert(0, g)
    node = {'type': 'folder', 'name': name, 'children': children}
    if note:
        node['note'] = note
    return node


def files_node(paths, code, order, name=None):
    tabs = []
    titles = {doc_title(os.path.basename(p), code): p for p in paths}
    for t in ordered(list(titles), order):
        blocks = convert_doc(titles[t], t)
        tabs.append({'tab': t, 'blocks': blocks or [{'type': 'p', 'text': 'This document is empty.'}]})
    if not tabs:
        return None
    if len(tabs) == 1:
        return {'type': 'file', 'name': name or tabs[0]['tab'], 'blocks': tabs[0]['blocks']}
    node = {'type': 'files', 'tabs': tabs}
    if name:
        node['name'] = name
    return node


def build_client(src_dir, code, display):
    # Zips wrap everything in one top folder (e.g. "New BGR - Beach Grove Golf Club").
    base = src_dir
    while True:
        entries = os.listdir(base)
        dirs = [e for e in entries if os.path.isdir(os.path.join(base, e))]
        if len(dirs) == 1 and len(entries) == 1:
            base = os.path.join(base, dirs[0])
        else:
            break

    writer = PhotoWriter(code)
    if os.path.isdir(writer.dir):
        shutil.rmtree(writer.dir)
    sections = {}
    for entry in sorted(os.listdir(base), key=str.lower):
        p = os.path.join(base, entry)
        if os.path.isdir(p):
            key = entry.strip().lower()
            key = 'applications' if key in ('application', 'apps') else key
            sections[key] = p

    def list_files(path, exts):
        return [os.path.join(path, f) for f in sorted(os.listdir(path), key=str.lower)
                if f.lower().endswith(exts) and not f.startswith('~$')]

    children = []

    # Applications
    apps = sections.pop('applications', None)
    app_node = files_node(list_files(apps, DOC_EXT), code, []) if apps else None
    children.append({'type': 'folder', 'name': 'Applications', 'children': [app_node] if app_node else []})

    # General: Guides (tabs), Printers, spreadsheets, loose photos
    gen = sections.pop('general', None)
    gen_children = []
    if gen:
        docs = list_files(gen, ('.docx', '.odt'))
        printers = [d for d in docs if doc_title(os.path.basename(d), code).lower() == 'printers']
        guides = [d for d in docs if d not in printers]
        g = files_node(guides, code, GUIDE_ORDER)
        if g:
            gen_children.append({'type': 'folder', 'name': 'Guides', 'children': [g]})
        for d in printers:
            gen_children.append({'type': 'file', 'name': 'Printers', 'blocks': convert_doc(d, 'Printers')})
        for x in list_files(gen, ('.xlsx',)):
            t = doc_title(os.path.basename(x), code)
            gen_children.append({'type': 'file', 'name': t, 'blocks': convert_doc(x, t)})
        loose = list_files(gen, IMAGE_EXT)
        if loose:
            ph = writer.gallery('Photos', loose)
            if ph:
                gen_children.append(ph)
    children.append({'type': 'folder', 'name': 'General', 'children': gen_children})

    # Network: Overview / VPN / RDP (+ spreadsheets) as tabs
    net = sections.pop('network', None)
    net_node = files_node(list_files(net, DOC_EXT), code, NETWORK_ORDER) if net else None
    children.append({'type': 'folder', 'name': 'Network', 'children': [net_node] if net_node else []})

    # Photos
    photos = sections.pop('photos', None)
    if photos:
        ph = photo_tree(photos, 'Photos', writer)
        if ph:
            if ph['type'] == 'photos':
                ph = {'type': 'folder', 'name': 'Photos', 'children': [ph]}
            children.append(ph)

    # Anything unexpected: keep it rather than silently dropping content.
    for key, p in sections.items():
        name = os.path.basename(p)
        node = files_node(list_files(p, DOC_EXT), code, [], name)
        extra = [node] if node else []
        imgs = list_files(p, IMAGE_EXT)
        if imgs:
            g = writer.gallery('Photos', imgs)
            if g:
                extra.append(g)
        children.append({'type': 'folder', 'name': name, 'children': extra})
        print(f'    + extra section "{name}"')

    tree = {'name': display, 'children': children}
    os.makedirs(CLIENTS_DIR, exist_ok=True)
    text = json.dumps(tree, ensure_ascii=False, indent=1)
    with open(os.path.join(CLIENTS_DIR, code + '.json'), 'w', encoding='utf-8') as fh:
        fh.write(text)
    print(f'  {code}: docs {len(text) // 1024} KB, {writer.n} galleries {writer.bytes // 1024} KB')


# ── loader map ───────────────────────────────────────────────

def write_loaders():
    codes = sorted(f[:-5] for f in os.listdir(CLIENTS_DIR) if f.endswith('.json'))
    photo_chunks = []
    for code in codes:
        d = os.path.join(CLIENTS_DIR, code)
        if os.path.isdir(d):
            photo_chunks += [f'{code}/{f[:-5]}' for f in sorted(os.listdir(d)) if f.endswith('.json')]

    def chunk_name(key):
        return re.sub(r'[^a-z0-9]+', '-', key.lower())

    lines = [
        '// AUTO-GENERATED by tools/build_kb_data.py. Do not edit by hand; re-run the script instead.',
        '// Every client (and every photo gallery) is a separate webpack chunk that is only',
        '// downloaded when it is opened, so the main web part bundle stays small.',
        "import type { ClientTree, Photo } from './types';",
        '',
        '/* eslint-disable @typescript-eslint/no-explicit-any */',
        'const unwrap = <T,>(m: any): T => (m && m.default !== undefined ? m.default : m) as T;',
        '',
        'export const CLIENT_LOADERS: Record<string, () => Promise<ClientTree>> = {',
    ]
    for c in codes:
        lines.append(f"  '{c}': () => import(/* webpackChunkName: \"kb-client-{chunk_name(c)}\" */ './clients/{c}.json').then(m => unwrap<ClientTree>(m)),")
    lines += ['};', '', 'export const PHOTO_LOADERS: Record<string, () => Promise<Photo[]>> = {']
    for k in photo_chunks:
        lines.append(f"  '{k}': () => import(/* webpackChunkName: \"kb-photos-{chunk_name(k)}\" */ './clients/{k}.json').then(m => unwrap<Photo[]>(m)),")
    lines += ['};', '']
    with open(os.path.join(DATA_DIR, 'clientLoaders.ts'), 'w', encoding='utf-8', newline='\n') as fh:
        fh.write('\n'.join(lines))
    print(f'clientLoaders.ts: {len(codes)} clients, {len(photo_chunks)} photo galleries')


def main(argv):
    if '--loaders' not in argv:
        only = {a.upper() for a in argv}
        for rel, (code, display) in SOURCES.items():
            if only and code not in only:
                continue
            src = lp(os.path.join(EXTRACTED, *rel.split('/')))
            if not os.path.isdir(src):
                print(f'  ! {rel}: not extracted, skipped')
                continue
            print(f'{code} <- {rel}')
            build_client(src, code, display)
    write_loaders()


if __name__ == '__main__':
    main(sys.argv[1:])
