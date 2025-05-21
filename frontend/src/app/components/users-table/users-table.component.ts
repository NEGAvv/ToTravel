import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AdminDataService } from '../../core/services/admin-data.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

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
  imports: [CommonModule, MatFormFieldModule,
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

  constructor(private adminService: AdminDataService) {}

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
}



