import { Injectable } from '@angular/core';
import { Observable, of, Subscriber } from 'rxjs';
import { GuestTable, UserTable } from 'src/models/guest-table';
import { Guest, User, UserResponse } from 'src/models/user';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

import { v4 as uuid } from 'uuid';
import { API_STATUS, DataResponse } from 'src/models/api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';
import { DialogService } from '../dialog/dialog.service';

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  _guests: Subscriber<GuestTable[]> | undefined;
  guests: Observable<GuestTable[]>;
  _users: Subscriber<UserTable[]> | undefined;
  users: Observable<UserTable[]>;

  _lastDataObject: UserResponse | undefined;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialogService: DialogService,
  ) {
    this.guests = new Observable<GuestTable[]>(subscriber => this._guests = subscriber);
    this.users = new Observable<UserTable[]>(subscriber => this._users = subscriber);

    this.getData();
  }

  getData() {
    if (this.authService.loggedUser?.isAdmin) {
      this.apiService.getUsers().subscribe(resp => {
        if (resp.status === API_STATUS.SUCCESS) {
          const users = (<DataResponse>resp).payload;
          this.parseUsers(users);
          this._lastDataObject = users;
        }
      })
    }
  }

  parseUsers(users: UserResponse) {
    const guestsData: GuestTable[] = [];
    const usersData: UserTable[] = [];

    Object.keys(users).forEach(username => {

      const origUser = users[username];
      origUser.guests.map( guest => {
        if (!guest.uuid) {
          guest.uuid = uuid()
        }

        return <GuestTable>{
          user: username,
          uuid: guest.uuid,
          name: guest.name,
          lastname: guest.lastname,
          age: guest.age,
          isRegistered: guest.isRegistered,
          diet: guest.diet,
          song: guest.song,
          editMode: false,
          allergies: ""
        }
      }).forEach(val => guestsData.push(val));

      const user: UserTable = {
        name: username,
        isAdmin: origUser.isAdmin,
        guests: origUser.guests
          .map( guest => !!guest.lastname ? `${guest.name} ${guest.lastname}` : guest.name)
      };

      usersData.push(user);
    });

    this._guests?.next(guestsData);
    this._users?.next(usersData);
  }

  updateData(updatedGuest: GuestTable) {
    if (this._lastDataObject) {
      let oldGuest: Guest;
      const row = this._lastDataObject[updatedGuest.user];
      
      if (!!row) {
        row.guests.forEach(guest => {
          if (guest.uuid === updatedGuest.uuid) {
            // copy old data for restoring if needed
            oldGuest = {
              name: guest.name,
              lastname: guest.lastname,
              age: guest.age,
              allergies: guest.allergies,
              diet: guest.diet,
              isRegistered: guest.isRegistered,
              uuid: guest.uuid,
              song: guest.song
            };


            guest.name = updatedGuest.name;
            guest.lastname = updatedGuest.lastname;
            guest.age = updatedGuest.age;
            guest.allergies = updatedGuest.allergies;
            guest.diet = updatedGuest.diet;
            guest.isRegistered = updatedGuest.isRegistered;
          }
        });
      }

      this.apiService.updateUsers(this._lastDataObject).subscribe(resp => {
        if (resp.status == API_STATUS.ERROR) {
          this.snackBar.open("Änderungen konnten nicht gespeichert werden.", "OK");

          updatedGuest.name = oldGuest.name;
          updatedGuest.lastname = oldGuest.lastname;
          updatedGuest.age = oldGuest.age;
          updatedGuest.allergies = oldGuest.allergies;
          updatedGuest.diet = oldGuest.diet;
          updatedGuest.isRegistered = oldGuest.isRegistered;
        }
      });
    }
  }

  updateUser(updatedUser: UserTable): Observable<boolean> {
    let update = false;

    if (updatedUser.name === this.authService.loggedUser?.name && updatedUser.isAdmin !== this.authService.loggedUser?.isAdmin) {
      this.snackBar.open("Rechte des aktuellen Admins können nicht übernommen werden.", "OK");
      updatedUser.isAdmin = !updatedUser.isAdmin;
      return of(false);
    }
    
    if (this._lastDataObject) {
      const row = this._lastDataObject[updatedUser.name];
      
      if (!!row && row.isAdmin !== updatedUser.isAdmin) {
        row.isAdmin = updatedUser.isAdmin;
        update = true;
      }
    }

    if (update && this._lastDataObject) {
      const row = this._lastDataObject[updatedUser.name];

      return this.apiService.updateUsers(this._lastDataObject).pipe(
        map(resp => {
          if (resp.status == API_STATUS.ERROR) {
            this.snackBar.open("Änderungen konnten nicht gespeichert werden.", "OK");

            row.isAdmin = !updatedUser.isAdmin;
            console.log(row.isAdmin);
            return false;
          } else {
            return true;
          }
        }));
    }

    return of(false);
  }

  deleteUser(row: UserTable): Observable<boolean> {
    if (row.name === this.authService.loggedUser?.name) {
      this.snackBar.open("Der aktuelle Benutzer kann nicht gelöscht werden.", "OK");
      return of(false);
    }
    if (this._lastDataObject) {
      const user = this._lastDataObject[row.name];
      
      if (!!user) {
        return this.apiService.deleteUser(row.name)
          .pipe(map(resp => {
            if (resp.status == API_STATUS.ERROR) {
              this.snackBar.open("Benutzer konnte nicht gelöscht werden.", "OK");
              return false;
            
            } else {
              const users = (<DataResponse>resp).payload;
              this.parseUsers(users);
              this._lastDataObject = users;
              return true;
            }
          }));
      }
    }

    return of(false);
  }

  resetPwd(user: string) {
    this.apiService.resetPwd(user).subscribe(resp => {
      if (resp.status === API_STATUS.SUCCESS) {
        let password = "";

        if (this._lastDataObject && this._lastDataObject[user]) {
          password = this._lastDataObject[user].firstPassword;
        }

        this.dialogService.openInfoDialog(`Passwort wurde auf "${password}" zurückgesetzt.`);
      }
    });
  }
}