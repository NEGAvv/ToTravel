import { Component } from '@angular/core';
import { UsersTableComponent } from '../../components/users-table/users-table.component';
import { TouristPlacesTableComponent } from '../../components/tourist-places-table/tourist-places-table.component';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from '../../components/admin-dashboard/admin-dashboard.component';

@Component({
  selector: 'app-admin-panel',
  imports: [CommonModule, UsersTableComponent, TouristPlacesTableComponent, AdminDashboardComponent,],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent {
  activeComponent: string = 'users';

  setActive(component: string) {
    console.log(`Switching to ${component} component`);
    this.activeComponent = component;
  }
}
