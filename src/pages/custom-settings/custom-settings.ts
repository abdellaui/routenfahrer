import { Component } from '@angular/core';
import { File, IWriteOptions } from '@ionic-native/file';
import { HTTP } from '@ionic-native/http';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AlertController, LoadingController, NavController } from 'ionic-angular';
import { parse, unparse } from 'papaparse';

import { NavigationApp } from '../../models/NavigationApp';
import { Route } from '../../models/Route';
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
    private socialSharing: SocialSharing,
    private loadingCtrl: LoadingController,
    private file: File,
    private http: HTTP,
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

  importCsv(): void {
    this.alertCtrl.create({
      title: 'Route importieren',
      subTitle: 'Gebe die URL zum .csv Datei.',
      inputs: [
        {
          name: 'url',
          placeholder: 'URL eingeben'
        }
      ],
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Importieren',
          handler: data => {
            if (data.url.length !== 0) {
              this.importFromUrl(data.url);
              return true;
            } else {
              return false;
            }
          }
        }
      ]
    }).present();

  }
  importFromUrl(url: string): void {

    const loading = this.loadingCtrl.create({
      content: 'Einen Moment bitte...'
    });
    loading.present();
    this.http.get(url, null, null)
      .then(data => {
        if (data.status === 200 && data.headers['content-type'] === 'text/csv') {
          this.parseCsv(data.data);
        } else {
          this.alertError('Unerlaubter Format. Bitte geben Sie eine URL zu einer text/csv Datei!');
        }
        loading.dismiss();
      })
      .catch(error => {

        const errorCode = error.status;
        let errorDesc;
        switch (true) {
          case (errorCode < 100):
            errorDesc = 'URL fehlerhaft.';
            break;
          case (errorCode < 200):
            errorDesc = 'URL konnte nicht geladen werden.';
            break;
          case (errorCode < 300):
            errorDesc = 'Unerwarteter Fehler.';
            break;
          case (errorCode < 400):
            errorDesc = 'URL Umleitung fehlgeschlagen.';
            break;
          case (errorCode < 500):
            errorDesc = 'URL Anfrage scheitert.';
            break;
          case (errorCode < 600):
            errorDesc = 'Server Fehler.';
            break;
          default:
            errorDesc = 'Unerwarteter Fehler.';

        }
        this.alertError(errorDesc + ` (#: ${errorCode})`);
        loading.dismiss();

      });

  }
  alertError(error: string): void {
    this.alertCtrl.create({
      title: 'Fehler!',
      subTitle: error,
      buttons: ['OK']
    }).present();
  }
  parseCsv(data: string): void {

    const arrOfObj: any[] = parse(data, {
      header: true
    }).data;

    if (!arrOfObj.length) {
      this.alertError('Die Datei konnte nicht verarbeitet werden!');
      return;
    }
    const arrOfRoute: Route[] = arrOfObj.map((el, index) => {
      const route = Route.fromJsonToInstance(el);
      if (route) {
        return route
      } else {
        this.alertError(`Fehler bei der Zeile ${index + 1}.`);
      }
    });
    if (!arrOfRoute.length) {
      this.alertError('Die Datei konnte nicht verarbeitet werden!');
      return;
    }

    this.alertCtrl.create({
      title: `${arrOfRoute.length} Einträge gefunden!`,
      message: 'Sollen die Einträge Ihre neue Route darstellen oder sollen diese angehangen werden?',
      buttons: [
        {
          text: 'Anhängen',
          role: 'cancel',
          handler: () => {
            this.routesProvider.addRoutes(arrOfRoute);

          }
        },
        {
          text: 'Übernehmen',
          handler: () => {
            this.routesProvider.setRoutes(arrOfRoute);
          }
        }
      ]
    }).present();


  }
  exportCsv(): void {

    const arrayJson: any[] = [];

    this.routesProvider.routes.forEach((el: Route) => {
      arrayJson.push(el.toJsonForCsv());
    });

    const csv = unparse(arrayJson);
    const blob = new Blob([csv], {
      type: 'text/csv'
    });

    const name = 'route.csv';
    const path = this.file.dataDirectory;
    const options: IWriteOptions = { replace: true };


    this.file.writeFile(path, name, blob, options).then(res => {
      this.socialSharing.share(null, null, path + name);
    }, err => {
      console.log('error: ', JSON.stringify(err));
    });
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
