import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/models/api';
import { User, UserResponse } from 'src/models/user';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  BASE_API = 'http://localhost:8080/api/'

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

  updateUsers(user: UserResponse): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.BASE_API + 'admin/?update-user', user);
  }

  deleteUser(user: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.BASE_API + "admin/?delete-user", {name: user});
  }

  resetPwd(user: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.BASE_API + "admin/?reset-pwd", {name: user});
  }

}
