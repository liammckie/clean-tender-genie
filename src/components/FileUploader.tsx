
import React, { useRef, useState } from "react";
import { useAppStore } from "@/hooks/useAppStore";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Upload, Check } from "lucide-react";

export interface FileUploaderProps {
  onUploaded?: (storeId: string) => void;
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];
const MAX_SIZE = 20 * 1024 * 1024; // 20MB

export const FileUploader: React.FC<FileUploaderProps> = ({ onUploaded }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const { status, setStatus, setStoreId, setError, error } = useAppStore();
  const [filename, setFilename] = useState<string | null>(null);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (file) validateAndUpload(file);
  }

  function handleDrop(ev: React.DragEvent<HTMLDivElement>) {
    ev.preventDefault();
    const file = ev.dataTransfer.files && ev.dataTransfer.files[0];
    if (file) validateAndUpload(file);
  }

  function handleDragOver(ev: React.DragEvent<HTMLDivElement>) {
    ev.preventDefault();
  }

  function validateAndUpload(file: File) {
    setError(null);
    setStoreId(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Only PDF or DOCX files are allowed.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("File size exceeds 20MB limit.");
      return;
    }
    setFilename(file.name);
    upload(file);
  }

  async function upload(file: File) {
    setStatus("uploading");
    setProgress(0);

    const form = new FormData();
    form.append("file", file);

    try {
      // Simulate upload progress as fetch API doesn't natively expose progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const res = await fetch("/api/upload_rft", {
        method: "POST",
        body: form,
      });
      
      clearInterval(progressInterval);
      
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson?.message || "Failed to upload file.");
      }
      
      const data = await res.json();
      if (!data.storeId) throw new Error("No storeId returned from server.");

      setProgress(100);
      setStatus("uploaded");
      setStoreId(data.storeId);
      if (onUploaded) onUploaded(data.storeId);
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "Upload failed");
      setProgress(0);
    }
  }

  function resetUpload() {
    setStatus("idle");
    setStoreId(null);
    setError(null);
    setProgress(0);
    setFilename(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {status === "uploaded" ? (
        <div className="border rounded-lg p-6 bg-green-50 dark:bg-green-900/20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Check className="text-green-500 h-5 w-5" />
            <div>
              <p className="font-medium">{filename}</p>
              <p className="text-xs text-muted-foreground">Successfully uploaded</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={resetUpload}>
            Upload Another
          </Button>
        </div>
      ) : (
        <>
          <div
            className={`border-2 border-dashed rounded-lg p-6 mb-3 text-center cursor-pointer transition-colors
              ${status === "uploading" ? "opacity-60 pointer-events-none" : "hover:bg-muted"}`}
            onClick={() => inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            tabIndex={0}
            role="button"
            aria-disabled={status === "uploading"}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              disabled={status === "uploading"}
              onChange={handleInputChange}
            />
            <Upload className="mx-auto h-8 w-8 mb-3 text-muted-foreground" />
            <span className="block mb-2 font-semibold">Drag &amp; drop PDF or DOCX here, or click to select</span>
            <span className="text-xs text-muted-foreground">Max file size: 20MB</span>
          </div>
          
          {error && (
            <div className="mb-3 text-sm text-destructive bg-destructive/10 rounded p-2 flex items-center gap-2">
              <X className="h-4 w-4" /> {error}
            </div>
          )}
          
          {status === "uploading" && (
            <div className="mb-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{filename}</span>
                <span className="text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </>
      )}
    </div>
  );
};
