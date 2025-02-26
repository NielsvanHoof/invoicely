import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FileIcon, UploadIcon, XIcon } from 'lucide-react';
import { Input } from './input';

interface FileUploadProps {
  onChange: (file: File | null) => void;
  initialPreview?: string | null;
  onRemove?: () => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export function FileUpload({
  onChange,
  initialPreview,
  onRemove,
  accept = 'application/pdf,image/*,.doc,.docx',
  maxSize = 10, // 10MB default
  className,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(initialPreview || null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File size exceeds ${maxSize}MB limit`);
        return;
      }
      
      setError(null);
      setFileName(file.name);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    } else {
      setFileName(null);
      setPreview(null);
    }
    
    onChange(file);
  };

  const handleRemove = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setFileName(null);
    setPreview(null);
    setError(null);
    onChange(null);
    onRemove?.();
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div
        className={cn(
          'border-sidebar-border/70 dark:border-sidebar-border flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
          error ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/50' : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/50'
        )}
      >
        {preview ? (
          <div className="relative mb-4 h-32 w-32 overflow-hidden rounded">
            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute right-1 top-1 rounded-full bg-neutral-900/70 p-1 text-white hover:bg-neutral-900"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        ) : fileName ? (
          <div className="mb-4 flex items-center rounded-lg bg-neutral-100 p-3 dark:bg-neutral-800">
            <FileIcon className="mr-2 h-6 w-6 text-neutral-500" />
            <span className="max-w-[200px] truncate text-sm">{fileName}</span>
            <button
              type="button"
              onClick={handleRemove}
              className="ml-2 rounded-full p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <UploadIcon className="mb-2 h-10 w-10 text-neutral-400" />
            <p className="mb-1 text-sm font-medium">Drag and drop or click to upload</p>
            <p className="text-xs text-neutral-500">PDF, Word, or images up to {maxSize}MB</p>
          </>
        )}

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <Input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        {!fileName && !preview && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClick}
            className="mt-4"
          >
            Select File
          </Button>
        )}
      </div>
    </div>
  );
} 