import { Component } from '@angular/core';
import { Environment } from '@ionic-native/google-maps';
import { SplashScreen } from '@ionic-native/splash-screen';
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
    private splashScreen: SplashScreen,
    private routesProvider: RoutesProvider) {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.



      this.statusBar.styleDefault();
      this.splashScreen.hide();

      Environment.setEnv({
        'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyAKK991AzhbVbZWSrv-52YGlsMaEzlHqpA',
        'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyAKK991AzhbVbZWSrv-52YGlsMaEzlHqpA'
      });

      Environment.setBackgroundColor("#efeff4");
      this.routesProvider.checkChangableRoute();
    });



    this.platform.resume.subscribe(e => {
      this.routesProvider.checkChangableRoute();
    });

  }
}

