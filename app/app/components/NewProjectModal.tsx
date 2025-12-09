import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ProjectTemplate } from '../types';
import { PROJECT_TEMPLATES } from '../constants';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (template: ProjectTemplate) => void;
}

const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose, onCreateProject }) => {
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  useEffect(() => {
    setModalRoot(document.getElementById('modal-root'));
  }, []);
  
  useEffect(() => {
    if (isOpen) {
        setSelectedTemplateId(null); // Reset selection when modal opens
    }
  }, [isOpen]);

  const handleCreate = () => {
      const selectedTemplate = PROJECT_TEMPLATES.find(t => t.id === selectedTemplateId);
      if (selectedTemplate) {
          onCreateProject(selectedTemplate);
      }
  };

  if (!isOpen || !modalRoot) return null;

  const modalMarkup = (
    <div 
      className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-zinc-900 rounded-lg shadow-2xl w-full max-w-2xl m-4 border border-zinc-800 flex flex-col max-h-[90vh] animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-zinc-800 flex justify-between items-center flex-shrink-0">
            <div>
                <h2 className="text-xl font-semibold">สร้างโครงการใหม่</h2>
                <p className="text-sm text-zinc-400">เลือกเทมเพลตเพื่อเริ่มต้นใช้งาน</p>
            </div>
            <button onClick={onClose} className="text-zinc-400 hover:text-white">
                <i className="fas fa-times"></i>
            </button>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
            {PROJECT_TEMPLATES.map(template => (
                <button
                    key={template.id}
                    onClick={() => setSelectedTemplateId(template.id)}
                    className={`p-4 rounded-lg text-left transition-all transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 ${
                        selectedTemplateId === template.id
                         ? `bg-blue-600/20 ring-2 ring-blue-500`
                         : 'bg-zinc-800/50 hover:bg-zinc-700/50 ring-1 ring-zinc-700'
                    }`}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${template.color}`}>
                            <i className={`${template.icon} text-white text-lg`}></i>
                        </div>
                        <h3 className="font-bold text-white text-lg">{template.name}</h3>
                    </div>
                    <p className="text-sm text-zinc-400">{template.description}</p>
                </button>
            ))}
        </div>

        <div className="p-4 bg-zinc-950/50 border-t border-zinc-800 flex justify-end gap-3 rounded-b-lg flex-shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md font-semibold transition-colors bg-zinc-700 hover:bg-zinc-600">
                ยกเลิก
            </button>
            <button 
                type="button" 
                onClick={handleCreate}
                disabled={!selectedTemplateId}
                className="px-4 py-2 rounded-md font-semibold transition-colors bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                สร้างโครงการ
            </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalMarkup, modalRoot);
};

export default NewProjectModal;
