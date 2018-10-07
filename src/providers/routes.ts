import { Injectable } from '@angular/core';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { Storage } from '@ionic/storage';
import { AlertController, ToastController } from 'ionic-angular';
import { ReorderIndexes } from 'ionic-angular/umd/components/item/item-reorder';

import { Address } from '../models/Address';
import { Route } from '../models/Route';
import { SettingsProvider } from './settings';

@Injectable()
export class RoutesProvider {


  dummy: Route = new Route();
  currentRoute: Route = null;
  currentIndex: number = 0;
  isPlaying: boolean = false;
  routes: Route[] = [];
  _activeRoutesCount: number = 0;

  constructor(
    private storage: Storage,
    private toastCtrl: ToastController,
    private launchNavigator: LaunchNavigator,
    private alertCtrl: AlertController,
    private settingsProvider: SettingsProvider) {

    this.storage.ready().then(() => {


      this.storage.get('routes').then((result: Route[]) => {
        if (!result) return;
        const instances = result.map(item => {
          const route = Object.assign(new Route(), item);
          route.address = Object.assign(new Address(), item.address);
          return route;
        });
        this.setRoutes(instances);
        this.setCurrentIndex(this.settingsProvider.configs.currentIndex);
      }).catch((e: Error) => {
        console.log(e);
      });
    });
  }

  private updateFences(): void {
    const fences = this.routes.map((route: Route) => {
      if (route.canRide())
        return route.getFence()

    });
    //this.geofence.addOrUpdate(fences).then(r => console.log(r)).catch(e => console.log(e));
  }
  private setRoutes(routes: Route[]): void {
    this.routes = routes;
    this.refreshActiveRoutesCount();
  }
  private setCurrentIndex(index: number): void {
    this.currentIndex = index;
    this.currentRoute = (this.checkIndex(this.currentIndex)) ? this.routes[this.currentIndex] : null;
    this.storeCurrentIndex();
  }

  private storeCurrentIndex(): void {
    this.settingsProvider.configs.currentIndex = this.currentIndex;
    this.settingsProvider.storeConfigs();
  }

  private refreshActiveRoutesCount(): void {
    this._activeRoutesCount = this.routes.filter((item: Route) => { return item.canRide() }).length;
    this.updateFences();
  }

  private storeRoutes(): void {
    this.refreshActiveRoutesCount();
    this.storage.set('routes', this.routes);

    this.currentIndex = (this.checkIndex(this.currentIndex))
      ? this.currentIndex
      : this.findNextTask(this.currentIndex, true);

    this.setCurrentIndex(this.currentIndex);
  }



  private checkIndex(id: number): boolean {
    return (this.routes[id] && this.routes[id].canRide());
  }


  private findNextTask(index: number, forward: boolean): number {

    if (this._activeRoutesCount === 0) return 0;

    const mult = (forward) ? 1 : -1;
    let indexing = index;

    do {
      indexing = (indexing + this.getCount() + (1 * mult)) % this.getCount();
    } while (!this.checkIndex(indexing) && indexing != index);

    return indexing;

  }

  getDummy(): Route {
    return this.dummy;
  }

  getCount(): number {
    return this.routes.length;
  }


  reorderRoutes(indexes: ReorderIndexes): void {
    let element: Route = this.routes[indexes.from];
    this.routes.splice(indexes.from, 1);
    this.routes.splice(indexes.to, 0, element);
    this.storeRoutes();
  }

  changeRoute(route: Route, message?: string): void {
    let searchingIndex = -1;
    this.routes.forEach((item: Route, index: number) => {
      if (item.id == route.id) {
        return (searchingIndex = index);
      }
    });
    if (searchingIndex == -1) return;
    this.routes[searchingIndex] = route;

    this.storeRoutes();
    // this.presentToastr((message) ? message : 'Route wurde bearbeitet!');
  }

  removeRoute(route: Route): void {

    this.alertCtrl.create({
      title: 'Bestätige Löschung',
      message: 'Bestätigen Sie die Löschung der Route!',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'Bestätige',
          handler: () => {
            this.routes.splice(this.routes.indexOf(route), 1);
            this.storeRoutes();
            this.presentToastr('Route wurde gelöscht!');
          }
        }
      ]
    }).present();


  }

  addRoute(route: Route): void {
    this.routes.push(route);
    this.dummy = new Route();
    this.storeRoutes();
    // this.presentToastr('Route wurde erfolgreich erstellt!');
  }

  reset(): void {
    this.stop();
    this.routes.forEach((route: Route) => { route.done = false; });
    this.setCurrentIndex(this.findNextTask(-1, true));
  }

  routeIsDone(): void {
    this.currentRoute.done = true;
  }
  stop(): void {
    this.isPlaying = false;
  }
  prev(): void {
    this.stop();
    this.setCurrentIndex(this.findNextTask(this.currentIndex, false));
  }

  next(): void {
    this.stop();
    this.routeIsDone();
    this.setCurrentIndex(this.findNextTask(this.currentIndex, true));
  }

  wantToPlay(index: number) {
    this.isPlaying = false;
    const route = this.routes[index];
    if (route) {
      if (!route.isTask()) {
        route.switchIsTask();
        this.storeRoutes();
      }
      this.setCurrentIndex(index);

      //this.startNaviOnCurrentRoute();
    }
  }
  start(): void {
    if (!this.isPlaying) {
      this.startNaviOnCurrentRoute();
      this.isPlaying = true;
    } else {
      this.stop();
    }
  }

  startNaviOnCurrentRoute(): void {
    this.launchNavigator.navigate(this.currentRoute.address.formattedAddress)
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );
  }
  deleteAllRoutes(): void {
    this.setRoutes([]);
    this.storeRoutes();

    this.presentToastr('Alle Routen wurden gelöscht!');
  }

  presentToastr(_message: string): void {

    this.toastCtrl.create({
      message: _message,
      duration: 3000,
      position: 'top'
    }).present();

  }


}
