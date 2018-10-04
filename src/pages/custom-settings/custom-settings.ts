import { Component } from '@angular/core';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { NavController, NavParams, ToastController } from 'ionic-angular';

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
    public toastCtrl: ToastController) {
    console.log(settingsProvider.configs);

    new Promise<string>((resolve) => {
      this.launchNavigator.appSelection.userChoice.get(function (app) {
        resolve(app);
      });
    }).then((result: string) => { this.selectedNavApp = result });

    this.launchNavigator.availableApps().then((result: string[]) => {
      this.aviableNavApp = result.map((el: string) => {
        return new NavigationApp(el, this.launchNavigator.getAppDisplayName(el));
      });
    });
  }

  onSelectNav(): void {
    this.launchNavigator.appSelection.userChoice.set(this.selectedNavApp, () => {
      this.toastCtrl.create({
        message: 'Navigation wurde erfolgreich geändert!',
        duration: 3000,
        position: 'top'
      }).present();
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomSettingsPage');
  }

}
