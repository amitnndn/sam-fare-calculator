import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DirectionsMapDirective } from './sebm.googlemaps.directions';
import { CounterComponent } from './counter.component';
import { HttpModule, JsonpModule } from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

import { AgmCoreModule } from 'angular2-google-maps/core';


@NgModule({
  imports: [
    BrowserModule,
    NgbModule,
    CommonModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    Ng2Bs3ModalModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBYF2xU3IR3vmzmUBFUzD6ss_FMNls4DL4',
      libraries: ['places']
    })
  ],
  providers: [],
  declarations: [ AppComponent, DirectionsMapDirective, CounterComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}