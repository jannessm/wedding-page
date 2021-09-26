import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { GiftsComponent } from './components/gifts/gifts.component';
import { AccomondationsComponent } from './components/accomondations/accomondations.component';
import { ProgrammComponent } from './components/programm/programm.component';
import { DressCodeComponent } from './components/dress-code/dress-code.component';
import { AdminComponent } from './components/admin/admin.component';

import {NgcCookieConsentModule, NgcCookieConsentConfig} from 'ngx-cookieconsent';
import { CookieComponent } from './components/cookie/cookie.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { GuestlistComponent } from './components/guestlist/guestlist.component';
import { GuestlistFormComponent } from './components/guestlist/guestlist-form/guestlist-form.component';
import { GuestlistTableComponent } from './components/guestlist/guestlist-table/guestlist-table.component';
 
const cookieConfig:NgcCookieConsentConfig = {
  "cookie": {
    "domain": "tinesoft.github.io"
  },
  "position": "top-right",
  "theme": "block",
  "palette": {
    "popup": {
      "background": "#85abe0",
      "text": "#000000",
      "link": "#ffffff"
    },
    "button": {
      "background": "#f1d600",
      "text": "#000000",
      "border": "transparent"
    }
  },
  "type": "info",
  "content": {
    "message": "Diese Webseite nutzt ausschließlich funktionale Cookies, um Sessions zu ermöglichen.",
    "dismiss": "Verstanden",
    "deny": "",
    "link": "Weitere Infos",
    "href": "/cookies",
    "policy": "Cookie Policy"
  }
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    GiftsComponent,
    AccomondationsComponent,
    ProgrammComponent,
    DressCodeComponent,
    AdminComponent,
    CookieComponent,
    ChangePasswordComponent,
    GuestlistComponent,
    GuestlistFormComponent,
    GuestlistTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgcCookieConsentModule.forRoot(cookieConfig),
    FormsModule,
    
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
