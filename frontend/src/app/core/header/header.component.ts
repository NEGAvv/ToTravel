import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '../auth/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  userData: User['data'] | null = null;
  defaultAvatar = 'default_avatar.png'; 
  searchQuery = '';
  isDropdownOpen = false;

 constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: (response) => {
        this.userData = response.data;
        console.log('User data loaded:', this.userData);
      },
      error: (err) => {
        console.error('Failed to load user:', err);
        this.userData = null;
      }
    });
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/places'], { 
        queryParams: { search: this.searchQuery },
        queryParamsHandling: 'merge' 
      });
    }
  }

  onLogout() {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }



toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
}

}
