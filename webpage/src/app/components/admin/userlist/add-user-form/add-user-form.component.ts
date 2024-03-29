import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { UserApiService } from 'src/app/services/api/user-api/user-api.service';
import { GuestService } from 'src/app/services/guest/guest.service';
import { UserService } from 'src/app/services/user/user.service';
import { API_STATUS, ErrorResponse } from 'src/models/api';
import { UserTable } from 'src/models/guest-table';
import { AGE_CATEGORIES, AGE_CATEGORY_ICONS, AGE_CATEGORY_LABELS, DIETS, Guest, User } from 'src/models/user';

import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-add-user-form',
  templateUrl: './add-user-form.component.html',
  styleUrls: ['./add-user-form.component.scss']
})
export class AddUserFormComponent {
  @Input()
  expanded: boolean = false;

  @Output()
  opened = new EventEmitter();
  @Output()
  closed = new EventEmitter();

  form: UntypedFormGroup;
  guests: UntypedFormArray;

  ages = Object.values(AGE_CATEGORIES);
  agesLabels = AGE_CATEGORY_LABELS;
  agesIcons = AGE_CATEGORY_ICONS;

  constructor(private fb: UntypedFormBuilder, private userService: UserService, private guestService: GuestService) {
    this.guests = fb.array([
      fb.group({
        'name': ['', Validators.required],
        'lastname': [''],
        'age': ['ADULT', Validators.required]
      })
    ]);

    this.form = fb.group({
      'admin': [false, Validators.required],
      'username': ['', Validators.required],
      'firstPassword': [this.randomPassword(), Validators.required],
      'guests': this.guests
    });
  }

  addGuest() {
    this.guests.push(
      this.fb.group({
        'name': ['', Validators.required],
        'lastname': [''],
        'age': ['', Validators.required]
      })
    );
  }

  removeGuest() {
    if (this.guests.length > 1) {
      this.guests.removeAt(this.guests.length - 1);
    }
  }

  addUser() {
    const user = (this.form.controls.username.value as string).toLowerCase();
    const pwd = this.form.controls.firstPassword.value;
    const isAdmin = this.form.controls.admin.value;
    const guests = this.getGuests();

    this.userService.addUser(<UserTable>{
      name: user,
      firstPassword: pwd,
      isAdmin,
      newIsAdmin: isAdmin,
      firstLogin: true,
      guests: guests.map(g => g.lastname ? g.name + ' ' + g.lastname : g.name).join(', ')
    }).subscribe(resp => {
      if (resp.status === API_STATUS.ERROR) {
        this.form.controls.username.setErrors({'userExists': true});
      } else {
        this.resetForm();
        this.form.setErrors(null);
        guests.forEach(guest => this.guestService.addGuest(user, guest).subscribe());

        this.guestService.updateData();
      }
    });
  }

  getGuests(): Guest[] {
    return this.guests.controls.map(group => {
      return <Guest>{
        uuid: uuid(),
        name: (<UntypedFormGroup>group).controls.name.value,
        lastname: (<UntypedFormGroup>group).controls.lastname.value,
        age: (<UntypedFormGroup>group).controls.age.value,
        isComing: null,
        song: '',
        diet: DIETS.NORMAL,
        allergies: [],
        otherAllergies: ''
      };
    });
  }

  resetForm() {
    this.guests = this.fb.array([
      this.fb.group({
        'name': ['', Validators.required],
        'lastname': [''],
        'age': ['ADULT', Validators.required]
      })
    ]);

    this.form = this.fb.group({
      'admin': [false, Validators.required],
      'username': ['', Validators.required],
      'firstPassword': [this.randomPassword(), Validators.required],
      'guests': this.guests
    });
  }

  randomPassword(len = 8): string {
    const chars = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXY3456789" // without similar symbols
    return Array<string>(len).fill('').reduce((pwd) => pwd + chars[Math.floor(Math.random() * chars.length)]);
  }

}
