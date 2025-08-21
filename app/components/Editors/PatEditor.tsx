import { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

interface PatEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  height?: string;
  title?: string;
}

// Pat language definition for Monaco Editor
const patDefinition = {
  // Token rules for syntax highlighting
  tokenizer: {
    root: [
      // Comments
      [/#.*$/, "comment"],

      // Keywords
      [
        /\b(?:interface|def|let|in|guard|receive|from|spawn|new|free|empty|main)\b/,
        "keyword",
      ],

      // Built-in types
      [/\b(?:Unit|Int|Bool|String|Float|print|intToString)\b/, "type"],

      // Interface names (start with capital letter, followed by {)
      [/\b[A-Z][a-zA-Z0-9]*(?=\s*\{)/, "type.identifier"],

      // Message types (start with capital letter, followed by ()
      [/\b[A-Z][a-zA-Z0-9]*(?=\()/, "function"],

      // Mailbox capabilities (? and !)
      [/[?!]/, "operator.mailbox"],

      // Operators
      [/->/, "operator.arrow"],
      [/[.*+|&]/, "operator.regex"],
      [/!/, "operator.send"],
      [/[=]/, "operator.assignment"],

      // Strings
      [/"([^"\\]|\\.)*$/, "string.invalid"], // unterminated string
      [/"/, "string", "@string"],

      // Numbers
      [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
      [/\d+/, "number"],

      // Delimiters and operators
      [/[{}()\[\]]/, "@brackets"],
      [/[<>]/, "@brackets"],
      [/[,.]/, "delimiter"],
      [/[;:]/, "delimiter"],
    ],

    string: [
      [/[^\\"]+/, "string"],
      [/\\./, "string.escape.invalid"],
      [/"/, "string", "@pop"],
    ],
  },
};

// Language configuration
const patLanguageConfig = {
  comments: {
    lineComment: "#",
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
};

// Theme definition for Pat
const patTheme = {
  base: "vs-dark" as const,
  inherit: true,
  rules: [
    { token: "comment", foreground: "6A9955" },
    { token: "keyword", foreground: "569CD6", fontStyle: "bold" },
    { token: "type", foreground: "4EC9B0" },
    { token: "type.identifier", foreground: "4EC9B0", fontStyle: "bold" },
    { token: "function", foreground: "DCDCAA" },
    { token: "operator.mailbox", foreground: "FF6B6B", fontStyle: "bold" },
    { token: "operator.arrow", foreground: "C586C0" },
    { token: "operator.regex", foreground: "D7BA7D" },
    { token: "operator.send", foreground: "FF6B6B", fontStyle: "bold" },
    { token: "string", foreground: "CE9178" },
    { token: "number", foreground: "B5CEA8" },
    { token: "delimiter", foreground: "D4D4D4" },
  ],
  colors: {
    "editor.background": "#1E1E1E",
    "editor.foreground": "#D4D4D4",
    "editorLineNumber.foreground": "#5A5A5A",
    "editor.selectionBackground": "#264F78",
    "editor.inactiveSelectionBackground": "#3A3D41",
  },
};

const PatEditor = ({
  value,
  onChange,
  readOnly = false,
  height,
  title,
}: PatEditorProps) => {
  const editorRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure Monaco only renders on client-side (avoid SSR issues)
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Register Pat language
    monaco.languages.register({ id: "pat" });

    // Set language configuration
    monaco.languages.setLanguageConfiguration("pat", patLanguageConfig);

    // Set tokenization rules
    monaco.languages.setMonarchTokensProvider("pat", patDefinition);

    // Define and set theme
    monaco.editor.defineTheme("pat-dark", patTheme);
    monaco.editor.setTheme("pat-dark");

    // Focus editor for better UX
    if (!readOnly) {
      editor.focus();
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-lg ">
      {title && (
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-gray-100 px-4 py-3 text-sm font-semibold flex items-center gap-2">
          <span>{title}</span>
        </div>
      )}
      {isClient ? (
        <Editor
          height={height}
          language="pat"
          value={value}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme="pat-dark"
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: "on",
            contextmenu: true,
            selectOnLineNumbers: true,
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 3,
            renderLineHighlight: "line",
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
            },
          }}
        />
      ) : (
        <div
          className="bg-gray-900 flex items-center justify-center text-gray-400"
          style={{ height }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
            <p>Loading Pat Editor...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatEditor;
