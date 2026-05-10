import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
import { MergeView } from "@codemirror/merge";
import { markdown } from "@codemirror/lang-markdown";
import { oneDark } from "@codemirror/theme-one-dark";

// Default content for the diff viewer
const defaultDocA = `# Welcome to the Markdown Diff Viewer!

This is a simple tool to compare two markdown documents.
It supports **bold**, *italic*, and \`code\` syntax highlighting.

- Item 1
- Item 2
- Item 3

## This is the Original version
Some more text here.
`;

const defaultDocB = `# Welcome to the Markdown Diff Viewer!

This is a very simple tool to compare two markdown documents.
It supports **bold**, *italic*, and \`code\` syntax highlighting.

- Item 1
- Item 2 modified
- Item 3

## This is the Modified version
Some more text here.
New line added!
`;

let mergeView = null;
let target = document.getElementById("editor-container");

function initMergeView(docA, docB) {
  if (mergeView) {
    mergeView.destroy();
    target.innerHTML = ''; // clear the container just in case
  }

  mergeView = new MergeView({
    a: {
      doc: docA,
      extensions: [
        basicSetup,
        markdown(),
        oneDark,
        EditorView.lineWrapping,
        EditorState.readOnly.of(false)
      ]
    },
    b: {
      doc: docB,
      extensions: [
        basicSetup,
        markdown(),
        oneDark,
        EditorView.lineWrapping,
        EditorState.readOnly.of(false)
      ]
    },
    diffConfig: {
      scanLimit: 1e9 // High limit to ensure full precision diffs for long texts
    },
    parent: target
  });
}

// Initialize the merge view
initMergeView(defaultDocA, defaultDocB);

document.getElementById('force-diff-btn').addEventListener('click', () => {
  if (mergeView) {
    const docA = mergeView.a.state.doc.toString();
    const docB = mergeView.b.state.doc.toString();
    initMergeView(docA, docB);
  }
});

document.getElementById('clear-left-btn').addEventListener('click', () => {
  if (mergeView) {
    mergeView.a.dispatch({
      changes: { from: 0, to: mergeView.a.state.doc.length, insert: "" }
    });
  }
});

function downloadString(text, fileType, fileName) {
  const blob = new Blob([text], { type: fileType });
  const a = document.createElement('a');
  a.download = fileName;
  a.href = URL.createObjectURL(blob);
  a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  setTimeout(function() {
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }, 1500);
}

document.getElementById('download-left-btn').addEventListener('click', () => {
  if (mergeView) {
    const docA = mergeView.a.state.doc.toString();
    downloadString(docA, 'text/markdown', 'left.md');
  }
});

document.getElementById('download-right-btn').addEventListener('click', () => {
  if (mergeView) {
    const docB = mergeView.b.state.doc.toString();
    downloadString(docB, 'text/markdown', 'right.md');
  }
});

document.getElementById('scroll-top-btn').addEventListener('click', () => {
  if (mergeView) {
    // Scroll both editors to the top
    mergeView.a.dispatch({
      effects: EditorView.scrollIntoView(0, { y: "start" })
    });
    mergeView.b.dispatch({
      effects: EditorView.scrollIntoView(0, { y: "start" })
    });
  }
});

document.getElementById('clear-right-btn').addEventListener('click', () => {
  if (mergeView) {
    mergeView.b.dispatch({
      changes: { from: 0, to: mergeView.b.state.doc.length, insert: "" }
    });
  }
});
