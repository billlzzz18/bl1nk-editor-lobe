import React from 'react';
import type { Message } from '../types';
import { Role } from '../types';

interface ChatBubbleProps {
  message: Message;
}

const FilePreview: React.FC<{ file: Message['file'] }> = ({ file }) => {
    if (!file) return null;

    const isImage = file.type.startsWith('image/');

    return (
        <div className="mt-2 p-2 bg-zinc-700/50 rounded-lg flex items-center gap-3">
            {isImage ? (
                <img src={file.dataUrl} alt={file.name} className="w-20 h-20 object-cover rounded-md" />
            ) : (
                <div className="w-12 h-12 bg-zinc-600 rounded-md flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-file-alt text-2xl text-zinc-300"></i>
                </div>
            )}
            <div className="text-sm text-zinc-300 truncate">
                <p className="font-medium">{file.name}</p>
                <p className="text-xs text-zinc-500">{file.type}</p>
            </div>
        </div>
    );
};


const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.USER;
  const isAI = message.role === Role.AI;
  const isSystem = message.role === Role.SYSTEM;

  const bubbleClasses = isUser
    ? 'bg-blue-600 self-end rounded-br-none'
    : isAI
    ? 'bg-zinc-800 self-start rounded-bl-none'
    : 'bg-transparent text-zinc-500 text-center text-xs self-center';

  const icon = isAI ? (
    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex-shrink-0 flex items-center justify-center mr-3">
      <i className="fa-solid fa-robot text-lg"></i>
    </div>
  ) : null;
  
  const textContent = (
    <div
      className={`px-4 py-3 rounded-2xl max-w-lg lg:max-w-xl xl:max-w-2xl prose prose-invert prose-p:my-2 prose-headings:my-3 ${bubbleClasses}`}
    >
      {message.file && <FilePreview file={message.file} />}
      {/* Only render text if it exists to avoid empty bubbles */}
      {message.text && <div dangerouslySetInnerHTML={{ __html: message.text.replace(/\n/g, '<br />') }} />}
    </div>
  );

  if (isSystem) {
    return (
       <div className="my-2 w-full flex justify-center">
         <div 
          className="px-4 py-2 rounded-full max-w-fit text-sm bg-zinc-800/50 flex items-center gap-2"
          dangerouslySetInnerHTML={{ __html: message.text }}
         />
       </div>
    )
  }

  return (
    <div className={`my-3 flex w-full items-start ${isUser ? 'justify-end' : 'justify-start'}`}>
      {isAI && icon}
      {textContent}
    </div>
  );
};

export default ChatBubble;