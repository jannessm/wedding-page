import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse, DataResponse } from 'src/models/api';
import { UserTable } from 'src/models/guest-table';
import { Guest, User, UserResponse } from 'src/models/user';

@Injectable({
  providedIn: 'root'
})
export class GuestApiService {
  BASE_API = environment.api_base

  constructor(private http: HttpClient) {}

  getGuests(): Observable<DataResponse> {
    return this.http.get<DataResponse>(this.BASE_API + "admin/?guests");
  }

  getGuestsForUser(user: string): Observable<DataResponse> {
    return this.http.post<DataResponse>(this.BASE_API + "auth/?guests", user);
  }

  updateGuests(guests: Guest[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.BASE_API + 'auth/?update-guests', {guests});
  }

  deleteGuest(guestId: string): Observable<DataResponse> {
    return this.http.post<DataResponse>(this.BASE_API + 'admin/?delete-guest', {guest_id: guestId});
  }
}
