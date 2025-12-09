import React, { useState, useEffect } from 'react';
import type { CustomTool, ToolParameter, Datasource } from '../types';

interface ToolEditorProps {
    tool: Omit<CustomTool, 'id'> | CustomTool | null;
    datasources: Datasource[];
    onSave: (tool: Omit<CustomTool, 'id'> | CustomTool) => void;
    onCancel: () => void;
}

const emptyTool: Omit<CustomTool, 'id'> = {
    name: '',
    description: '',
    parameters: [],
    datasourceId: undefined,
    icon: 'fa-solid fa-cube',
    color: 'bg-zinc-500',
};

const colors = [
    'bg-slate-500', 'bg-red-500', 'bg-orange-500', 'bg-amber-500', 
    'bg-yellow-500', 'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 
    'bg-teal-500', 'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 
    'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 
    'bg-pink-500', 'bg-rose-500'
];

const ToolEditor: React.FC<ToolEditorProps> = ({ tool, datasources, onSave, onCancel }) => {
    const [currentTool, setCurrentTool] = useState(tool || emptyTool);
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const hasName = currentTool.name.trim() !== '' && !/\s/.test(currentTool.name);
        const hasDescription = currentTool.description.trim() !== '';
        const hasIcon = currentTool.icon.trim() !== '';
        const hasColor = currentTool.color.trim() !== '';
        const allParamsValid = currentTool.parameters.every(p => p.name.trim() !== '' && !/\s/.test(p.name) && p.description.trim() !== '');
        setIsFormValid(hasName && hasDescription && hasIcon && hasColor && allParamsValid);
    }, [currentTool]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentTool(prev => ({ ...prev, [name]: value === '' ? undefined : value }));
    };

    const handleColorChange = (color: string) => {
        setCurrentTool(prev => ({...prev, color}));
    }

    const suggestIcon = () => {
        // Only suggest if the user hasn't set a specific icon yet (or it's the default)
        if (currentTool.icon === 'fa-solid fa-cube' || currentTool.icon.trim() === '') {
            const name = currentTool.name.toLowerCase();
            let suggested = 'fa-solid fa-cube';
            if (name.includes('task') || name.includes('add') || name.includes('create')) suggested = 'fa-solid fa-plus';
            else if (name.includes('get') || name.includes('list') || name.includes('read')) suggested = 'fa-solid fa-list-ul';
            else if (name.includes('update') || name.includes('edit')) suggested = 'fa-solid fa-pencil';
            else if (name.includes('delete') || name.includes('remove')) suggested = 'fa-solid fa-trash';
            else if (name.includes('notion')) suggested = 'fa-solid fa-database';
            else if (name.includes('drive')) suggested = 'fa-brands fa-google-drive';
            else if (name.includes('send') || name.includes('email')) suggested = 'fa-solid fa-paper-plane';
            setCurrentTool(prev => ({...prev, icon: suggested}));
        }
    };

    const handleParamChange = (index: number, field: keyof ToolParameter, value: string) => {
        const newParams = [...currentTool.parameters];
        const paramToUpdate = { ...newParams[index], [field]: value };
        newParams[index] = paramToUpdate;
        setCurrentTool(prev => ({ ...prev, parameters: newParams }));
    };

    const addParameter = () => {
        const newParam: ToolParameter = { id: `param-${Date.now()}`, name: '', type: 'string', description: '' };
        setCurrentTool(prev => ({ ...prev, parameters: [...prev.parameters, newParam] }));
    };

    const removeParameter = (index: number) => {
        setCurrentTool(prev => ({ ...prev, parameters: prev.parameters.filter((_, i) => i !== index) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(isFormValid) {
            onSave(currentTool);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="p-5 border-b border-zinc-800">
                <h2 className="text-xl font-semibold">{tool && 'id' in tool ? 'แก้ไขเครื่องมือ' : 'สร้างเครื่องมือใหม่'}</h2>
                <p className="text-sm text-zinc-400">สอนให้ AI ทำงานตามที่คุณต้องการ</p>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1">ชื่อเครื่องมือ (Tool Name)</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={currentTool.name}
                        onChange={handleInputChange}
                        onBlur={suggestIcon}
                        placeholder="เช่น add_task_to_notion"
                        required
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                     <p className="text-xs text-zinc-500 mt-1">ชื่อที่ AI จะใช้เรียก (ต้องเป็นภาษาอังกฤษ, ไม่มีเว้นวรรค)</p>
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-1">คำอธิบาย (Description)</label>
                    <textarea
                        id="description"
                        name="description"
                        value={currentTool.description}
                        onChange={handleInputChange}
                        placeholder="เช่น ใช้สำหรับเพิ่มงานใหม่ลงในฐานข้อมูล Tasks"
                        rows={2}
                        required
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                    />
                     <p className="text-xs text-zinc-500 mt-1">อธิบายให้ AI เข้าใจว่าเครื่องมือนี้ทำอะไร</p>
                </div>

                <div className="space-y-3">
                    <label className="block text-sm font-medium text-zinc-300">ไอคอน & สี</label>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${currentTool.color}`}>
                            <i className={`${currentTool.icon} text-white text-xl`}></i>
                        </div>
                        <div className="flex-grow">
                            <input
                                type="text"
                                name="icon"
                                value={currentTool.icon}
                                onChange={handleInputChange}
                                placeholder="e.g., fa-solid fa-tasks"
                                required
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <p className="text-xs text-zinc-500 mt-1">คลาสจาก <a href="https://fontawesome.com/search?o=r&m=free" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-400">Font Awesome (Free v6)</a></p>
                        </div>
                    </div>
                     <div className="grid grid-cols-9 gap-2">
                        {colors.map(colorClass => (
                            <button
                                type="button"
                                key={colorClass}
                                onClick={() => handleColorChange(colorClass)}
                                className={`w-full h-8 rounded-md transition-transform transform hover:scale-110 ${colorClass} ${currentTool.color === colorClass ? 'ring-2 ring-offset-2 ring-offset-zinc-900 ring-white' : ''}`}
                                aria-label={colorClass}
                            />
                        ))}
                    </div>
                </div>


                 <div>
                    <label htmlFor="datasourceId" className="block text-sm font-medium text-zinc-300 mb-1">เชื่อมต่อกับแหล่งข้อมูล (ไม่บังคับ)</label>
                    <select
                        id="datasourceId"
                        name="datasourceId"
                        value={currentTool.datasourceId || ''}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="">-- ไม่ต้องเชื่อมต่อ --</option>
                        {datasources.map(ds => (
                            <option key={ds.id} value={ds.id}>{ds.name}</option>
                        ))}
                    </select>
                     <p className="text-xs text-zinc-500 mt-1">เลือกฐานข้อมูลที่จะให้เครื่องมือนี้ทำงานด้วย</p>
                </div>

                <div className="border-t border-zinc-800 pt-4">
                    <h3 className="font-semibold mb-2">พารามิเตอร์ (Parameters)</h3>
                    <div className="space-y-3">
                        {currentTool.parameters.map((param, index) => (
                            <div key={param.id} className="bg-zinc-800/50 p-3 rounded-lg space-y-2 relative">
                                <button type="button" onClick={() => removeParameter(index)} className="absolute top-2 right-2 w-6 h-6 rounded-full text-zinc-400 hover:bg-red-500 hover:text-white"><i className="fas fa-times text-sm"></i></button>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-zinc-400">ชื่อพารามิเตอร์</label>
                                        <input type="text" value={param.name} onChange={(e) => handleParamChange(index, 'name', e.target.value)} placeholder="task_name" required className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-1.5 text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-zinc-400">ประเภท</label>
                                        <select value={param.type} onChange={(e) => handleParamChange(index, 'type', e.target.value as ToolParameter['type'])} className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-1.5 text-sm">
                                            <option value="string">Text</option>
                                            <option value="number">Number</option>
                                            <option value="boolean">Boolean</option>
                                            <option value="item_id">Item Reference</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-400">คำอธิบาย</label>
                                    <input type="text" value={param.description} onChange={(e) => handleParamChange(index, 'description', e.target.value)} placeholder="ชื่องานที่ต้องทำ" required className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-1.5 text-sm" />
                                </div>
                            </div>
                        ))}
                    </div>
                     <button type="button" onClick={addParameter} className="mt-3 w-full text-sm text-blue-400 hover:text-blue-300 p-2 rounded-md border-2 border-dashed border-zinc-700 hover:border-blue-500 transition-colors">
                        <i className="fas fa-plus mr-2"></i>เพิ่มพารามิเตอร์
                    </button>
                </div>
            </div>

            <div className="p-4 bg-zinc-950/50 border-t border-zinc-800 flex justify-end gap-3 rounded-b-lg">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md font-semibold transition-colors bg-zinc-700 hover:bg-zinc-600">
                    ยกเลิก
                </button>
                <button type="submit" className="px-4 py-2 rounded-md font-semibold transition-colors bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!isFormValid}>
                    บันทึกเครื่องมือ
                </button>
            </div>
        </form>
    );
};

export default ToolEditor;