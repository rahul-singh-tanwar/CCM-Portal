import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileUpload } from '../file-upload/file-upload';  

@Component({
  selector: 'app-policy-details-dialog',
  imports: [FileUpload, CommonModule],
  templateUrl: './policy-details-dialog.html',
  styleUrl: './policy-details-dialog.css',
})
export class PolicyDetailsDialog {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PolicyDetailsDialog>
  ) {}

  close() {
    this.dialogRef.close();
  }

}
