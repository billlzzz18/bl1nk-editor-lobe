import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Project, Message } from '../types';
import { Role } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';


interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, project }) => {
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);
  const [isLinkEnabled, setIsLinkEnabled] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copyButtonText, setCopyButtonText] = useState('คัดลอกลิงก์');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState<null | 'pdf'>(null);


  useEffect(() => {
    setModalRoot(document.getElementById('modal-root'));
  }, []);

  useEffect(() => {
    if (isOpen) {
        // Reset state when modal opens
        setIsLinkEnabled(false);
        setShareUrl('');
        setQrCodeUrl('');
        setCopyButtonText('คัดลอกลิงก์');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isLinkEnabled) {
      try {
        // Helper function to correctly encode unicode strings to base64
        const b64EncodeUnicode = (str: string) => {
          return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
              (match, p1) => String.fromCharCode(parseInt(p1, 16))
          ));
        };

        const jsonString = JSON.stringify(project);
        const base64Data = b64EncodeUnicode(jsonString);
        const url = `${window.location.origin}${window.location.pathname}#data=${encodeURIComponent(base64Data)}`;
        setShareUrl(url);
        QRCode.toDataURL(url, { width: 256, margin: 1, errorCorrectionLevel: 'H' })
            .then(setQrCodeUrl)
            .catch(err => console.error("QR Code generation failed:", err));

      } catch (error) {
        console.error("Failed to create share link:", error);
        setShareUrl("เกิดข้อผิดพลาดในการสร้างลิงก์");
      }
    } else {
      setShareUrl('');
      setQrCodeUrl('');
    }
  }, [isLinkEnabled, project]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopyButtonText('คัดลอกแล้ว!');
      setTimeout(() => setCopyButtonText('คัดลอกลิงก์'), 2000);
    }, (err) => {
      console.error('Could not copy text: ', err);
      setCopyButtonText('เกิดข้อผิดพลาด');
    });
  };

  const downloadFile = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    const markdownContent = project.messages
      .map(msg => {
        const cleanText = (text: string) => text.replace(/<[^>]*>/g, '');
        switch (msg.role) {
          case Role.USER:
            return `**You:**\n${msg.text}\n`;
          case Role.AI:
            return `**AI:**\n${cleanText(msg.text)}\n`;
          case Role.SYSTEM:
            return `*System: ${cleanText(msg.text)}*\n`;
          default:
            return '';
        }
      })
      .join('\n---\n\n');
      
    downloadFile(markdownContent, `${project.name.replace(/\s/g, '_')}.md`, 'text/markdown;charset=utf-8');
  };

  const handleExportHTML = () => {
    const chatHtml = project.messages.map(msg => {
       const bubbleClass = msg.role === Role.USER ? 'user-bubble' : msg.role === Role.AI ? 'ai-bubble' : 'system-bubble';
       if (msg.role === Role.SYSTEM) {
           return `<div class="message system"><div class="system-bubble">${msg.text}</div></div>`;
       }
       return `
        <div class="message ${msg.role === Role.USER ? 'user' : 'ai'}">
           ${msg.role === Role.AI ? `<div class="avatar">🤖</div>` : ''}
           <div class="bubble ${bubbleClass}">${msg.text.replace(/\n/g, '<br />')}</div>
        </div>
       `;
    }).join('');

    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="th">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Chat Export: ${project.name}</title>
          <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; background-color: #18181b; color: #f4f4f5; margin: 0; padding: 20px; }
              .chat-container { max-width: 800px; margin: auto; }
              h1 { color: white; border-bottom: 1px solid #3f3f46; padding-bottom: 10px; }
              .message { display: flex; margin-bottom: 12px; align-items: flex-start; gap: 10px; }
              .message.user { flex-direction: row-reverse; }
              .avatar { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; background: linear-gradient(to top right, #a855f7, #3b82f6); flex-shrink: 0; }
              .bubble { padding: 12px 16px; border-radius: 18px; max-width: 75%; line-break: anywhere; }
              .ai-bubble { background-color: #27272a; border-bottom-left-radius: 4px; }
              .user-bubble { background-color: #2563eb; color: white; border-bottom-right-radius: 4px; }
              .system { display: flex; justify-content: center; margin: 12px 0; }
              .system-bubble { background-color: #3f3f46; color: #a1a1aa; font-size: 0.875rem; padding: 6px 12px; border-radius: 9999px; text-align: center; }
              code { background-color: #3f3f46; padding: 2px 4px; border-radius: 4px; font-family: monospace; }
          </style>
      </head>
      <body>
          <div class="chat-container">
              <h1>${project.name}</h1>
              ${chatHtml}
          </div>
      </body>
      </html>
    `;
    downloadFile(htmlTemplate, `${project.name.replace(/\s/g, '_')}.html`, 'text/html;charset=utf-8');
  };

  const handleExportPDF = async () => {
    setIsGenerating('pdf');
    const reportElement = document.createElement('div');
    reportElement.style.position = 'absolute';
    reportElement.style.left = '-9999px';
    reportElement.style.top = '0';
    reportElement.style.width = '800px';
    reportElement.style.padding = '20px';
    reportElement.style.backgroundColor = '#18181b';
    reportElement.style.color = '#f4f4f5';
    reportElement.style.fontFamily = 'sans-serif';
    reportElement.innerHTML = document.head.innerHTML + (await (async () => {
        // This is a simplified version of the HTML export logic, inlined for PDF generation.
        const chatHtml = project.messages.map(msg => {
          const messageStyle = `display: flex; margin-bottom: 12px; align-items: flex-start; gap: 10px; ${msg.role === Role.USER ? 'flex-direction: row-reverse;' : 'flex-direction: row;'}`;
          const bubbleStyle = `padding: 12px 16px; border-radius: 18px; max-width: 75%; line-break: anywhere;`;
          const aiBubbleStyle = `background-color: #27272a; border-bottom-left-radius: 4px;`;
          const userBubbleStyle = `background-color: #2563eb; color: white; border-bottom-right-radius: 4px;`;
          const systemContainerStyle = `display: flex; justify-content: center; margin: 12px 0;`;
          const systemBubbleStyle = `background-color: #3f3f46; color: #a1a1aa; font-size: 0.875rem; padding: 6px 12px; border-radius: 9999px;`;
          const avatarStyle = `width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; background: linear-gradient(to top right, #a855f7, #3b82f6); flex-shrink: 0; color: white;`;
          
          if (msg.role === Role.SYSTEM) return `<div style="${systemContainerStyle}"><div style="${systemBubbleStyle}">${msg.text}</div></div>`;
          return `<div style="${messageStyle}">${msg.role === Role.AI ? `<div style="${avatarStyle}">🤖</div>` : ''}<div style="${bubbleStyle} ${msg.role === Role.USER ? userBubbleStyle : aiBubbleStyle}">${msg.text.replace(/\n/g, '<br />')}</div></div>`;
        }).join('');
        return `<body><div style="width: 100%;"><h1 style="font-size: 24px; margin-bottom: 20px; color: white; border-bottom: 1px solid #3f3f46; padding-bottom: 10px;">${project.name}</h1>${chatHtml}</div></body>`;
    })());
    document.body.appendChild(reportElement);
    try {
        const canvas = await html2canvas(reportElement, { scale: 2, useCORS: true, backgroundColor: '#18181b' });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
        while (heightLeft > 0) {
            position = position - pdf.internal.pageSize.getHeight();
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();
        }
        pdf.save(`${project.name.replace(/\s/g, '_')}.pdf`);
    } catch (err) {
        console.error("PDF export failed:", err);
        alert("เกิดข้อผิดพลาดในการสร้าง PDF");
    } finally {
        document.body.removeChild(reportElement);
        setIsGenerating(null);
    }
  };

  if (!isOpen || !modalRoot) return null;

  const modalMarkup = (
    <div 
      className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-zinc-900 rounded-lg shadow-2xl w-full max-w-lg m-4 border border-zinc-800 flex flex-col max-h-[90vh] animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-zinc-800 flex justify-between items-center flex-shrink-0">
            <div>
                <h2 className="text-xl font-semibold">แชร์ & ส่งออกโปรเจกต์</h2>
                <p className="text-sm text-zinc-400">"{project.name}"</p>
            </div>
            <button onClick={onClose} className="text-zinc-400 hover:text-white">
                <i className="fas fa-times"></i>
            </button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto">
            {/* Share Link Section */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg text-white border-b border-zinc-700 pb-2">แชร์ผ่านลิงก์</h3>
                 <div className="flex items-center justify-between bg-zinc-800/50 p-4 rounded-lg">
                    <div>
                        <h4 className="font-semibold text-white">เปิดใช้งานลิงก์สาธารณะ</h4>
                        <p className="text-sm text-zinc-400">ทุกคนที่มีลิงก์จะสามารถดูแชตนี้ได้</p>
                    </div>
                    <label htmlFor="toggle" className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="toggle" className="sr-only peer" checked={isLinkEnabled} onChange={() => setIsLinkEnabled(!isLinkEnabled)} />
                        <div className="w-11 h-6 bg-zinc-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
                 {isLinkEnabled && (
                    <div className="flex gap-4 items-center p-4 bg-zinc-800/50 rounded-lg animate-fade-in">
                        {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code for share link" className="w-24 h-24 bg-white p-1 rounded-md flex-shrink-0" />}
                        <div className="flex-grow space-y-2">
                             <label htmlFor="share-url" className="text-sm font-medium text-zinc-300">ลิงก์สำหรับแชร์ (ดูอย่างเดียว)</label>
                            <div className="flex gap-2">
                                <input id="share-url" type="text" readOnly value={shareUrl} className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-2 text-zinc-300 truncate" />
                                <button onClick={handleCopyToClipboard} className="px-4 py-2 rounded-md font-semibold bg-blue-600 hover:bg-blue-500 transition-colors w-32 text-nowrap">{copyButtonText}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
             {/* Export Section */}
            <div className="space-y-4">
                 <h3 className="font-semibold text-lg text-white border-b border-zinc-700 pb-2">ส่งออกเป็นไฟล์</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button onClick={handleExportMarkdown} className="flex flex-col items-center justify-center gap-2 p-4 bg-zinc-800/50 hover:bg-zinc-700 rounded-lg transition-colors">
                        <i className="fa-brands fa-markdown text-3xl text-zinc-300"></i>
                        <span className="font-semibold">Markdown</span>
                    </button>
                    <button onClick={handleExportHTML} className="flex flex-col items-center justify-center gap-2 p-4 bg-zinc-800/50 hover:bg-zinc-700 rounded-lg transition-colors">
                        <i className="fa-solid fa-file-code text-3xl text-zinc-300"></i>
                        <span className="font-semibold">HTML</span>
                    </button>
                     <button onClick={handleExportPDF} disabled={isGenerating === 'pdf'} className="flex flex-col items-center justify-center gap-2 p-4 bg-zinc-800/50 hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-wait">
                        {isGenerating === 'pdf' ? <i className="fa-solid fa-spinner fa-spin text-3xl text-zinc-300"></i> : <i className="fa-solid fa-file-pdf text-3xl text-zinc-300"></i>}
                        <span className="font-semibold">{isGenerating === 'pdf' ? 'กำลังสร้าง...' : 'PDF'}</span>
                    </button>
                </div>
            </div>
        </div>

        <div className="p-4 bg-zinc-950/50 border-t border-zinc-800 flex justify-end gap-3 rounded-b-lg flex-shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md font-semibold transition-colors bg-zinc-700 hover:bg-zinc-600">
                เสร็จสิ้น
            </button>
        </div>

      </div>
    </div>
  );

  return createPortal(modalMarkup, modalRoot);
};

export default ShareModal;