import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { RoutesProvider } from '../../providers/routes/routes';
import { RouteFormPage } from '../route-form/route-form';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  reordering: boolean = false;
  constructor(public navCtrl: NavController, public routesProvider: RoutesProvider) {
  }

  createRoute(): void {
    this.navCtrl.push(RouteFormPage, null);
  }

  switchReorder(): void {
    this.reordering = !this.reordering;
  }
}
