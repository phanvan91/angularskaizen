import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {HttpClientModule} from '@angular/common/http';
import {SharedModule} from './shared/shared.module';
import 'rxjs/add/operator/takeWhile';
import {Ng2ImgMaxModule} from 'ng2-img-max';
import { BaoHanhComponent } from './bao-hanh/bao-hanh.component';
import {Select2Module} from 'ng2-select2';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    BaoHanhComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule.forRoot(),
    Ng2ImgMaxModule,
    Select2Module,
      FormsModule,
      ReactiveFormsModule,
  ],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
