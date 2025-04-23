
import React, { useRef, useState } from "react";
import { useAppStore } from "@/hooks/useAppStore";
import { fetchJson } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

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
    upload(file);
  }

  async function upload(file: File) {
    setStatus("uploading");
    setProgress(0);

    const form = new FormData();
    form.append("file", file);

    try {
      // Simulate upload progress as fetch API doesn't natively expose progress
      setProgress(10);
      const res = await fetch("/api/upload_rft", {
        method: "POST",
        body: form,
      });
      setProgress(70);
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

  function handleZoneClick() {
    inputRef.current?.click();
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={`border-2 border-dashed rounded-lg p-6 mb-3 text-center cursor-pointer
          ${status === "uploading" ? "opacity-60" : "hover:bg-muted"}`}
        onClick={handleZoneClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        tabIndex={0}
        role="button"
        aria-disabled={status === "uploading"}
        style={{ outline: "none" }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          disabled={status === "uploading"}
          onChange={handleInputChange}
        />
        <span className="block mb-2 font-semibold">Drag &amp; drop PDF or DOCX here, or click to select</span>
        <span className="text-xs text-muted-foreground">Max file size: 20MB</span>
      </div>
      {error && (
        <div className="mb-3 text-sm text-red-600 bg-red-100 rounded p-2">{error}</div>
      )}
      {status === "uploading" && (
        <div className="mb-3 flex items-center gap-2">
          <Progress value={progress} className="flex-1" />
          <span className="text-xs">{progress}%</span>
        </div>
      )}
    </div>
  );
};
