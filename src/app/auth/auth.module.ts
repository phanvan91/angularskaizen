import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import {AuthRoutingModule} from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ToastyConfig, ToastyModule, ToastyService} from 'ng2-toasty';
@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    ToastyModule
  ],
  declarations: [AuthComponent, LoginComponent],
  exports: [ToastyModule]
})
export class AuthModule {
  constructor(private toastyService: ToastyService, private toastyConfig: ToastyConfig) {
    this.toastyConfig.theme = 'bootstrap';
    this.toastyConfig.position = 'top-right';
    this.toastyConfig.showClose = true;
  }
}
