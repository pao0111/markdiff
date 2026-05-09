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

// Initialize the merge view
let target = document.getElementById("editor-container");

let mergeView = new MergeView({
  a: {
    doc: defaultDocA,
    extensions: [
      basicSetup,
      markdown(),
      oneDark,
      EditorView.lineWrapping,
      EditorState.readOnly.of(false)
    ]
  },
  b: {
    doc: defaultDocB,
    extensions: [
      basicSetup,
      markdown(),
      oneDark,
      EditorView.lineWrapping,
      EditorState.readOnly.of(false)
    ]
  },
  parent: target
});
