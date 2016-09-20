import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { VrScenesComponent } from './vr-scenes/vr-scenes.component';
// import { CylinderProjectionComponent } from './scenes\cylinder-projection/cylinder-projection.component';

@NgModule({
  declarations: [
    AppComponent,
    VrScenesComponent
    // , CylinderProjectionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
