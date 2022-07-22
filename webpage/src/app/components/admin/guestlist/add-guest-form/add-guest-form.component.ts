import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { GuestService } from 'src/app/services/guest/guest.service';
import { UserService } from 'src/app/services/user/user.service';
import { AGE_CATEGORIES, AGE_CATEGORY_ICONS, AGE_CATEGORY_LABELS, DIETS, Guest } from 'src/models/user';

import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-add-guest-form',
  templateUrl: './add-guest-form.component.html',
  styleUrls: ['./add-guest-form.component.scss']
})
export class AddGuestFormComponent implements OnDestroy {
  @Input()
  expanded: boolean = false;

  @Output()
  opened = new EventEmitter();
  @Output()
  closed = new EventEmitter();

  form: FormGroup;
  users: string[] = [];
  filteredUsers: string[] = [];

  ages = Object.values(AGE_CATEGORIES);
  agesLabels = AGE_CATEGORY_LABELS;
  agesIcons = AGE_CATEGORY_ICONS;

  usersSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private guestService: GuestService) {
    this.form = fb.group({
      'username': ['', Validators.required, this.validateUser()],
      'name': ['', Validators.required],
      'lastname': [''],
      'age': ['ADULT', Validators.required]
    });

    this.usersSubscription = this.userService.users.subscribe(users => {
      this.users = users.map(u => u.name);
      this.filteredUsers = this.users;
    });

    if (this.userService._lastDataObject) {
      this.users = this.userService._lastDataObject.map(u => u.name);
      this.filteredUsers = this.users;
    }
  }

  ngOnDestroy() {
    this.usersSubscription.unsubscribe();
  }

  addGuest() {
    const user = this.form.controls.username.value.trim();
    const name = this.form.controls.name.value.trim();
    const lastname = this.form.controls.lastname.value.trim();
    const age = this.form.controls.age.value;

    this.guestService.addGuest(user,  <Guest>{
      uuid: uuid(),
      name,
      lastname,
      age,
      diet: DIETS.NORMAL,
      allergies: [],
      otherAllergies: "",
      song: "",
      isComing: null
    }).subscribe(resp => {
      if (!!resp) {
        this.resetForm();
        this.form.setErrors(null);
        this.userService.updateData();
      }
    });
  }

  resetForm() {
    this.form = this.fb.group({
      'username': ['', Validators.required, this.validateUser()],
      'name': ['', Validators.required],
      'lastname': [''],
      'age': ['ADULT', Validators.required]
    });
  }

  validateUser(): ValidatorFn {
      return (control: AbstractControl): Observable<ValidationErrors | null> => {
        const value = control.value.trim();

        if (!value) {
            return of(null);
        }

        return of(!!this.users.find(user => user === value) ? null : {invalidUser: true});
      }
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user => user.includes(this.form.controls.username.value));
  }

}

