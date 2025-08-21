import { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

interface ErlangEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  height?: string;
  title?: string;
}

const ErlangEditor = ({
  value,
  onChange,
  readOnly = false,
  height = "400px",
  title,
}: ErlangEditorProps) => {
  const editorRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure Monaco only renders on client-side (avoid SSR issues)
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Register Erlang language
    monaco.languages.register({ id: "erlang" });

    // Define Erlang language configuration
    monaco.languages.setLanguageConfiguration("erlang", {
      comments: {
        lineComment: "%",
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
    });

    // Define Erlang syntax highlighting
    monaco.languages.setMonarchTokensProvider("erlang", {
      tokenizer: {
        root: [
          // Module declaration
          [/-module\s*\(\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\)/, "keyword.module"],

          // Attributes
          [/-[a-zA-Z_][a-zA-Z0-9_]*/, "keyword.attribute"],

          // Comments
          [/%.*$/, "comment"],

          // Strings
          [/"([^"\\]|\\.)*$/, "string.invalid"],
          [/"/, "string", "@string_double"],
          [/'([^'\\]|\\.)*$/, "string.invalid"],
          [/'/, "string", "@string_single"],

          // Numbers
          [/\d+\.?\d*/, "number"],

          // Keywords
          [
            /\b(after|begin|case|catch|cond|end|fun|if|let|of|query|receive|try|when)\b/,
            "keyword",
          ],
          [
            /\b(and|andalso|band|bnot|bor|bsl|bsr|bxor|div|not|or|orelse|rem|xor)\b/,
            "keyword.operator",
          ],

          // Built-in functions
          [
            /\b(atom_to_list|binary_to_list|element|hd|length|list_to_atom|list_to_binary|list_to_tuple|node|round|self|size|tl|trunc|tuple_to_list)\b/,
            "keyword.function",
          ],

          // Module functions
          [
            /\b(io:format|io:write|lists:|dict:|ets:|gen_server:)\b/,
            "keyword.module",
          ],

          // Atoms
          [/\b[a-z][a-zA-Z0-9_]*/, "variable"],
          [/'[^']*'/, "string.atom"],

          // Variables
          [/\b[A-Z_][a-zA-Z0-9_]*/, "variable.name"],

          // Operators and delimiters
          [/[{}()\[\]]/, "@brackets"],
          [/[<>]=?/, "operator"],
          [/[=:!]=/, "operator"],
          [/[+\-*\/]/, "operator"],
          [/[,;.]/, "delimiter"],
          [/->/, "operator.arrow"],
          [/::/, "operator.type"],
        ],

        string_double: [
          [/[^\\"]+/, "string"],
          [/\\./, "string.escape"],
          [/"/, "string", "@pop"],
        ],

        string_single: [
          [/[^\\']+/, "string"],
          [/\\./, "string.escape"],
          [/'/, "string", "@pop"],
        ],
      },
    });

    // Configure Erlang-specific editor settings
    editor.updateOptions({
      fontFamily: "JetBrains Mono, Fira Code, Consolas, monospace",
      fontLigatures: true,
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  return (
    <div className="relative">
      {title && (
        <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-4 py-2 text-sm font-medium rounded-t-md">
          {title}
        </div>
      )}
      {isClient ? (
        <Editor
          height={height}
          language="erlang"
          value={value}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
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
          className={`bg-gray-900 flex items-center justify-center text-white ${title ? "rounded-b-md" : "rounded-md"}`}
          style={{ height }}
        >
          Loading Erlang editor...
        </div>
      )}
    </div>
  );
};

export default ErlangEditor;
