import { Component } from '@angular/core';
import { AdminDataService } from '../../core/services/admin-data.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
   activeComponent: string = 'users';
   stats: any = null;

   constructor(private adminService: AdminDataService) {}

  ngOnInit() {
    this.adminService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        console.log('Error fetching stats:', this.stats);
      },
      error: (error) => {
        console.error('Error fetching stats:', error);
      }
    });
  }
}
