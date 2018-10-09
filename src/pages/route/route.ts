import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';

import { RoutesProvider } from '../../providers/routes';
import { RouteFormPage } from './route-form/route-form';

@Component({
  selector: 'page-route',
  templateUrl: 'route.html',
})
export class RoutePage {

  canCreate: boolean = true;
  reordering: boolean = false;

  constructor(
    private navCtrl: NavController,
    private routesProvider: RoutesProvider,
    private alertCtrl: AlertController) {

  }

  doRefresh(event: any): void {
    this.alertCtrl.create({
      title: 'Hinweis',
      message: 'Ihr aktuelle Fahrtenhistorie wird zurückgesetzt!',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => {
            event.cancel();
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.routesProvider.reset();
            event.complete();
          }
        }
      ]
    }).present();
  }
  createRoute(): void {
    this.navCtrl.push(RouteFormPage, { route: null });
  }

  switchReorder(): void {
    this.canCreate = !this.canCreate;
    this.reordering = !this.reordering;

  }
}
