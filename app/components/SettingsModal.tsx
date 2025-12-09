import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { CustomTool, Datasource, Project, Knowledge, Tag } from '../types';
import ToolEditor from './ToolEditor';
import { TAG_COLORS } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onUpdateProjectProperty: (key: keyof Project, value: any) => void;
  onAddTool: (tool: Omit<CustomTool, 'id'>) => void;
  onUpdateTool: (tool: CustomTool) => void;
  onDeleteTool: (toolId: string) => void;
  onExportTools: () => void;
  onImportTools: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAddDatasource: (datasource: Omit<Datasource, 'id'>) => void;
  onUpdateDatasource: (datasource: Datasource) => void;
  onDeleteDatasource: (datasourceId: string) => void;
  onAddKnowledge: (knowledge: Omit<Knowledge, 'id'>) => void;
  onUpdateKnowledge: (knowledge: Knowledge) => void;
  onDeleteKnowledge: (knowledgeId: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  project,
  onUpdateProjectProperty,
  onAddTool,
  onUpdateTool,
  onDeleteTool,
  onExportTools,
  onImportTools,
  onAddDatasource,
  onUpdateDatasource,
  onDeleteDatasource,
  onAddKnowledge,
  onUpdateKnowledge,
  onDeleteKnowledge
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'tools' | 'datasources' | 'knowledge'>('general');
  const [editingTool, setEditingTool] = useState<CustomTool | 'new' | null>(null);
  const [currentDatasource, setCurrentDatasource] = useState<Partial<Datasource> | null>(null);
  const [isNewDatasource, setIsNewDatasource] = useState(false);
  const [currentKnowledge, setCurrentKnowledge] = useState<Partial<Knowledge> | null>(null);
  const [isNewKnowledge, setIsNewKnowledge] = useState(false);
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);
  
  // State for General Tab
  const [projectName, setProjectName] = useState(project.name);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[9]);

  const importInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setModalRoot(document.getElementById('modal-root'));
  }, []);
  
  useEffect(() => {
    if (isOpen) {
        setProjectName(project.name);
        setNewTagName('');
        setNewTagColor(TAG_COLORS[9]);
        setActiveTab('general');
    }
  }, [isOpen, project]);


  if (!isOpen || !modalRoot) return null;

  const handleClose = () => {
    setEditingTool(null);
    setCurrentDatasource(null);
    setCurrentKnowledge(null);
    onClose();
  }

  const handleSaveTool = (toolData: CustomTool | Omit<CustomTool, 'id'>) => {
    if ('id' in toolData) {
      onUpdateTool(toolData);
    } else {
      onAddTool(toolData);
    }
    setEditingTool(null);
  };
  
  const handleEditDatasource = (ds: Datasource | 'new') => {
      if (ds === 'new') {
          setCurrentDatasource({});
          setIsNewDatasource(true);
      } else {
          setCurrentDatasource(ds);
          setIsNewDatasource(false);
      }
  }
  
  const handleEditKnowledge = (k: Knowledge | 'new') => {
      if (k === 'new') {
          setCurrentKnowledge({});
          setIsNewKnowledge(true);
      } else {
          setCurrentKnowledge(k);
          setIsNewKnowledge(false);
      }
  }

  const handleSaveDatasource = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentDatasource) return;

    const name = (e.currentTarget.elements.namedItem('ds-name') as HTMLInputElement).value.trim();
    const value = (e.currentTarget.elements.namedItem('ds-value') as HTMLInputElement).value.trim();

    if (name && value) {
        if(isNewDatasource) {
            onAddDatasource({ name, value, type: 'notion_database_id' });
        } else {
            onUpdateDatasource({ ...currentDatasource, name, value } as Datasource);
        }
    }
    setCurrentDatasource(null);
  }
  
  const handleSaveKnowledge = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentKnowledge) return;

    const name = (e.currentTarget.elements.namedItem('k-name') as HTMLInputElement).value.trim();
    const content = (e.currentTarget.elements.namedItem('k-content') as HTMLTextAreaElement).value.trim();

    if (name && content) {
        if (isNewKnowledge) {
            onAddKnowledge({ name, content });
        } else {
            onUpdateKnowledge({ ...currentKnowledge, name, content } as Knowledge);
        }
    }
    setCurrentKnowledge(null);
  }
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value);
  };

  const handleNameBlur = () => {
    if (projectName.trim() && projectName.trim() !== project.name) {
        onUpdateProjectProperty('name', projectName.trim());
    } else {
        setProjectName(project.name);
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    const newTag: Omit<Tag, 'id'> & { id?: string } = {
        id: `tag-${Date.now()}`,
        name: newTagName.trim(),
        ...newTagColor
    };
    onUpdateProjectProperty('tags', [...project.tags, newTag]);
    setNewTagName('');
  };

  const handleRemoveTag = (tagId: string) => {
    onUpdateProjectProperty('tags', project.tags.filter(t => t.id !== tagId));
  };


  const handleTriggerImport = () => {
      importInputRef.current?.click();
  };
  
  const renderGeneralSettings = () => (
    <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
        <div>
            <label htmlFor="project-name" className="block text-sm font-medium text-zinc-300 mb-1">ชื่อโครงการ</label>
            <input id="project-name" type="text" value={projectName} onChange={handleNameChange} onBlur={handleNameBlur} className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>

        <div className="flex items-center justify-between bg-zinc-800/50 p-4 rounded-lg">
            <div>
                <h4 className="font-semibold text-white">ปักหมุดในรายการโปรด</h4>
                <p className="text-sm text-zinc-400">แชตนี้จะแสดงอยู่ด้านบนสุดเสมอ</p>
            </div>
            <label htmlFor="fav-toggle" className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="fav-toggle" className="sr-only peer" checked={project.isFavorite} onChange={() => onUpdateProjectProperty('isFavorite', !project.isFavorite)} />
                <div className="w-11 h-6 bg-zinc-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
        </div>

        <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">แท็ก</label>
            <div className="flex flex-wrap gap-2 min-h-[34px] bg-zinc-800/20 p-2 rounded-md">
                {project.tags.map(tag => (
                    <span key={tag.id} className={`inline-flex items-center gap-x-1.5 px-2 py-1 text-xs font-medium rounded-full ${tag.bg} ${tag.text} ring-1 ring-inset ${tag.ring}`}>
                        {tag.name}
                        <button type="button" onClick={() => handleRemoveTag(tag.id)} className={`group -mr-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-red-500/50`}>
                            <i className="fa-solid fa-times text-xs text-red-300/70 group-hover:text-white"></i>
                        </button>
                    </span>
                ))}
            </div>
            <form onSubmit={handleAddTag} className="mt-4 bg-zinc-800/50 p-4 rounded-lg space-y-4">
                <h5 className="font-semibold text-white">เพิ่มแท็กใหม่</h5>
                <div className="flex items-center gap-2">
                    <input type="text" value={newTagName} onChange={e => setNewTagName(e.target.value)} placeholder="ชื่อแท็ก..." className="flex-grow bg-zinc-950 border border-zinc-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    <button type="submit" className="px-4 h-10 rounded-md font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50" disabled={!newTagName.trim()}>เพิ่ม</button>
                </div>
                <div className="grid grid-cols-8 md:grid-cols-16 gap-2">
                    {TAG_COLORS.map((color, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setNewTagColor(color)}
                            className={`w-full h-7 rounded-md transition-transform transform hover:scale-110 ${color.bg} ${newTagColor.bg === color.bg ? 'ring-2 ring-offset-2 ring-offset-zinc-800 ring-white' : ''}`}
                            aria-label={color.bg}
                        />
                    ))}
                </div>
            </form>
        </div>
    </div>
  );

  const renderToolList = () => (
    <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
        <button onClick={() => setEditingTool('new')} className="w-full px-4 py-2 rounded-md font-semibold transition-colors bg-blue-600 hover:bg-blue-500 text-white">
            <i className="fas fa-plus mr-2"></i>สร้างเครื่องมือใหม่
        </button>
        <div className="space-y-2">
          {project.tools.length > 0 ? project.tools.map(tool => (
            <div key={tool.id} className="bg-zinc-800/50 rounded-lg p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${tool.color}`}>
                  <i className={`${tool.icon} text-white text-lg`}></i>
                </div>
                <div className="min-w-0">
                  <p className="font-bold truncate">{tool.name}</p>
                  <p className="text-sm text-zinc-400 truncate">{tool.description}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => setEditingTool(tool)} className="w-8 h-8 rounded-md text-zinc-300 hover:bg-zinc-700 hover:text-white"><i className="fas fa-pencil-alt"></i></button>
                <button onClick={() => onDeleteTool(tool.id)} className="w-8 h-8 rounded-md text-zinc-300 hover:bg-red-500 hover:text-white"><i className="fas fa-trash"></i></button>
              </div>
            </div>
          )) : <p className="text-center text-zinc-500 py-4">ยังไม่มีเครื่องมือที่สร้างขึ้น</p>}
        </div>
    </div>
  );
  
  const renderDatasourceForm = () => {
    if (!currentDatasource) return null;
    const ds = currentDatasource;
    return (
       <form onSubmit={handleSaveDatasource} className="flex flex-col h-full">
           <div className="p-5 border-b border-zinc-800">
              <h2 className="text-xl font-semibold">{isNewDatasource ? 'เพิ่มแหล่งข้อมูล' : 'แก้ไขแหล่งข้อมูล'}</h2>
              <p className="text-sm text-zinc-400">ลงทะเบียน Notion Database ID</p>
          </div>
          <div className="p-6 space-y-4 flex-1">
              <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">ชื่อที่เรียกง่าย (Name)</label>
                  <input name="ds-name" defaultValue={ds.name || ''} required className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-2" placeholder="เช่น 'รายการงานหลัก'"/>
              </div>
              <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Database ID</label>
                  <input name="ds-value" defaultValue={ds.value || ''} required className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-2" placeholder="e.g., a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6"/>
              </div>
          </div>
          <div className="p-4 bg-zinc-950/50 border-t border-zinc-800 flex justify-end gap-3 rounded-b-lg">
              <button type="button" onClick={() => setCurrentDatasource(null)} className="px-4 py-2 rounded-md font-semibold bg-zinc-700 hover:bg-zinc-600">ยกเลิก</button>
              <button type="submit" className="px-4 py-2 rounded-md font-semibold bg-blue-600 hover:bg-blue-500">บันทึก</button>
          </div>
      </form>
    );
  };
  
  const renderDatasourceList = () => (
    <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
        <button onClick={() => handleEditDatasource('new')} className="w-full px-4 py-2 rounded-md font-semibold transition-colors bg-blue-600 hover:bg-blue-500 text-white">
            <i className="fas fa-plus mr-2"></i>เพิ่มแหล่งข้อมูลใหม่
        </button>
         <div className="space-y-2">
          {project.datasources.length > 0 ? project.datasources.map(ds => (
            <div key={ds.id} className="bg-zinc-800/50 rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="font-bold">{ds.name}</p>
                <p className="text-sm text-zinc-400 truncate max-w-xs">{ds.value}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEditDatasource(ds)} className="w-8 h-8 rounded-md text-zinc-300 hover:bg-zinc-700 hover:text-white"><i className="fas fa-pencil-alt"></i></button>
                <button onClick={() => onDeleteDatasource(ds.id)} className="w-8 h-8 rounded-md text-zinc-300 hover:bg-red-500 hover:text-white"><i className="fas fa-trash"></i></button>
              </div>
            </div>
          )) : <p className="text-center text-zinc-500 py-4">ยังไม่มีแหล่งข้อมูล</p>}
        </div>
    </div>
  );
  
  const renderKnowledgeForm = () => {
    if (!currentKnowledge) return null;
    const k = currentKnowledge;
    return (
       <form onSubmit={handleSaveKnowledge} className="flex flex-col h-full">
           <div className="p-5 border-b border-zinc-800">
              <h2 className="text-xl font-semibold">{isNewKnowledge ? 'เพิ่มองค์ความรู้' : 'แก้ไของค์ความรู้'}</h2>
              <p className="text-sm text-zinc-400">บันทึกคำสั่งหรือข้อมูลที่ต้องการให้ AI จำ</p>
          </div>
          <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              <div>
                  <label htmlFor="k-name" className="block text-sm font-medium text-zinc-300 mb-1">ชื่อความรู้ (Name)</label>
                  <input id="k-name" name="k-name" defaultValue={k.name || ''} required className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="เช่น 'ลายเซ็นอีเมล'"/>
              </div>
              <div>
                  <label htmlFor="k-content" className="block text-sm font-medium text-zinc-300 mb-1">เนื้อหา / คำสั่ง (Content)</label>
                  <textarea id="k-content" name="k-content" defaultValue={k.content || ''} required rows={6} className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-2 resize-y focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="เช่น 'จบอีเมลทุกครั้งด้วยคำว่า ขอแสดงความนับถือ, [ชื่อของคุณ]'"/>
              </div>
          </div>
          <div className="p-4 bg-zinc-950/50 border-t border-zinc-800 flex justify-end gap-3 rounded-b-lg">
              <button type="button" onClick={() => setCurrentKnowledge(null)} className="px-4 py-2 rounded-md font-semibold bg-zinc-700 hover:bg-zinc-600">ยกเลิก</button>
              <button type="submit" className="px-4 py-2 rounded-md font-semibold bg-blue-600 hover:bg-blue-500">บันทึก</button>
          </div>
      </form>
    );
  };

  const renderKnowledgeList = () => (
    <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
        <button onClick={() => handleEditKnowledge('new')} className="w-full px-4 py-2 rounded-md font-semibold transition-colors bg-blue-600 hover:bg-blue-500 text-white">
            <i className="fas fa-plus mr-2"></i>สร้างองค์ความรู้ใหม่
        </button>
         <div className="space-y-2">
          {(project.knowledge || []).length > 0 ? project.knowledge.map(k => (
            <div key={k.id} className="bg-zinc-800/50 rounded-lg p-3 flex items-start justify-between">
              <div className="min-w-0">
                <p className="font-bold text-white">{k.name}</p>
                <p className="text-sm text-zinc-400 line-clamp-2 max-w-md">{k.content}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0 ml-4">
                <button onClick={() => handleEditKnowledge(k)} className="w-8 h-8 rounded-md text-zinc-300 hover:bg-zinc-700 hover:text-white flex-shrink-0"><i className="fas fa-pencil-alt"></i></button>
                <button onClick={() => onDeleteKnowledge(k.id)} className="w-8 h-8 rounded-md text-zinc-300 hover:bg-red-500 hover:text-white flex-shrink-0"><i className="fas fa-trash"></i></button>
              </div>
            </div>
          )) : <p className="text-center text-zinc-500 py-4">ยังไม่มีองค์ความรู้ที่บันทึกไว้</p>}
        </div>
    </div>
  );

  const renderMainContent = () => (
    <>
        <div className="p-5 border-b border-zinc-800 flex justify-between items-center">
            <div>
                <h2 className="text-xl font-semibold">ตั้งค่าโครงการ</h2>
                <p className="text-sm text-zinc-400">จัดการรายละเอียด, เครื่องมือ, และองค์ความรู้</p>
            </div>
            <button onClick={handleClose} className="text-zinc-400 hover:text-white">
                <i className="fas fa-times"></i>
            </button>
        </div>
        <div className="border-b border-zinc-800 px-3">
            <nav className="flex gap-1 -mb-px">
                <button onClick={() => setActiveTab('general')} className={`px-4 py-3 font-semibold border-b-2 ${activeTab === 'general' ? 'text-blue-400 border-blue-400' : 'text-zinc-400 border-transparent hover:text-white'}`}>ทั่วไป</button>
                <button onClick={() => setActiveTab('tools')} className={`px-4 py-3 font-semibold border-b-2 ${activeTab === 'tools' ? 'text-blue-400 border-blue-400' : 'text-zinc-400 border-transparent hover:text-white'}`}>เครื่องมือ</button>
                <button onClick={() => setActiveTab('datasources')} className={`px-4 py-3 font-semibold border-b-2 ${activeTab === 'datasources' ? 'text-blue-400 border-blue-400' : 'text-zinc-400 border-transparent hover:text-white'}`}>แหล่งข้อมูล</button>
                <button onClick={() => setActiveTab('knowledge')} className={`px-4 py-3 font-semibold border-b-2 ${activeTab === 'knowledge' ? 'text-blue-400 border-blue-400' : 'text-zinc-400 border-transparent hover:text-white'}`}>องค์ความรู้</button>
            </nav>
        </div>
        
        {activeTab === 'general' && renderGeneralSettings()}
        {activeTab === 'tools' && renderToolList()}
        {activeTab === 'datasources' && renderDatasourceList()}
        {activeTab === 'knowledge' && renderKnowledgeList()}
        
        {activeTab === 'tools' && (
            <div className="p-4 bg-zinc-950/50 border-t border-zinc-800 flex gap-3 rounded-b-lg">
                <input type="file" accept=".json" onChange={onImportTools} ref={importInputRef} className="hidden" />
                <button onClick={handleTriggerImport} className="flex-1 px-4 py-2 rounded-md font-semibold transition-colors bg-zinc-700 hover:bg-zinc-600">
                    <i className="fas fa-upload mr-2"></i>นำเข้าเครื่องมือ
                </button>
                <button onClick={onExportTools} className="flex-1 px-4 py-2 rounded-md font-semibold transition-colors bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50" disabled={project.tools.length === 0}>
                    <i className="fas fa-download mr-2"></i>ส่งออกเครื่องมือ
                </button>
            </div>
        )}
    </>
  );

  const renderContent = () => {
    if (editingTool) {
      return <ToolEditor 
        tool={editingTool === 'new' ? null : editingTool}
        datasources={project.datasources}
        onSave={handleSaveTool}
        onCancel={() => setEditingTool(null)}
      />
    }
    if (currentDatasource) {
      return renderDatasourceForm();
    }
    if (currentKnowledge) {
      return renderKnowledgeForm();
    }
    return renderMainContent();
  }

  const modalMarkup = (
    <div 
      className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
    >
      <div 
        className="bg-zinc-900 rounded-lg shadow-2xl w-full max-w-2xl m-4 border border-zinc-800 flex flex-col max-h-[90vh] animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        {renderContent()}
      </div>
    </div>
  );

  return createPortal(modalMarkup, modalRoot);
};

export default SettingsModal;