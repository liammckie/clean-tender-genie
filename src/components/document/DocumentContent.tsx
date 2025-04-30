
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

  return (
    <div className={cn("bg-white rounded-md shadow-sm p-6 min-h-full", className)}>
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[500px] text-base leading-relaxed"
        placeholder="Start writing your document..."
      />
    </div>
  );
};

export default DocumentContent;
