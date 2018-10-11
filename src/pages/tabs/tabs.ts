import { Component } from '@angular/core';

import { RoutesProvider } from '../../providers/routes';
import { CustomSettingsPage } from '../custom-settings/custom-settings';
import { MapPage } from '../map/map';
import { RoutePage } from '../route/route';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {


  tabRoute = RoutePage;
  tabRoutenMap = MapPage;
  tabSettings = CustomSettingsPage;
  constructor(
    private routesProvider: RoutesProvider
  ) {
  }

  getToDriveCount(): number {
    return this.routesProvider.getToDriveCount();
  }
  getRouteCount(): number {
    return this.routesProvider.getCount();
  }
}
