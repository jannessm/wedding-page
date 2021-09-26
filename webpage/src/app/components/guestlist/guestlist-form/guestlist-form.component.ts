import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import {randomPassword, lower, upper, digits} from 'secure-random-password';
import { ApiService } from 'src/app/services/api/api.service';
import { GuestService } from 'src/app/services/guest/guest.service';
import { AGE_CATEGORIES, AGE_CATEGORY_ICONS, AGE_CATEGORY_LABELS, DIETS, Guest, User, UserResponse } from 'src/models/user';

import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-guestlist-form',
  templateUrl: './guestlist-form.component.html',
  styleUrls: ['./guestlist-form.component.scss']
})
export class GuestlistFormComponent {
  @Input()
  expanded: boolean = false;

  @Output()
  opened = new EventEmitter();
  @Output()
  closed = new EventEmitter();

  form: FormGroup;
  guests: FormArray;

  ages = Object.values(AGE_CATEGORIES);
  agesLabels = AGE_CATEGORY_LABELS;
  agesIcons = AGE_CATEGORY_ICONS;

  constructor(private fb: FormBuilder, private apiService: ApiService, private guestService: GuestService) {
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
    const user = this.form.controls.username.value;
    const pwd = this.form.controls.firstPassword.value;
    const isAdmin = this.form.controls.admin.value;
    const guests = this.getGuests();

    this.apiService.addUser(<User>{
      name: user,
      firstPassword: pwd,
      isAdmin,
      firstLogin: true,
      guests
    }).subscribe(users => this.guestService.parseUsers(<UserResponse>users));

    this.resetForm();
    this.form.setErrors(null);
  }

  getGuests(): Guest[] {
    return this.guests.controls.map(group => {
      return <Guest>{
        uuid: uuid(),
        name: (<FormGroup>group).controls.name.value,
        lastname: (<FormGroup>group).controls.lastname.value,
        age: (<FormGroup>group).controls.age.value,
        isRegistered: false,
        song: '',
        diet: DIETS.NORMAL,
        allergies: ''
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
    return randomPassword({
      length: len,
      characters: [lower, upper, digits],
    });
  }

}
