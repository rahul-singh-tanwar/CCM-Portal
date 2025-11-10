import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';


@Component({
  selector: 'app-review-policies',
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule, 
    MatPaginatorModule, 
    MatIconModule, 
    MatButtonModule, 
    MatExpansionModule, 
    MatRadioModule
  ],
  templateUrl: './review-policies.html',
  styleUrl: './review-policies.css',
})
export class ReviewPolicies {

   displayedColumns: string[] = [
    'select',
    'companyName',
    'policyType',
    'policyNumber',
    'policyStatus',
    'effectiveDate',
    'expiryDate',
    'firstUseDate',   
    'benefits'
  ];

   dataSource = [
    {
      companyName: 'Allianz Ayudhya',
      policyType: 'A&H',
      policyNumber: 'PA-2025-045678',
      policyStatus: 'Inforce',
      effectiveDate: '2025-01-01',
      expiryDate: '2025-12-31',
      firstUseDate: '2025-02-15',
      benefits: [
        { name: 'Inpatient Room & Board', limit: 'THB 5,000 per day', remarks: 'Exclusion: Eye treatment' },
        { name: 'OPD Consultation', limit: 'THB 2,000 per visit', remarks: 'Exclusion: Dental treatment' }
      ]
    },
    {
      companyName: 'Allianz Ayudhya',
      policyType: 'L&H',
      policyNumber: 'OL-2023-009876',
      policyStatus: 'Inforce',
      effectiveDate: '2023-01-01',
      expiryDate: '2033-01-01',
      firstUseDate: '2023-09-01',
      benefits: [
        { name: 'Death Coverage', limit: 'THB 1,000,000', remarks: 'Waiting period: 90 days' }
      ]
    },
    {
      companyName: 'Allianz Ayudhya',
      policyType: 'L&H',
      policyNumber: 'OL-2024-009877',
      policyStatus: 'Inforce',
      effectiveDate: '2024-01-01',
      expiryDate: '2034-01-01',
      firstUseDate: '2024-12-01',
      benefits: [
        { name: 'Death Coverage', limit: 'THB 1,000,000', remarks: 'Waiting period: 90 days' }
      ]
    }
  ];

  expandedRow: any | null = null;

  toggleRow(row: any) {
    this.expandedRow = this.expandedRow === row ? null : row;
  }

}
