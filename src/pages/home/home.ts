import { Component } from '@angular/core';
import { AlertController, ModalController, NavController } from 'ionic-angular';

import { RoutesProvider } from '../../providers/routes';
import { RouteFormPage } from '../route-form/route-form';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  canCreate: boolean = true;
  reordering: boolean = false;

  constructor(
    public navCtrl: NavController,
    public routesProvider: RoutesProvider,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController) {

  }

  doRefresh(event: any): void {
    this.alertCtrl.create({
      title: 'Hinweis',
      message: 'Ihr aktueller Fahrtenhistorie wird zurückgesetzt!',
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
