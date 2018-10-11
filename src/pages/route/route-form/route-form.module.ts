import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { AutosizeDirective } from '../components/autosize/autosize.directive';
import { RouteFormPage } from './route-form';

@NgModule({
  declarations: [
    RouteFormPage,
    AutosizeDirective,
  ],
  imports: [
    IonicPageModule.forChild(RouteFormPage),
  ],
  exports: [
    RouteFormPage,
  ]
})
export class RouteFormPageModule { }
