import { Injectable } from '@angular/core';
import { Badge } from '@ionic-native/badge';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { ActionSheet, ActionSheetController, AlertController, ToastController } from 'ionic-angular';
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
  _canRideRoutesCount: number = 0;
  isActionSheetOpen: boolean = false;
  constructor(
    private storage: Storage,
    private toastCtrl: ToastController,
    private launchNavigator: LaunchNavigator,
    private alertCtrl: AlertController,
    private settingsProvider: SettingsProvider,
    private actionSheetCtrl: ActionSheetController,
    private toastrCtrl: ToastController,
    private splashScreen: SplashScreen,
    private badge: Badge) {

    this.storage.ready().then(() => {
      this.storage.get('routes').then((result: Route[]) => {
        if (!result) return;
        const instances = result.map(item => {
          const route = Object.assign(new Route(), item);
          route.address = Object.assign(new Address(), item.address);
          return route;
        });
        this._setRoutes(instances);
        this.setCurrentIndex(this.settingsProvider.configs.currentIndex);
        this.setIsPlaying(this.settingsProvider.configs.isPlaying);
        this.setIsActionSheetOpen(this.settingsProvider.configs.isActionSheetOpen);
        this.autoRefreshProcedure();
        this._hideSplash();

      }).catch((e: Error) => {
        this._hideSplash();
        console.log('storage', JSON.stringify(e));
      });
    });

  }
  private _hideSplash(): void {
    setTimeout(() => { this.splashScreen.hide(); }, 300);
  }

  setRoutes(routes: Route[]): void {
    this.currentIndex = 0;
    this.routes = routes;
    this.storeRoutes();
  }
  private _setRoutes(routes: Route[]): void {
    this.routes = routes;
    this.refreshStatRoutesCount();
  }
  private setIsPlaying(playing: boolean): void {
    this.isPlaying = playing;
    this.settingsProvider.configs.isPlaying = this.isPlaying;
    this.settingsProvider.storeConfigs();
  }
  private setIsActionSheetOpen(action: boolean): void {
    this.isActionSheetOpen = action;
    this.settingsProvider.configs.isActionSheetOpen = this.isActionSheetOpen;
    this.settingsProvider.storeConfigs();
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

  private refreshStatRoutesCount(): void {
    const tasks = this.routes.filter((item: Route) => { return item.isTask() });
    const rides = tasks.filter((item: Route) => { return item.canRide() });
    this._activeRoutesCount = tasks.length;
    this._canRideRoutesCount = rides.length;
    this.badge.set(this._canRideRoutesCount);
  }

  private storeRoutes(): void {
    this.refreshStatRoutesCount();
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

    if (this._canRideRoutesCount === 0) return 0;

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

  changeRoute(route: Route): void {
    let searchingIndex = this.routes.indexOf(route);
    if (searchingIndex === -1) return;
    this.routes[searchingIndex] = route;

    this.storeRoutes();
  }

  removeRoute(route: Route): void {

    this.alertCtrl.create({
      title: 'Bestätige Löschung',
      message: 'Bestätigen Sie die Löschung des Zieles!',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'Bestätigen',
          handler: () => {
            const index = this.routes.indexOf(route);
            if (index === -1) return;
            if (index < this.currentIndex) {
              this.setCurrentIndex(this.currentIndex - 1);
            }
            this.routes.splice(this.routes.indexOf(route), 1);
            this.storeRoutes();
          }
        }
      ]
    }).present();

  }

  addRoutes(routes: Route[]) {
    routes.forEach(route => {
      this.routes.push(route);
    });
    this.storeRoutes();
  }
  addRoute(route: Route): void {
    this.routes.push(route);
    this.dummy = new Route();
    this.storeRoutes();

  }

  reset(): void {
    this.setIsActionSheetOpen(false);
    this.stop();
    this.routes.forEach((route: Route) => {
      route.done = false;
      route.switchedActive = false;
    });
    this.storeRoutes();
    this.setCurrentIndex(this.findNextTask(-1, true));
  }

  routeIsDone(): void {
    this.currentRoute.done = true;
    this.storeRoutes();
  }
  askCurrentRouteSolved(): ActionSheet {
    return this.actionSheetCtrl.create({
      title: `${this.currentRoute.name}\n${this.currentRoute.address.formattedAddress}`,
      subTitle: this.currentRoute.erinnerung,
      enableBackdropDismiss: false,
      buttons: [ // TODO: barcode scanner for retoures etc
        {
          icon: 'checkmark',
          text: 'Erledigt',
          handler: () => {

            this.routeIsDone();
            this.stop();
            this.autoStart();

          }
        },
        {
          icon: 'close',
          text: 'Ziel abbrechen',
          role: 'destructive',
          handler: () => {

            this.stop();

          }
        },
        {
          text: 'Ziel wird noch gefahren',
          role: 'cancel',
          handler: () => {
          }
        },
      ]
    });
  }
  stop(): void {
    this.setIsPlaying(false);
  }

  checkChangableRoute(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.isPlaying && !this.isActionSheetOpen) {
        const actionSheet = this.askCurrentRouteSolved();
        actionSheet.present();
        this.setIsActionSheetOpen(true);
        actionSheet.onDidDismiss(() => {
          this.setIsActionSheetOpen(false);
          if (!this.isPlaying)
            resolve(true);

        });
      } else {
        resolve(false);
      }
    });
  }

  prev(): void {
    this.checkChangableRoute().then(() => {
      this.setCurrentIndex(this.findNextTask(this.currentIndex, false));
    });
  }

  next(): void {
    this.checkChangableRoute().then(() => {
      this.setCurrentIndex(this.findNextTask(this.currentIndex, true));
    });
  }

  wantToPlay(index: number) {

    const route = this.routes[index];
    if (!route) {
      return;
    }

    if (route === this.currentRoute) {
      this.start();
    } else {
      this.checkChangableRoute().then(() => {


        route.switchedActive = !route.isTodayTask();
        route.done = false;
        this.storeRoutes();
        this.setCurrentIndex(index);
        this.autoStart();


      });
    }
  }
  autoStart(): void {
    if (this.settingsProvider.configs.autoRun)
      this.startNaviOnCurrentRoute();
  }
  start(): void {

    this.startNaviOnCurrentRoute();

  }

  startNaviOnCurrentRoute(): void {
    if (!this.currentRoute) return;
    this.launchNavigator.navigate(this.currentRoute.address.formattedAddress);
    this.setIsPlaying(true);
  }

  deleteAllRoutes(): void {


    this.setRoutes([]);
    this.reset();
    this.storeRoutes();

    this.presentToastr('Alle Ziele wurden gelöscht!');

  }

  turnAllActiveRoutesOff(): void {
    this.checkChangableRoute().then(() => {

      this.routes.forEach((route: Route) => {
        route.switchedActive = false;
      });
      this.storeRoutes();

      this.presentToastr('Alle Ziele wurden zurückgesetzt!');
    });
  }

  presentToastr(_message: string): void {

    this.toastCtrl.create({
      message: _message,
      duration: 3000,
      position: 'top'
    }).present();

  }

  autoRefreshProcedure(): void {

    if (this.settingsProvider.doAutoRefresh()) {
      this.reset();
      this.settingsProvider.setAutoRefreshLastDate(new Date().toString());
    }
  }


  getInactiveCount(): number {
    return this.getCount() - this._activeRoutesCount;
  }

  getToDriveCount(): number {
    return this._canRideRoutesCount;
  }

  showErinnnerung(item: Route): void {
    this.toastrCtrl.create({
      message: `${item.name}\n${item.address.formattedAddress}\nErinnerung:\n${item.erinnerung ? item.erinnerung : 'keine.'}`,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'Ok',
      dismissOnPageChange: true
    }).present();
  }
}
