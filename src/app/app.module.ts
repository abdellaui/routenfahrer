import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicModule } from 'ionic-angular';

import { CustomSettingsPageModule } from '../pages/custom-settings/custom-settings.module';
import { MapPageModule } from '../pages/map/map.module';
import { RoutePageModule } from '../pages/route/route.module';
import { TabsPage } from '../pages/tabs/tabs';
import { MyApp } from './app.component';
import { AppProviders } from './app.providers';

@NgModule({
  declarations: [
    MyApp,
    TabsPage
  ],
  imports: [
    BrowserModule,
    MapPageModule,
    RoutePageModule,
    CustomSettingsPageModule,
    IonicModule.forRoot(MyApp,
      {
        backButtonText: 'Zurück',
        tabsHideOnSubPages: true,
        swipeBackEnabled: true
      }
    ),
    IonicStorageModule.forRoot({
      name: '__routeplaner',
      driverOrder: ['sqlite', 'websql', 'indexeddb']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage
  ],
  providers: AppProviders.getProviders()
})
export class AppModule {
}
