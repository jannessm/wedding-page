import { Injectable, OnDestroy } from '@angular/core';


import { NgcCookieConsentService } from 'ngx-cookieconsent';

import { JWT, COOKIE } from 'src/models/jwt';
import { Subscription } from 'rxjs';
import { COOKIE_CONFIG } from 'src/models/cookie-consent-config';

import ls from 'localstorage-slim';
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
        console.log("cookie accepted");
        ls.set(COOKIE.CONSENT_POPUP, COOKIE.ACCEPTED);
      });

    this.config.enabled = ls.get(COOKIE.CONSENT_POPUP) !== COOKIE.ACCEPTED;

    this.ccService.init(this.config);
  }

  get jwt(): string | undefined {
    let jwt: string | null | undefined = ls.get(COOKIE.JWT);
    
    if (!!!jwt) {
      return;
    }
    
    const decoded: JWT = jwtDecode(jwt);

    // if (decoded.exp <= Date.now()) {
    //   this.jwt = undefined;
    //   return;
    // }
    
    return jwt;
  }

  set jwt(jwt: string | undefined) {
    ls.set(COOKIE.JWT, jwt);
  }

  ngOnDestroy() {
    this.statusChangeSubscription.unsubscribe();
  }
}
