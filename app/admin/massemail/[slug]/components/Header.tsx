import React, { useRef } from 'react';
import { PreviewMode, EmailRow, GlobalStyles } from '../types';
import {
  DesktopIcon,
  TabletIcon,
  MobileIcon,
  UndoIcon,
  RedoIcon,
  CodeIcon,
  DownloadIcon,
  UploadIcon,
  SendIcon,
} from './icons';

interface HeaderProps {
  onPreviewChange: (mode: PreviewMode) => void;
  currentPreview: PreviewMode;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onToggleCode: () => void;
  showCode: boolean;
  onHtmlImport: (html: string) => void;
  generatedHtml: string;
  onJsonImport: (json: string) => void;
  emailData: EmailRow[];
  globalStyles: GlobalStyles;
  onSendEmails: (option: number) => void;
}

const Header: React.FC<HeaderProps> = ({
  onPreviewChange,
  currentPreview,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onToggleCode,
  showCode,
  onHtmlImport,
  generatedHtml,
  onJsonImport,
  emailData,
  globalStyles,
  onSendEmails,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onHtmlImport(content);
      };
      reader.readAsText(file);
      event.target.value = ''; // Reset to allow re-uploading same file
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleExportClick = () => {
    const blob = new Blob([generatedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleJsonFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onJsonImport(content);
      };
      reader.readAsText(file);
      event.target.value = ''; // Reset to allow re-uploading same file
    }
  };

  const handleJsonImportClick = () => {
    jsonFileInputRef.current?.click();
  };

  const handleJsonExportClick = () => {
    const dataToExport = {
      rows: emailData,
      styles: globalStyles,
    };
    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const previewModes: { mode: PreviewMode; icon: React.ReactNode }[] = [
    { mode: 'desktop', icon: <DesktopIcon /> },
    { mode: 'tablet', icon: <TabletIcon /> },
    { mode: 'mobile', icon: <MobileIcon /> },
  ];

  return (
    <header className="  border-b border-slate-200 px-4 py-2 flex flex-col items-center justify-between   z-20">
      <div className="w-full flex flex-row items-center justify-center ">
        <button className="btnFancy " onClick={() => onSendEmails(2)}>
          Send Emails
        </button>
        <button className="btnFancy" onClick={() => onSendEmails(1)}>
          Send test Email
        </button>
        <button className="btnFancy" onClick={() => onSendEmails(3)}>
          Send extra Email
        </button>
      </div>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          {previewModes.map(({ mode, icon }) => (
            <button
              key={mode}
              onClick={() => onPreviewChange(mode)}
              className={`p-2 rounded-md ${
                currentPreview === mode
                  ? 'bg-indigo-100 text-brand-primary'
                  : 'hover:bg-slate-100 text-slate-500'
              }`}
              title={`Preview on ${
                mode.charAt(0).toUpperCase() + mode.slice(1)
              }`}
            >
              {icon}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2 rounded-md hover:bg-slate-100 text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo"
          >
            <UndoIcon />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-2 rounded-md hover:bg-slate-100 text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo"
          >
            <RedoIcon />
          </button>
          <div className="w-px h-6 bg-slate-200 mx-2"></div>
          {/*         
        <input type="file" accept=".html" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        <button onClick={handleImportClick} className="flex items-center gap-2 px-4 py-2 text-sm font-medium btnFancy" title="Import HTML"><UploadIcon className="w-4 h-4" /> Import HTML</button> */}

          <input
            type="file"
            accept=".json,.txt"
            ref={jsonFileInputRef}
            onChange={handleJsonFileChange}
            className="hidden"
          />
          <button
            onClick={handleJsonImportClick}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium  btnFancy rounded-md "
            title="Import JSON Template"
          >
            <UploadIcon className="w-4 h-4" /> Import Design
          </button>

          <button
            onClick={handleExportClick}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium btnFancy rounded-md "
            title="Export HTML"
          >
            <DownloadIcon className="w-4 h-4" /> Export HTML
          </button>

          <button
            onClick={handleJsonExportClick}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium  btnFancy rounded-md  "
            title="Export JSON Template"
          >
            <DownloadIcon className="w-4 h-4" /> Export Design
          </button>

          <div className="w-px h-6 bg-slate-200 mx-2"></div>
          <button
            onClick={onToggleCode}
            className={`p-2 rounded-md ${
              showCode
                ? 'bg-indigo-100 text-brand-primary'
                : 'hover:bg-slate-100 text-slate-500'
            }`}
            title={showCode ? 'Hide Code' : 'Show Code'}
          >
            <CodeIcon />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
