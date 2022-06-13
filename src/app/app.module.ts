import { DatePipe } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
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
import { SharedModule } from './SharedComponents/shared.module'

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    LoginComponent,
    LoginComponent,
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
  ],
  providers: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
