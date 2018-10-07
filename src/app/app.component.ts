import { Component } from '@angular/core';
import { Environment } from '@ionic-native/google-maps';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Platform } from 'ionic-angular';

import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.




      Environment.setEnv({
        'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyAKK991AzhbVbZWSrv-52YGlsMaEzlHqpA',
        'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyAKK991AzhbVbZWSrv-52YGlsMaEzlHqpA'
      });

      Environment.setBackgroundColor("#efeff4");

      statusBar.styleDefault();
      splashScreen.hide();


    });
  }
}

