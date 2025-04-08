import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaceService, Place } from '../services/place.service';

@Component({
  selector: 'app-place-list',
  imports: [CommonModule],
  templateUrl: './place-list.component.html',
  styleUrl: './place-list.component.scss'
})
export class PlaceListComponent implements OnInit {
  places: Place[] = [];

  constructor(private placeService: PlaceService) {}

  ngOnInit(): void {
    this.placeService.getAll().subscribe(data => this.places = data);
  }
}
