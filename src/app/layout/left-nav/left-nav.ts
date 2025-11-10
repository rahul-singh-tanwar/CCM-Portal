import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { stratProccess } from '../../../utils/searchService';

@Component({
  selector: 'app-left-nav',
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './left-nav.html',
  styleUrl: './left-nav.css',
})
export class LeftNav {
   @Input() collapsed = false;

   constructor(private router: Router) {}


  navigateTo(route: string) {
    console.log('Navigating to:', route);
    this.router.navigate([route]);
    
    const payload = {
      processDefinitionId: "",
      processDefinitionVersion: "",
      variables: {}
    }

    stratProccess(payload).then(response => {
      console.log('Process started successfully:', response);
    }).catch(error => {
      console.error('Error starting process:', error);
    });
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, { paths: 'exact', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored' });
  }

}
