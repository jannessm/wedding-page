import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { GiftsComponent } from './components/gifts/gifts.component';
import { AccomondationsComponent } from './components/accomondations/accomondations.component';
import { DressCodeComponent } from './components/dress-code/dress-code.component';
import { AdminComponent } from './components/admin/admin.component';

import { NgcCookieConsentModule } from 'ngx-cookieconsent';
import { CookieComponent } from './components/cookie/cookie.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { GuestlistComponent } from './components/admin/guestlist/guestlist.component';
import { AddUserFormComponent } from './components/admin/userlist/add-user-form/add-user-form.component';
import { GuestlistTableComponent } from './components/admin/guestlist/guestlist-table/guestlist-table.component';

import { COOKIE_CONFIG } from 'src/models/cookie-consent-config';
import { JwtInterceptor } from './services/api/jwt.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthGuard } from './guards/auth.guard';
import { IsLoggedGuard } from './guards/is-logged.guard';
import { UserTableComponent } from './components/admin/userlist/user-table/user-table.component';
import { ConfirmDialogComponent } from './components/dialogs/confirm-dialog/confirm-dialog.component';
import { InfoDialogComponent } from './components/dialogs/info-dialog/info-dialog.component';
import { AddGuestFormComponent } from './components/admin/guestlist/add-guest-form/add-guest-form.component';
import { UserlistComponent } from './components/admin/userlist/userlist.component';
import { VectorPipe } from './vector.pipe';
import { SongsComponent } from './components/admin/songs/songs.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { WipComponent } from './components/wip/wip.component';
 


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    GiftsComponent,
    AccomondationsComponent,
    DressCodeComponent,
    AdminComponent,
    CookieComponent,
    ChangePasswordComponent,
    GuestlistComponent,
    AddUserFormComponent,
    GuestlistTableComponent,
    UserTableComponent,
    ConfirmDialogComponent,
    InfoDialogComponent,
    AddGuestFormComponent,
    UserlistComponent,
    VectorPipe,
    SongsComponent,
    ScheduleComponent,
    WipComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgcCookieConsentModule.forRoot(COOKIE_CONFIG),
    FormsModule,
    
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule,
    MatRadioModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi:true},
    AuthGuard,
    IsLoggedGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
