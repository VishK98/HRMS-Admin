import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, FileText, GraduationCap } from "lucide-react";

interface FileUploadProps {
  label: string;
  icon?: "file" | "education";
  onFileChange: (file: File | null) => void;
  acceptedFileTypes?: string;
  maxSize?: number; // in MB
  className?: string;
}

export const FileUpload = ({
  label,
  icon = "file",
  onFileChange,
  acceptedFileTypes = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  maxSize = 5, // 5MB default
  className = "",
}: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }
    setSelectedFile(file);
    onFileChange(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const IconComponent = icon === "education" ? GraduationCap : FileText;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-gray-800 font-medium text-sm">{label}</Label>
      
             <div
         className={`border-2 border-dashed rounded-lg p-2 transition-colors h-16 flex items-center justify-center ${
           dragActive
             ? "border-[#843C6D] bg-[#843C6D]/5"
             : "border-gray-300 hover:border-gray-400"
         }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {selectedFile ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <IconComponent className="h-4 w-4 text-gray-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-gray-900 truncate">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="h-6 w-6 p-0 text-gray-500 hover:text-red-500 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
                                  ) : (
            <div className="flex flex-col items-center justify-center w-full gap-1">
              <Upload className="h-3 w-3 text-gray-500 flex-shrink-0" />
              <p className="text-xs text-gray-600">
                Drop file here or click
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs h-5"
              >
                Browse
              </Button>
            </div>
          )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFileTypes}
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
}; 