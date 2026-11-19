"""Extract every source-docs/<REGION>/*.zip into source-docs/_extracted/<REGION>/<zip name>/.

Uses the \\\\?\\ prefix so paths longer than 260 characters work on Windows.
"""
import os
import sys
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'source-docs')
OUT = os.path.join(SRC, '_extracted')


def longpath(p: str) -> str:
    p = os.path.abspath(p)
    return p if p.startswith('\\\\?\\') or os.name != 'nt' else '\\\\?\\' + p


def main() -> None:
    for region in sorted(os.listdir(SRC)):
        rdir = os.path.join(SRC, region)
        if region.startswith('_') or not os.path.isdir(rdir):
            continue
        for zname in sorted(os.listdir(rdir)):
            if not zname.lower().endswith('.zip'):
                continue
            dest = os.path.join(OUT, region, zname[:-4])
            with zipfile.ZipFile(os.path.join(rdir, zname)) as z:
                for info in z.infolist():
                    target = longpath(os.path.join(dest, *info.filename.split('/')))
                    if info.is_dir():
                        os.makedirs(target, exist_ok=True)
                        continue
                    if os.path.exists(target) and os.path.getsize(target) == info.file_size:
                        continue
                    os.makedirs(os.path.dirname(target), exist_ok=True)
                    with z.open(info) as s, open(target, 'wb') as d:
                        d.write(s.read())
            print('extracted', region, zname, flush=True)


if __name__ == '__main__':
    sys.exit(main())
