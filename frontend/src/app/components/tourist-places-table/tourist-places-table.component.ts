import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AdminDataService } from '../../core/services/admin-data.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';

export interface PlaceData {
  id: number;
  name: string;
  description: string;
  country: string;
  address_string: string;
  rating: string;
  category: string;
  updated_at: string;
  rating_weighted: string;
  quality_score: number;
  review_count: number;
  likes_count: number;
}

@Component({
  selector: 'app-tourist-places-table',
  imports: [CommonModule, 
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    DatePipe],
  templateUrl: './tourist-places-table.component.html',
  styleUrl: './tourist-places-table.component.scss'
})
export class TouristPlacesTableComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'id', 
    'name', 
    'description', 
    'country',
    'address',
    'rating',
    'category',
    'updated',
    'weighted_rating',
    'quality_score',
    'reviews',
    'likes',
    'actions'
  ];
  dataSource = new MatTableDataSource<PlaceData>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private adminService: AdminDataService) {}

  ngOnInit() {
    this.loadPlaces(); 
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadPlaces() {
    this.adminService.getPlaces().subscribe({
      next: res => {
        this.dataSource.data = res;
        console.log('loading places:', this.dataSource.data);
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
      },
      error: err => {
        console.error('Error loading places:', err);
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
