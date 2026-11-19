// Local preview harness: renders the compiled web part component outside SharePoint.
// Build: `npx gulp bundle --ship` (compiles src -> lib), then `node tools/preview/build.js`.
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import KnowledgeBase from '../../lib/webparts/knowledgeBase2/components/KnowledgeBase2';

ReactDOM.render(React.createElement(KnowledgeBase, {}), document.getElementById('root'));
