// Bundles tools/preview/entry.js into temp/preview (served by the "kb-preview" launch config).
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const root = path.resolve(__dirname, '../..');
const out = path.join(root, 'temp', 'preview');

webpack({
  mode: 'development',
  devtool: false,
  context: root,
  entry: path.join(__dirname, 'entry.js'),
  output: { path: out, filename: 'main.js', chunkFilename: '[name].js', publicPath: 'auto' },
  resolve: { modules: [path.join(root, 'node_modules')] },
  // SharePoint supplies React at runtime; the preview loads the same version from cdnjs.
  externals: { react: 'React', 'react-dom': 'ReactDOM' },
}, (err, stats) => {
  if (err) { console.error(err); process.exit(1); }
  if (stats.hasErrors()) { console.error(stats.toString('errors-only')); process.exit(1); }
  fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(out, 'index.html'));
  console.log(`Preview built in ${path.relative(root, out)}`);
});
