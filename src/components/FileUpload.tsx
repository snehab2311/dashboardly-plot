import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Upload, FileSpreadsheet } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const isValidFileType = (fileName: string) => {
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    return validExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (isValidFileType(file.name)) {
        setSelectedFile(file);
      } else {
        alert('Please upload a CSV or Excel file');
      }
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (isValidFileType(file.name)) {
        setSelectedFile(file);
      } else {
        alert('Please upload a CSV or Excel file');
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-dashboardly-accent">Upload Data File</CardTitle>
        <CardDescription>Upload a CSV or Excel file to start analyzing your data.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div 
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-48 
              ${dragActive ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50 hover:bg-muted/40'} 
              transition-all cursor-pointer`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">
              Drag & drop your file here, or <span className="text-primary">browse</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports CSV and Excel files (up to 10MB)
            </p>
            <Input 
              id="file-upload" 
              type="file" 
              className="hidden" 
              accept=".csv,.xlsx,.xls"
              onChange={handleChange} 
            />
          </div>
          
          {selectedFile && (
            <div className="mt-4">
              <div className="flex items-center justify-between bg-muted/40 rounded-md p-2">
                <div className="flex items-center">
                  <FileSpreadsheet className="h-6 w-6 text-muted-foreground mr-2" />
                  <div>
                    <p className="text-sm font-medium truncate w-40 md:w-auto">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  Analyze Data
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground border-t pt-4">
        <div>Max file size: 10MB</div>
        <div>Supported formats: .csv, .xlsx, .xls</div>
      </CardFooter>
    </Card>
  );
};

export default FileUpload; 