
import React, { useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface DocumentContentProps {
  content: string;
  setContent: (content: string) => void;
  className?: string;
}

const DocumentContent: React.FC<DocumentContentProps> = ({
  content,
  setContent,
  className,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea to fit content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [content]);

  // Handle tab key to insert tab character instead of changing focus
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      
      // Insert tab at cursor position
      const newText = content.substring(0, start) + '\t' + content.substring(end);
      setContent(newText);
      
      // Reset cursor position after tab insertion
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 1;
          textareaRef.current.selectionEnd = start + 1;
        }
      }, 0);
    }
  };

  return (
    <div className={cn("bg-spotify-darkgray rounded-md shadow-sm p-6 min-h-full", className)}>
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full border-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[500px] text-base leading-relaxed bg-transparent text-white placeholder:text-spotify-lightgray"
        placeholder="Start writing your document..."
      />
    </div>
  );
};

export default DocumentContent;
