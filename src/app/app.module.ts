import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Geolocation } from '@ionic-native/geolocation';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { ComponentsModule } from '../components/components.module';
import { CustomSettingsPage } from '../pages/custom-settings/custom-settings';
import { HomePage } from '../pages/home/home';
import { RouteFormPage } from '../pages/route-form/route-form';
import { RoutenMapPage } from '../pages/routen-map/routen-map';
import { TabsPage } from '../pages/tabs/tabs';
import { RoutesProvider } from '../providers/routes';
import { SettingsProvider } from '../providers/settings';
import { MyApp } from './app.component';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    RouteFormPage,
    RoutenMapPage,
    CustomSettingsPage
  ],
  imports: [
    BrowserModule,
    ComponentsModule,
    IonicModule.forRoot(MyApp, { swipeBackEnabled: true }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    RouteFormPage,
    RoutenMapPage,
    CustomSettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    SettingsProvider,
    RoutesProvider,
    /* */
    LaunchNavigator,
    NativeGeocoder
    /* */
    //

    /*
    { provide: LaunchNavigator, useClass: LaunchNavigatorMock },
    { provide: NativeGeocoder, useClass: NativeGeocoderMock },
    */
  ]
})
export class AppModule { }
