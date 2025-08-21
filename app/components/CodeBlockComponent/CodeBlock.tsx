import { useEffect } from "react";
import Prism from "prismjs";

// Import CSS theme
import "prismjs/themes/prism-tomorrow.css";
// Import Erlang language support
import "prismjs/components/prism-erlang";

// custom Pat language syntax highlighting
Prism.languages.pat = {
  comment: /#.*/,
  string: {
    pattern: /"(?:[^"\\]|\\.)*"/,
    greedy: true,
  },
  keyword:
    /\b(?:interface|def|let|in|guard|receive|from|spawn|new|free|empty)\b/,
  builtin: /\b(?:Unit|Int|Bool|String|Float|print|intToString)\b/,
  operator: /[!.*+?|&]|\->/,
  punctuation: /[{}[\];(),]/,
  number: /\b\d+(?:\.\d+)?\b/,
  // Pat-specific patterns
  "interface-name": {
    pattern: /\b[A-Z][a-zA-Z0-9]*(?=\s*\{)/,
    alias: "class-name",
  },
  "message-type": {
    pattern: /\b[A-Z][a-zA-Z0-9]*(?=\()/,
    alias: "function",
  },
  "mailbox-type": {
    pattern: /[a-zA-Z_][a-zA-Z0-9_]*\s*:\s*[A-Z][a-zA-Z0-9]*[?!]/,
    inside: {
      "type-annotation": /[A-Z][a-zA-Z0-9]*[?!]/,
      variable: /[a-zA-Z_][a-zA-Z0-9_]*/,
      punctuation: /[:]/,
    },
  },
};

interface CodeBlockProps {
  children: string;
  language: "pat" | "erlang" | "javascript" | "typescript";
  className?: string;
  title?: string;
  height?: string;
}

const CodeBlock = ({
  children,
  language,
  className = "",
  title,
  height,
}: CodeBlockProps) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [children, language]);

  return (
    <div
      className={`rounded-lg overflow-hidden shadow-lg border border-gray-700 ${className}`}
    >
      {title && (
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-gray-100 px-4 py-3 text-sm font-semibold flex items-center gap-2">
          <span
            className={`${title.includes("Safe") ? "text-green-400" : "text-gray-200"}`}
          >
            {title}
          </span>
        </div>
      )}
      <pre
        className="bg-gray-900 text-gray-100 overflow-auto text-base leading-relaxed"
        style={{
          margin: 0,
          padding: "1rem",
          borderRadius: 0,
          background: "#111827",
          height: height || "400px",
          maxHeight: height || "400px",
        }}
      >
        <code
          className={`language-${language}`}
          style={{
            background: "transparent",
            padding: 0,
            margin: 0,
            fontSize: "inherit",
          }}
        >
          {children.trim()}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
