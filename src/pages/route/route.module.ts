import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { RouteListeComponent } from './components/route-liste/route-liste';
import { RouteViewComponent } from './components/route-view/route-view';
import { RouteFormPageModule } from './route-form/route-form.module';
import { RoutePage } from './route';

@NgModule({
  declarations: [
    RoutePage,
    RouteListeComponent,
    RouteViewComponent
  ],
  imports: [
    IonicPageModule.forChild(RoutePage),
    RouteFormPageModule
  ],
  exports: [
    RoutePage,
  ]
})
export class RoutePageModule { }
