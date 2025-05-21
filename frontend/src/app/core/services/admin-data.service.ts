import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminDataService {

  private baseUrl = 'http://127.0.0.1:8000'; 

  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/admin/stats`);
  } 

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/admin/users`);
  } 

  getPlaces(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/places/all`);
  }

}
