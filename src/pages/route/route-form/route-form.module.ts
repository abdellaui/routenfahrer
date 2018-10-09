import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { RouteFormPage } from './route-form';

@NgModule({
  declarations: [
    RouteFormPage,
  ],
  imports: [
    IonicPageModule.forChild(RouteFormPage),
  ],
  exports: [
    RouteFormPage,
  ]
})
export class RouteFormPageModule { }
