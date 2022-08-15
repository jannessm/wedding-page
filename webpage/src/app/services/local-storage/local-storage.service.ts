import { Injectable, OnDestroy } from '@angular/core';


import { NgcCookieConsentService } from 'ngx-cookieconsent';

import { JWT, COOKIE } from 'src/models/jwt';
import { Subscription } from 'rxjs';
import { COOKIE_CONFIG } from 'src/models/cookie-consent-config';

import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService implements OnDestroy {

  private statusChangeSubscription: Subscription;
  private config = COOKIE_CONFIG;

  constructor(private ccService: NgcCookieConsentService) {
 
    this.statusChangeSubscription = this.ccService.statusChange$.subscribe(
      () => {
        localStorage.setItem(COOKIE.CONSENT_POPUP, COOKIE.ACCEPTED);
      });

    this.config.enabled = localStorage.getItem(COOKIE.CONSENT_POPUP) !== COOKIE.ACCEPTED;

    this.ccService.init(this.config);
  }

  get jwt(): string | undefined {
    let jwt: string | null | undefined = localStorage.getItem(COOKIE.JWT);
    
    if (!!!jwt) {
      return;
    }
    
    const decoded: JWT = jwtDecode(jwt);

    // TODO:
    // if (decoded.exp <= Date.now()) {
    //   this.jwt = undefined;
    //   return;
    // }
    
    return jwt;
  }

  set jwt(jwt: string | undefined) {
    if (!jwt) {
      localStorage.removeItem(COOKIE.JWT);
    } else {
      localStorage.setItem(COOKIE.JWT, jwt);
    }
  }

  ngOnDestroy() {
    this.statusChangeSubscription.unsubscribe();
  }
}
