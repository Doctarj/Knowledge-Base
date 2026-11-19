// Shape of the client documentation in data/clients/*.json (produced by tools/build_kb_data.py).

export interface DocBlock {
  // p | sub | step | list | table | image | note | indent
  type: string;
  text?: string;
  items?: string[];
  level?: number;   // list nesting (0 = top level)
  rows?: string[][]; // table: first row is the header
  num?: number;     // step number
  b64?: string;     // image: base64 JPEG
  w?: number;
  h?: number;
}

export interface Photo {
  name: string;
  b64: string;
  w: number;
  h: number;
}

export interface TreeNode {
  // folder | file | files | photos
  type: string;
  name?: string;
  note?: string;                            // short remark shown above a folder or gallery
  children?: TreeNode[];                    // folder
  blocks?: DocBlock[];                      // file
  tabs?: {tab: string; blocks: DocBlock[]}[]; // files
  photos?: Photo[];                         // photos stored inline (older clients)
  chunk?: string;                           // photos stored in a lazily loaded file (PHOTO_LOADERS key)
  count?: number;                           // number of photos in `chunk`
}

export interface ClientTree {
  name: string;
  children: TreeNode[];
}
