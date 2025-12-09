import React, { useRef, useEffect } from 'react';

interface MessageInputProps {
  input: string;
  setInput: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  isLoading: boolean;
  file: File | null;
  setFile: (file: File | null) => void;
}

const FilePreview: React.FC<{ file: File; onRemove: () => void }> = ({ file, onRemove }) => (
    <div className="absolute bottom-full left-0 w-full bg-zinc-800 p-2 rounded-t-lg flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2 text-sm text-zinc-300 overflow-hidden">
            <i className="fa-solid fa-file text-zinc-400"></i>
            <span className="truncate">{file.name}</span>
        </div>
        <button onClick={onRemove} className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors">
            <i className="fa-solid fa-times"></i>
        </button>
    </div>
);

const MessageInput: React.FC<MessageInputProps> = ({ input, setInput, onSendMessage, isLoading, file, setFile }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setFile(e.target.files[0]);
      }
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
      // Prevent submission if loading or if there's no text AND no file
      if (isLoading || (!input.trim() && !file)) return;
      onSendMessage(e);
  }

  return (
    <form onSubmit={handleFormSubmit} className="p-4 bg-zinc-900 border-t border-zinc-800">
      <div className="relative">
        {file && <FilePreview file={file} onRemove={() => setFile(null)} />}
        <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
        />
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleFormSubmit(e);
            }
          }}
          placeholder="แนบไฟล์ หรือคุยกับ AI..."
          rows={1}
          className="w-full bg-zinc-950 border border-zinc-700 rounded-lg py-3 pl-14 pr-14 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 text-white placeholder-zinc-500"
          disabled={isLoading}
        />
         <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full text-zinc-400 flex items-center justify-center transition-all duration-200 hover:bg-zinc-800 hover:text-white disabled:opacity-50"
            aria-label="Attach file"
        >
            <i className="fa-solid fa-paperclip text-lg"></i>
        </button>
        <button
          type="submit"
          disabled={isLoading || (!input.trim() && !file)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center transition-all duration-200 hover:bg-blue-500 disabled:bg-zinc-700 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          {isLoading ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <i className="fa-solid fa-paper-plane"></i>
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;