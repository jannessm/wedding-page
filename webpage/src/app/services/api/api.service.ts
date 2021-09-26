import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/models/user';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  BASE_API = 'http://localhost:8080/'

  constructor(private http: HttpClient) {}

  authorize(user: string, pwd: string): Observable<Object> {
    return this.http.post(this.BASE_API + "auth.php", {
      user,
      pwd
    });
  }

  changePassword(user: string, pwd: string, newPwd: string): Observable<Object> {
    return this.http.post(this.BASE_API + "change-password.php", {
      user,
      pwd,
      newPwd
    });
  }

  addUser(user: User): Observable<Object> {
    return this.http.post(this.BASE_API + "user.php?add", user);
  }

}
