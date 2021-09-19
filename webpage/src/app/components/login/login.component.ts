import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import md5 from 'md5-ts';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  wrongCredentials = false;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.form = fb.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required]
    });

    this.form.controls.username.valueChanges.subscribe(() => this.form.controls.password.setErrors(null));
    this.form.controls.password.valueChanges.subscribe(() => this.form.controls.username.setErrors(null));

    Object.values(this.form.controls).forEach(control => 
      control.valueChanges.subscribe(() => this.wrongCredentials = false)
    );
  }

  ngOnInit(): void {
  }

  login() {
    this.authService.login(
      this.form.controls.username.value,
      md5(this.form.controls.password.value)
    ).subscribe(data => {
      if (data.hasOwnProperty('error')) {
        this.wrongCredentials = true;

        Object.values(this.form.controls).forEach(control => {
          control.setErrors({});
        });

      } else {
        this.router.navigate(['/','registration']);
      }
    })
  }

}
