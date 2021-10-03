import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiResponse, API_STATUS, DataResponse } from 'src/models/api';
import { User, UserResponse } from 'src/models/user';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  _lastDataObject: UserResponse | undefined;
  data: Subject<UserResponse>;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
  ) {
    this.data = new Subject<UserResponse>();

    this.getData();
  }

  handleData(resp: ApiResponse) {
    const users = (<DataResponse>resp).payload;
    this._lastDataObject = users;
    this.data.next(users);
  }

  getData() {
    if (this.authService.loggedUser?.isAdmin) {
      this.apiService.getUsers().subscribe(resp => {
        if (resp.status === API_STATUS.SUCCESS) {
          this.handleData(resp);
        }
      })
    }
  }

  getUserObject(username: string): User | undefined {
    if (this._lastDataObject) {
      return this._lastDataObject[username];
    }
    return;
  }

  addUser(user: User): Observable<ApiResponse> {
    return this.apiService.addUser(user).pipe(tap(resp => {
      if (resp.status === API_STATUS.SUCCESS) {
        this.handleData(resp);
      }
    }));
  }

  updateUser(): Observable<undefined | ApiResponse> {
    if (this._lastDataObject) {
      return this.apiService.updateUsers(this._lastDataObject);
    } else {
      return of();
    }
  }

  updateUserNonAdmin(updatedUser: User): Observable<undefined | ApiResponse> {
    if (this._lastDataObject) {
      return this.apiService.updateUser(updatedUser).pipe(
        tap(resp => {
          if (resp.status === API_STATUS.SUCCESS && this._lastDataObject) {
            const user = this._lastDataObject[updatedUser.name];

            user.guests.forEach((guest, id) => {
              guest.diet = updatedUser.guests[id].diet;
              guest.allergies = updatedUser.guests[id].allergies;
              guest.otherAllergies = updatedUser.guests[id].otherAllergies;
              guest.song = updatedUser.guests[id].song;
            });

            // this.handleData(this._lastDataObject);
          }
        })
      );
    } else {
      return of();
    }
  }

  deleteUser(username: string): Observable<boolean> {
    return this.apiService.deleteUser(username).pipe(
      map(resp => {
        if (resp.status == API_STATUS.ERROR) {
          return false;
        
        } else {
          this.handleData(resp);
          return true;
        }
      }
    ));
  }

  resetUserPwd(username: string): Observable<boolean> {
    return this.apiService.resetPwd(username).pipe(
      map(
        reps => reps.status === API_STATUS.SUCCESS
      ));
  }
}
