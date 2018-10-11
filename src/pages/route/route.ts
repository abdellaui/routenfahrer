import { Component, ViewChild } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';

import { Route } from '../../models/Route';
import { RoutesProvider } from '../../providers/routes';
import { SettingsProvider } from '../../providers/settings';
import { RouteListeComponent } from './components/route-liste/route-liste';
import { RouteFormPage } from './route-form/route-form';

@Component({
  selector: 'page-route',
  templateUrl: 'route.html',
})
export class RoutePage {

  @ViewChild(RouteListeComponent) routeListe: RouteListeComponent;
  canCreate: boolean = true;
  reordering: boolean = false;

  constructor(
    private navCtrl: NavController,
    private routesProvider: RoutesProvider,
    private settingsProvider: SettingsProvider,
    private alertCtrl: AlertController) {

  }

  doRefresh(event: any): void {
    this.closeSlidingItems();
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

  ionViewWillLeave() {
    this.closeReordering();
    this.closeSlidingItems();
  }
  createRoute(): void {
    this.navCtrl.push(RouteFormPage, { route: null });
  }

  closeReordering(): void {
    if (this.reordering)
      this.switchReorder();
  }
  switchReorder(): void {
    this.closeSlidingItems();
    this.canCreate = !this.canCreate;
    this.reordering = !this.reordering;

  }

  closeSlidingItems() {
    if (this.routeListe)
      this.routeListe.closeSlidingItems();
  }

  getAutoRefresh(): boolean {
    return this.settingsProvider.configs.autoRefresh;
  }

  getCount(): number {
    return this.routesProvider.getCount();
  }

  prev(): void {
    this.closeReordering();
    this.closeSlidingItems();
    this.routesProvider.prev();
  }
  next(): void {
    this.closeReordering();
    this.closeSlidingItems();
    this.routesProvider.next();
  }
  play(): void {
    this.closeReordering();
    this.closeSlidingItems();
    this.routesProvider.start();
  }
  isPlaying(): boolean {
    return this.routesProvider.isPlaying;
  }
  getRoute(): Route {
    return this.routesProvider.currentRoute;
  }
  onPress(): void {


    this.routesProvider.showErinnnerung(this.getRoute());

  }
}
