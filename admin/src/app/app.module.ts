import { NgModule } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AdminModule } from './layouts/admin/admin.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './layouts/login/login.component';
import { EsqueciSenhaComponent } from './layouts/esqueci-senha/esqueci-senha.component';
import { ResetarSenhaComponent } from './layouts/resetar-senha/resetar-senha.component';
import { AdminComponent } from './layouts/admin/admin.component';
import { AsideComponent } from './components/aside/aside.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminRoutingModule } from './layouts/admin/admin-routing.module';

//Modal
import { ModalComponent } from './components/modal/modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

//Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';

//AuthGuard
import { AuthGuard } from './_services/_auth/auth.service';
import * as mime from 'mime';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EsqueciSenhaComponent,
    ResetarSenhaComponent,
    AdminComponent,
    AsideComponent,
    NavbarComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AdminRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AdminModule,
    FormsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    AlertModule.forRoot(),
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
