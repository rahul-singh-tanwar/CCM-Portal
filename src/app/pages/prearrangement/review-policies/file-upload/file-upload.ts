import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  imports: [MatIcon, CommonModule],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.css',
})
export class FileUpload {

  @Input() title!: string;
  files: File[] = [];

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement | null;
    const fileList = input?.files ?? [];
    const selectedFiles = Array.from(fileList) as File[];
    this.files.push(...selectedFiles);
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
  }

}
