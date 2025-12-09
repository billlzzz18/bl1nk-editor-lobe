import React from 'react';

interface HeaderProps {
    projectName: string;
    onToggleSidebar: () => void;
    onOpenShareModal?: () => void;
    isReadOnly?: boolean;
}

const Header: React.FC<HeaderProps> = ({ projectName, onToggleSidebar, onOpenShareModal, isReadOnly = false }) => {
  return (
    <header className="p-4 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between gap-4 flex-shrink-0">
      <div className="flex items-center gap-4 min-w-0">
        {!isReadOnly && (
          <button onClick={onToggleSidebar} className="md:hidden text-zinc-400 hover:text-white" aria-label="Toggle sidebar">
            <i className="fa-solid fa-bars text-xl"></i>
          </button>
        )}
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center shadow-lg flex-shrink-0">
          <i className="fa-solid fa-brain text-xl"></i>
        </div>
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-white truncate" title={projectName}>{projectName || 'AI Assistant'}</h1>
          <p className="text-sm text-zinc-400">{isReadOnly ? 'โหมดดูเท่านั้น' : 'เชื่อมต่อกับ Notion & Drive ผ่าน Gemini'}</p>
        </div>
      </div>
      
      {!isReadOnly && onOpenShareModal && (
        <button 
          onClick={onOpenShareModal}
          disabled={!projectName}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold bg-zinc-800 hover:bg-zinc-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Share project"
        >
          <i className="fa-solid fa-arrow-up-from-bracket"></i>
          <span className="hidden sm:inline">แชร์</span>
        </button>
      )}
    </header>
  );
};

export default Header;