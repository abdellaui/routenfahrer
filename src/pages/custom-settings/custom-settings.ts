import { Component } from '@angular/core';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { AlertController, NavController, NavParams } from 'ionic-angular';

import { NavigationApp } from '../../models/NavigationApp';
import { RoutesProvider } from '../../providers/routes';
import { SettingsProvider } from '../../providers/settings';


@Component({
  selector: 'page-custom-settings',
  templateUrl: 'custom-settings.html',
})

export class CustomSettingsPage {
  selectedNavApp: string;
  aviableNavApp: NavigationApp[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public launchNavigator: LaunchNavigator,
    public settingsProvider: SettingsProvider,
    public routesProvider: RoutesProvider,
    public alertCtrl: AlertController) {


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
      message: 'Sie setzen alle Routen wieder zurück, welche Sie vorher manuell aktiviert oder deaktiviert haben! Dieser Schritt kann  nicht rückgängig gemacht werden!',
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
      message: 'Sie löschen alle Routen! Dieser Schritt kann  nicht rückgängig gemacht werden!',
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


}
