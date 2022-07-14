import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse, DataResponse } from 'src/models/api';
import { Guest, User, UserResponse } from 'src/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  BASE_API = environment.api_base

  constructor(private http: HttpClient) {}

  authorize(user: string, pwd: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.BASE_API + "auth/?login", {
      user,
      pwd
    });
  }

  validateJWT(jwt: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.BASE_API + "auth/?validate", {
      jwt
    });
  }

  changePassword(user: string, pwd: string, newPwd: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.BASE_API + "auth/?change-password", {
      user,
      pwd,
      newPwd
    });
  }

  addUser(user: User): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.BASE_API + "admin/?user", user);
  }

  getUsers(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.BASE_API + "admin/?user");
  }

  getGuests(user: User): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.BASE_API + "auth/?guests", user);
  }

  updateUser(user: UserResponse): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.BASE_API + 'admin/?update-user', user);
  }

  updateAdminRights(username: string, isAdmin: boolean): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.BASE_API + 'admin/?update-admin-rights', {name: username, is_admin: isAdmin});
  }

  updateGuests(guests: Guest[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.BASE_API + 'auth/?update-guests', {guests});
  }

  deleteUser(user: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.BASE_API + "admin/?delete-user", {name: user});
  }

  resetPwd(user: string): Observable<DataResponse> {
    return this.http.post<DataResponse>(this.BASE_API + "admin/?reset-pwd", {name: user});
  }
}
