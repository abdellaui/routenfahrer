import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { MyApp } from '../app/app.component';
import { RouteListeComponent } from './route-liste/route-liste';
import { RouteViewComponent } from './route-view/route-view';

@NgModule({
  declarations: [
    RouteListeComponent,
    RouteViewComponent
  ],
  imports: [
    CommonModule,
    IonicPageModule.forChild(MyApp),
  ],
  exports: [
    RouteListeComponent,
    RouteViewComponent
  ]
})
export class ComponentsModule { }
