import { Component, ViewChild } from '@angular/core';
import { AlertController, Content, NavController } from 'ionic-angular';

import { Route } from '../../models/Route';
import { RoutesProvider } from '../../providers/routes';
import { RouteListeComponent } from './components/route-liste/route-liste';
import { RouteFormPage } from './route-form/route-form';

@Component({
  selector: 'page-route',
  templateUrl: 'route.html',
})
export class RoutePage {

  @ViewChild(RouteListeComponent) routeListe: RouteListeComponent;
  @ViewChild(Content) content: Content;
  canCreate: boolean = true;
  reordering: boolean = false;
  hidePlayer: boolean = false;

  constructor(
    private navCtrl: NavController,
    private routesProvider: RoutesProvider,
    private alertCtrl: AlertController) {
  }

  doRefresh(event: any): void {
    this.closeSlidingItems();
    this.alertCtrl.create({
      title: 'Hinweis',
      message: 'Ihr aktuelle Fahrtenhistorie wird zurückgesetzt! Ebenso werden alle manuell de-/aktivierten Ziele in ihren unveränderten Zustand zurückgesetzt!',
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
    this.hidePlayer = this.reordering
  }

  closeSlidingItems() {
    if (this.routeListe)
      this.routeListe.closeSlidingItems();
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
    this.content.resize();
    return this.routesProvider.currentRoute;
  }
  onPress(): void {


    this.routesProvider.showErinnnerung(this.getRoute());

  }
}
