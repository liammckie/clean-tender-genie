
import React from 'react';

interface CodeBlockProps {
  language: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="relative rounded-lg overflow-hidden my-4">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
        <div className="text-xs font-mono text-gray-400">{language}</div>
        <button
          onClick={copyToClipboard}
          className="text-xs text-gray-400 hover:text-white"
        >
          Copy
        </button>
      </div>
      <pre className="bg-gray-900 p-4 overflow-x-auto">
        <code className="text-sm font-mono text-gray-300">{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
