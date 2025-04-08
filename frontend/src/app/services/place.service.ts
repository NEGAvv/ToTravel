import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Place {
  id?: number;
  name: string;
  description?: string;
  location: string;
  image_url?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PlaceService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/places';

  getAll(): Observable<Place[]> {
    return this.http.get<Place[]>(this.apiUrl);
  }

  get(id: number): Observable<Place> {
    return this.http.get<Place>(`${this.apiUrl}/${id}`);
  }

  create(place: Place): Observable<Place> {
    return this.http.post<Place>(this.apiUrl, place);
  }

  update(id: number, place: Partial<Place>): Observable<Place> {
    return this.http.put<Place>(`${this.apiUrl}/${id}`, place);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}