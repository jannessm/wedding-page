import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Tina und Jannes';
  authService: AuthService;
  router: Router;
  
  constructor(authService: AuthService, router: Router) {
    this.authService = authService;
    this.router = router;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/', 'login'])
  }
}
