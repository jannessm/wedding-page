import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse, API_STATUS, DataResponse } from 'src/models/api';
import { UserTable } from 'src/models/guest-table';
import { User, UserResponse } from 'src/models/user';
import { UserApiService } from '../api/user-api/user-api.service';
import { AuthService } from '../auth/auth.service';
import { DialogService } from '../dialog/dialog.service';
import { GuestService } from '../guest/guest.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users: Subject<UserTable[]>;

  _lastDataObject: UserTable[] = [];

  constructor(
    private apiService: UserApiService,
    private guestService: GuestService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialogService: DialogService,
  ) {
    this.users = new Subject<UserTable[]>();
    
    this.updateData();
  }

  updateData() {
    this.apiService.getUsers().subscribe(data => {
      this.parseData(<UserResponse>(<DataResponse>data).payload);
    });
  }

  parseData(users: UserResponse) {

    const usersData: UserTable[] = [];

    Object.values(users).forEach(origUser => {

      const user: UserTable = {
        name: origUser.name,
        isAdmin: origUser.isAdmin,
        guests: origUser.guests,
        newIsAdmin: origUser.isAdmin,
        firstPassword: origUser.firstPassword
      };

      usersData.push(user);
    });
    
    this._lastDataObject = usersData;
    this.users.next(usersData);
  }

  addUser(user: UserTable): Observable<ApiResponse> {
    this._lastDataObject.push(user);
    this.users.next(this._lastDataObject);
    return this.apiService.addUser(user);
  }

  updateUser(updatedUser: UserTable): Observable<boolean> {
    let update = updatedUser.isAdmin != updatedUser.newIsAdmin;

    if (updatedUser.name === this.authService.loggedUser?.name && updatedUser.isAdmin !== this.authService.loggedUser?.isAdmin) {
      this.snackBar.open("Rechte des aktuellen Admins k??nnen nicht ??bernommen werden.", "OK");
      updatedUser.isAdmin = !updatedUser.isAdmin;
      return of(false);
    }

    if (update) {
      return this.apiService.updateAdminRights(updatedUser.name, updatedUser.newIsAdmin).pipe(
        map(resp => {
          if (!resp || resp.status == API_STATUS.ERROR) {
            this.snackBar.open("??nderungen konnten nicht gespeichert werden.", "OK");
            return false;
          } else {
            updatedUser.isAdmin = updatedUser.newIsAdmin;
            return true;
          }
        }));
    }

    return of(false);
  }

  deleteUser(row: UserTable): Observable<boolean> {
    if (row.name === this.authService.loggedUser?.name) {
      this.snackBar.open("Der aktuelle Benutzer kann nicht gel??scht werden.", "OK");
      return of(false);
    }

    return this.apiService.deleteUser(row.name)
      .pipe(map(resp => {
        if (!resp) {
          this.snackBar.open("Benutzer konnte nicht gel??scht werden.", "OK");
          return false;
        
        } else {
          const id = this._lastDataObject.indexOf(row);
          this._lastDataObject.splice(id, 1);
          this.users.next(this._lastDataObject);
          return true;
        }
      }));
  }

  resetPwd(username: string) {
    this.apiService.resetPwd(username).subscribe(success => {
      if (success) {
        let password = success.payload;

        this.dialogService.openInfoDialog(`Passwort wurde auf "${password}" zur??ckgesetzt.`);
      }
    });
  }
}
