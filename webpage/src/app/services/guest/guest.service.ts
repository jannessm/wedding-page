import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { GuestTable } from 'src/models/guest-table';
import { UserResponse } from 'src/models/user';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  _guests: Subscriber<GuestTable[]> | undefined;
  guests: Observable<GuestTable[]>;

  constructor(private apiService: ApiService, private authService: AuthService) {
    this.guests = new Observable<GuestTable[]>(subscriber => this._guests = subscriber);
    
    if (this.authService.loggedUser?.isAdmin) {
      this.apiService.getUsers().subscribe(users => {
        this.parseUsers(<UserResponse>users);
      })
    }
  }

  parseUsers(users: UserResponse) {
    const guests: GuestTable[] = [];

    Object.keys(users).forEach(user => {
      const u = users[user];
      u.guests.map( guest => {
        return <GuestTable>{
          name: guest.name,
          lastname: guest.lastname,
          age: guest.age,
          isRegistered: guest.isRegistered,
          diet: guest.diet,
          song: guest.song,
          user: user
        }
      }).forEach(val => guests.push(val));
      
      this._guests?.next(guests);
    });
  }
}