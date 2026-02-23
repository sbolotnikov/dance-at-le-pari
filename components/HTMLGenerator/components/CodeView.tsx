
import React, { useState } from 'react';

interface CodeViewProps {
  code: string;
}

const CodeView: React.FC<CodeViewProps> = ({ code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

  return (
    <aside className="w-1/3 bg-slate-800 text-white p-4 flex flex-col relative">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-200">HTML Code</h3>
            <button onClick={handleCopy} className="px-3 py-1 text-sm bg-slate-600 hover:bg-slate-500 rounded-md">
                {copied ? 'Copied!' : 'Copy'}
            </button>
        </div>
      <pre className="flex-1 overflow-auto text-sm bg-transparent p-2 rounded-md border border-slate-600">
        <code>
          {code}
        </code>
      </pre>
    </aside>
  );
};

export default CodeView;