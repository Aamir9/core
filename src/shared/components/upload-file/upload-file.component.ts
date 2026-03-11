import { Component, EventEmitter, Output } from '@angular/core';

export interface Base64File {
  fileName: string;
  fileType: string;
  fileBase64: string;
  fileSize: number; // add size
}

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css'],
})
export class UploadFileComponent {
  @Output() onFileUpload = new EventEmitter<Base64File>();
  filePreview: string | null = null;
  selectedFile: File | null = null;

  onFilePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Example: 10MB file size limit
    if (file.size > 10 * 1024 * 1024) {
      alert('File is too large!');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      this.filePreview = base64String;
      this.selectedFile = file;
      this.onFileUpload.emit({
        fileName: file.name,
        fileType: file.type,   // MIME type
        fileBase64: base64String,
        fileSize: file.size,   // file size in bytes
      });
    };
    reader.readAsDataURL(file);
  }

  removeFile() {
    this.filePreview = null;
    this.selectedFile = null;
  }
}
