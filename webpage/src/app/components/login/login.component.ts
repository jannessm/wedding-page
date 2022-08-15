import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import md5 from 'md5-ts';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: UntypedFormGroup;
  wrongCredentials = false;

  constructor(private authService: AuthService, private router: Router, private fb: UntypedFormBuilder) {    
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
      (this.form.controls.username.value as string).toLowerCase(),
      md5(this.form.controls.password.value)
    ).subscribe(user => {
      // no user data returned === wrong credentials
      if (!user) {
        this.wrongCredentials = true;

        Object.values(this.form.controls).forEach(control => {
          control.setErrors({});
        });

      // login successful => redirect to change-password/previous-url/default page
      } else {
        if (user.firstLogin) {
          this.router.navigate(['/', 'user', 'change-password']);
        
        } else if (this.authService.redirectUrl) {
          this.router.navigateByUrl(this.authService.redirectUrl);
        
        } else {
          this.router.navigateByUrl('/program');
        }
      }
    })
  }

}
