import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { LocalStorageService } from './services/local-storage/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  title = 'Tina und Jannes';
  
  constructor(
    public authService: AuthService,
    private router: Router,
    iconRegistry: MatIconRegistry,
    domSaniziter: DomSanitizer
  ) {
    this.authService = authService;
    this.router = router;

    iconRegistry.addSvgIcon('vegan', domSaniziter.bypassSecurityTrustResourceUrl('/assets/vegan.svg'));
    iconRegistry.addSvgIcon('vegetarian', domSaniziter.bypassSecurityTrustResourceUrl('/assets/milk-bottle.svg'));
    iconRegistry.addSvgIcon('gluten-free', domSaniziter.bypassSecurityTrustResourceUrl('/assets/gluten-free.svg'));
    iconRegistry.addSvgIcon('person', domSaniziter.bypassSecurityTrustResourceUrl('/assets/non-binary.svg'));
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/', 'login'])
  }
}
