import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { upper } from 'secure-random-password';
import { GuestService } from 'src/app/services/guest/guest.service';
import { UserService } from 'src/app/services/user/user.service';
import { AGE_CATEGORIES, AGE_CATEGORY_ICONS, AGE_CATEGORY_LABELS, Guest } from 'src/models/user';

import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-add-guest-form',
  templateUrl: './add-guest-form.component.html',
  styleUrls: ['./add-guest-form.component.scss']
})
export class AddGuestFormComponent {
  @Input()
  expanded: boolean = false;

  @Output()
  opened = new EventEmitter();
  @Output()
  closed = new EventEmitter();

  form: FormGroup;
  users: string[] = [];

  ages = Object.values(AGE_CATEGORIES);
  agesLabels = AGE_CATEGORY_LABELS;
  agesIcons = AGE_CATEGORY_ICONS;

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

    this.userService.users.subscribe(users => {
      this.users = users.map(u => u.name);
    });
  }

  addGuest() {
    const user = this.form.controls.username.value.trim();
    const name = this.form.controls.name.value.trim();
    const lastname = this.form.controls.lastname.value.trim();
    const age = this.form.controls.age.value;

    this.guestService.addGuest(user, <Guest>{
      uuid: uuid(),
      name,
      lastname,
      age,
      diet: "",
      allergies: "",
      song: ""
    }).subscribe(resp => {
      if (!!resp) {
        this.resetForm();
        this.form.setErrors(null);
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

}

