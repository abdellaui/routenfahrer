import { Component } from '@angular/core';
import { Environment } from '@ionic-native/google-maps';
import { StatusBar } from '@ionic-native/status-bar';
import { Platform } from 'ionic-angular';

import { TabsPage } from '../pages/tabs/tabs';
import { RoutesProvider } from '../providers/routes';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private routesProvider: RoutesProvider) {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.



      this.statusBar.styleDefault();


      Environment.setEnv({
        'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyAKK991AzhbVbZWSrv-52YGlsMaEzlHqpA',
        'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyAKK991AzhbVbZWSrv-52YGlsMaEzlHqpA'
      });

      if (this.platform.is('ios')) {
        Environment.setBackgroundColor("#efeff4");
      } else {
        Environment.setBackgroundColor("#ffffff");
      }

      this.routesProvider.userEntersApp();
    });



    this.platform.resume.subscribe(e => {
      this.routesProvider.userEntersApp();
    });

  }
}
