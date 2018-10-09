import { Component, Input, ViewChild } from '@angular/core';
import { List, NavController } from 'ionic-angular';

import { Route } from '../../../../models/route';
import { RoutesProvider } from '../../../../providers/routes';
import { SettingsProvider } from '../../../../providers/settings';
import { RouteFormPage } from '../../route-form/route-form';

@Component({
  selector: 'route-liste',
  templateUrl: 'route-liste.html'
})
export class RouteListeComponent {
  @Input('reorder') canReorder: boolean;

  @ViewChild('listOfRoutes', { read: List }) listView: List;

  constructor(private routesProvider: RoutesProvider,
    private settingsProvider: SettingsProvider,
    private navCtrl: NavController) {
  }

  edit(item: Route) {
    this.listView.closeSlidingItems();
    this.navCtrl.push(RouteFormPage, { route: item });
  }


  changeStatus(item: Route) {
    item.switchIsTask();
    this.routesProvider.changeRoute(item, item.isTask() ? 'Route wurde aktiviert!' : 'Route wurde deaktiviert!');
    this.listView.closeSlidingItems();
  }

  delete(item: Route) {
    this.listView.closeSlidingItems();
    this.routesProvider.removeRoute(item);
  }

  play(index: number) {
    this.routesProvider.wantToPlay(index);
    this.listView.closeSlidingItems();
  }



  showEmptyInfo(): boolean {
    if (!this.canReorder && this.settingsProvider.configs.showTaskOnly) {
      return Boolean(this.routesProvider._activeRoutesCount);
    } else {
      return Boolean(this.routesProvider.routes.length);
    }
  }
}


