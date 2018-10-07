import { ErrorHandler } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicErrorHandler } from 'ionic-angular';

import { LaunchNavigatorMock } from '../models/mocks/LaunchNavigatorMock';
import { NativeGeocoderMock } from '../models/mocks/NativeGeocoderMock';
import { RoutesProvider } from '../providers/routes';
import { SettingsProvider } from '../providers/settings';

export class AppProviders {

  public static getProviders() {

    let providers;
    let needMock = true;
    if (needMock) {

      // Use browser providers
      providers = [
        StatusBar,
        SplashScreen,
        Geolocation,
        SettingsProvider,
        RoutesProvider,
        { provide: LaunchNavigator, useClass: LaunchNavigatorMock },
        { provide: NativeGeocoder, useClass: NativeGeocoderMock },
        { provide: ErrorHandler, useClass: IonicErrorHandler },
      ];

    } else {

      // Use device providers
      providers = [
        StatusBar,
        SplashScreen,
        Geolocation,
        SettingsProvider,
        RoutesProvider,
        { provide: LaunchNavigator, useClass: LaunchNavigator },
        { provide: NativeGeocoder, useClass: NativeGeocoder },
        { provide: ErrorHandler, useClass: IonicErrorHandler },
      ];
    }

    return providers;

  }

}
