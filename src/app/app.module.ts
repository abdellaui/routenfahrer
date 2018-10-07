import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicModule } from 'ionic-angular';

import { ComponentsModule } from '../components/components.module';
import { CustomSettingsPage } from '../pages/custom-settings/custom-settings';
import { HomePage } from '../pages/home/home';
import { RouteFormPage } from '../pages/route-form/route-form';
import { RoutenMapPage } from '../pages/routen-map/routen-map';
import { TabsPage } from '../pages/tabs/tabs';
import { MyApp } from './app.component';
import { AppProviders } from './app.providers';

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
  providers: AppProviders.getProviders()
})
export class AppModule {
}
