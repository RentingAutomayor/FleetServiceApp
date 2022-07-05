import { DatePipe } from '@angular/common'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { NgxPaginationModule } from 'ngx-pagination'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { LayoutComponent } from './layout/layout.component'
import { LoginComponent } from './Modules/Login/Components/login/login.component'
import { NavigationComponent } from './Modules/navigation/Components/navigation/navigation.component'
import { AngularFireModule } from '@angular/fire'
import { AngularFireAuthModule } from '@angular/fire/auth'
import { environment } from 'src/environments/environment'
import { MatDialogModule } from '@angular/material/dialog'
import { RecoverPasswordComponent } from './Modules/Login/Components/recover-password/recover-password.component'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { SharedModule } from './SharedComponents/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    LoginComponent,
    RecoverPasswordComponent,
    LayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    SharedModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
