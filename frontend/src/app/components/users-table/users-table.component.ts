import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AdminDataService } from '../../core/services/admin-data.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

export interface UserData {
  id: number;
  name: string;
  email: string;
  bio?: string;
  location?: string;
  interests?: string;
}


@Component({
  selector: 'app-users-table',
  imports: [
    RouterModule,
    CommonModule, 
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule
  ],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.scss'
})
export class UsersTableComponent implements AfterViewInit   {
  displayedColumns: string[] = ['id', 'name', 'email', 'bio','location', 'interests', 'actions'];
  dataSource = new MatTableDataSource<UserData>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, private adminService: AdminDataService) {}

  ngOnInit() {
    this.loadUsers(); 
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers() {
    this.adminService.getUsers().subscribe({
      next: res => {
        this.dataSource.data = res.data;
        console.log('loading users:', this.dataSource.data);
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
      },
      error: err => {
        console.error('Error loading users:', err);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  deleteUser(userId: number) {
  if (!confirm('Ви впевнені, що хочете видалити цього користувача?')) {
    return;
  }

  this.http.delete(`http://localhost:8000/api/admin/users/${userId}`).subscribe({
    next: () => {
      alert('Користувача успішно видалено');
      this.dataSource.data = this.dataSource.data.filter(user => user.id !== userId);
    },
    error: (err) => {
      console.error('Помилка при видаленні користувача:', err);
      alert('Не вдалося видалити користувача');
    }
  });
}

}



