import { Component } from '@angular/core';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { AlertController, NavController } from 'ionic-angular';

import { NavigationApp } from '../../models/NavigationApp';
import { RoutesProvider } from '../../providers/routes';
import { SettingsProvider } from '../../providers/settings';
import { BedienungshilfePage } from './bedienungshilfe/bedienungshilfe';
import { InformationPage } from './information/information';

@Component({
  selector: 'page-custom-settings',
  templateUrl: 'custom-settings.html',
})

export class CustomSettingsPage {
  selectedNavApp: string;
  aviableNavApp: NavigationApp[] = [];
  constructor(private navCtrl: NavController,
    private launchNavigator: LaunchNavigator,
    private settingsProvider: SettingsProvider,
    private routesProvider: RoutesProvider,
    private alertCtrl: AlertController) {


    this.launchNavigator.availableApps().then((result: string[]) => {
      this.aviableNavApp = [];
      for (let nav in result) {
        if (result[nav]) {
          this.aviableNavApp.push(new NavigationApp(nav, this.launchNavigator.getAppDisplayName(nav)));
        }
      }
    }).catch(e => {
      console.log('#########', e);
    });
  }

  ionViewWillEnter() {
    window['launchnavigator'].appSelection.userChoice.exists((exists) => {
      if (exists) {
        this.getSelectedNavApp();
      } else {
        window['launchnavigator'].appSelection.userPrompted.clear(() => {
          console.log("Clear flag indicating whether user chose to remember their choice of navigator app");
        });
      }
    });
  }
  getSelectedNavApp(): void {
    window['launchnavigator'].appSelection.userChoice.get((app) => { this.setSelectedNavApp(app) });
  }
  setSelectedNavApp(app: string): void {
    if (!app) return;
    this.selectedNavApp = app;
  }

  onSelectNav(navKey: string): void {
    if (this.selectedNavApp === navKey) return;
    this.selectedNavApp = navKey;
    window['launchnavigator'].appSelection.userChoice.set(this.selectedNavApp, () => {
      this.routesProvider.presentToastr('Navigation wurde erfolgreich geändert!');
    });
  }
  turnAllActiveRoutesOff(): void {
    this.alertCtrl.create({
      title: 'Achtung',
      message: 'Sie setzen alle Routen zurück, welche Sie vorher manuell aktiviert oder deaktiviert haben! Dieser Schritt kann  nicht rückgängig gemacht werden!',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.routesProvider.turnAllActiveRoutesOff();
          }
        }
      ]
    }).present();
  }
  deleteAllRoutes(): void {
    this.alertCtrl.create({
      title: 'Achtung',
      message: 'Sie löschen alle Routen! Dieser Schritt kann nicht rückgängig gemacht werden!',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.routesProvider.deleteAllRoutes();
          }
        }
      ]
    }).present();
  }

  openPage(name: string): void {
    if (name === 'Information')
      this.navCtrl.push(InformationPage)
    if (name === 'Bedienungshilfe')
      this.navCtrl.push(BedienungshilfePage)
  }

  getNextAutoRefreshDate(): string {
    return this.settingsProvider.getNextAutoRefreshDate();
  }

  get autoRefreshHour(): string {
    return this.settingsProvider.configs.autoRefreshHour;
  }
  set autoRefreshHour(hour: string) {
    this.settingsProvider.setAutoRefreshHour(hour);
  }

  get autoRun(): boolean {
    return this.settingsProvider.configs.autoRun;
  }
  set autoRun(val: boolean) {
    this.settingsProvider.setAutoRun(val);
  }
  get autoRefresh(): boolean {
    return this.settingsProvider.configs.autoRefresh;
  }
  set autoRefresh(val: boolean) {
    this.settingsProvider.setAutoRefresh(val);
  }
  get showTaskOnly(): boolean {
    return this.settingsProvider.configs.showTaskOnly;
  }
  set showTaskOnly(val: boolean) {
    this.settingsProvider.setShowTaskOnly(val);
  }


}
