import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';

import { RoutesProvider } from '../../providers/routes';
import { RouteFormPage } from '../route-form/route-form';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  canCreate: boolean = true;
  reordering: boolean = false;

  constructor(public navCtrl: NavController, 
    public routesProvider: RoutesProvider,
    public alertCtrl: AlertController) {

  }

  doRefresh(event: any): void {
    this.alertCtrl.create({
      title: 'Hinweis',
      message: 'Ihre Routenhistorie wird überschrieben!',
      buttons: [
        {
          text: 'Abbrechen',
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

    this.navCtrl.push(RouteFormPage, null);
  }

  switchReorder(): void {
    this.canCreate = !this.canCreate;
    this.reordering = !this.reordering;

  }
}
