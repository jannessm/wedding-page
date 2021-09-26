import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import {randomPassword, lower, upper, digits} from 'secure-random-password';
import { ApiService } from 'src/app/services/api/api.service';
import { AgeCategories, Guest } from 'src/models/user';

@Component({
  selector: 'app-guestlist-form',
  templateUrl: './guestlist-form.component.html',
  styleUrls: ['./guestlist-form.component.scss']
})
export class GuestlistFormComponent implements OnInit {
  @Input()
  expanded: boolean = false;

  @Output()
  opened = new EventEmitter();

  form: FormGroup;
  guests: FormArray;

  ages = Object.keys(AgeCategories);
  agesLabels = Object.values(AgeCategories);

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.guests = fb.array([
      fb.group({
        'name': ['', Validators.required],
        'lastname': [''],
        'age': [Object.keys(AgeCategories)[2], Validators.required]
      })
    ]);

    this.form = fb.group({
      'admin': [false, Validators.required],
      'username': ['', Validators.required],
      'firstPassword': [this.randomPassword(), Validators.required],
      'guests': this.guests
    });
  }

  ngOnInit(): void {
  }

  emitOpened() {
    this.opened.emit();
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

    this.apiService.addUser({
      name: user,
      firstPassword: pwd,
      isAdmin,
      firstLogin: true,
      guests
    }).subscribe(console.log)
  }

  getGuests(): Guest[] {
    return this.guests.controls.map(group => {
      return <Guest>{
        name: (<FormGroup>group).controls.name.value,
        lastname: (<FormGroup>group).controls.lastname.value,
        age: (<FormGroup>group).controls.age.value
      };
    });
  }

  randomPassword(len = 8): string {
    return randomPassword({
      length: len,
      characters: [lower, upper, digits],
    });
  }

}
