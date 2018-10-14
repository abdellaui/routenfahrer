import { ErrorHandler } from '@angular/core';
import { Badge } from '@ionic-native/badge';
import { File } from '@ionic-native/file';
import { Geolocation } from '@ionic-native/geolocation';
import { HTTP } from '@ionic-native/http';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { SocialSharing } from '@ionic-native/social-sharing';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicErrorHandler } from 'ionic-angular';

import { LaunchNavigatorMock } from '../models/mocks/LaunchNavigatorMock';
import { NativeGeocoderMock } from '../models/mocks/NativeGeocoderMock';
import { LocationProvider } from '../providers/location';
import { RoutesProvider } from '../providers/routes';
import { SettingsProvider } from '../providers/settings';

export class AppProviders {

  public static getProviders() {

    let providers;
    let needMock = false;
    if (needMock) {

      // Use browser providers
      providers = [
        StatusBar,
        SplashScreen,
        Geolocation,
        SettingsProvider,
        LocationProvider,
        RoutesProvider,
        SocialSharing,
        Badge,
        HTTP,
        File,
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
        LocationProvider,
        RoutesProvider,
        SocialSharing,
        Badge,
        HTTP,
        File,
        { provide: LaunchNavigator, useClass: LaunchNavigator },
        { provide: NativeGeocoder, useClass: NativeGeocoder },
        { provide: ErrorHandler, useClass: IonicErrorHandler },
      ];
    }

    return providers;

  }

}
