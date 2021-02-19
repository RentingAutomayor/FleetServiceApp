import { BrowserModule } from '@angular/platform-browser';
import { NgModule , CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppComponent } from './app.component';
import { DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LoginComponent } from './Modules/Login/Components/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { NavigationComponent } from './Modules/navigation/Components/navigation/navigation.component';

import { SharedModule } from './SharedComponents/shared.module';






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
  providers: [
    DatePipe
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
