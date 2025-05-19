import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({ providedIn: 'root' })
export class LikeService {
  private apiUrl = 'http://localhost:8000/api/likes';

  constructor(private http: HttpClient) {}

  likeItem(data: { place_id?: number; review_id?: number }): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}`, data).pipe(
      catchError((err) => {
        if (err.status === 409) return of(true); // Вже лайкнуто
        console.error('Like error:', err);
        return of(false);
      })
    );
  }

  unlikeItem(data: { place_id?: number; review_id?: number }): Observable<boolean> {
    return this.http.request<boolean>('delete', `${this.apiUrl}`, { body: data }).pipe(
      catchError((err) => {
        console.error('Unlike error:', err);
        return of(false);
      })
    );
  }

  getSavedPlaces(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8000/api/savedPlaces`).pipe(
      catchError(() => of([])) // Повертаємо пустий масив при помилці
    );
  }
}
