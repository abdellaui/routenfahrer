import { Component, Input, ViewChild } from '@angular/core';
import { List, NavController } from 'ionic-angular';

import { Route } from '../../models/route';
import { RouteFormPage } from '../../pages/route-form/route-form';
import { RoutesProvider } from '../../providers/routes';
import { SettingsProvider } from '../../providers/settings';

@Component({
  selector: 'route-liste',
  templateUrl: 'route-liste.html'
})
export class RouteListeComponent {
  @Input('reorder') canReorder: boolean;

  @ViewChild('listOfRoutes', { read: List }) listView: List;

  constructor(public routesProvider: RoutesProvider, private navCtrl: NavController,
    public settingsProvider: SettingsProvider) {
  }

  edit(item: Route) {
    this.listView.closeSlidingItems();
    this.navCtrl.push(RouteFormPage, item);
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
    this.listView.closeSlidingItems();
    this.routesProvider.wantToPlay(index);
  }



  showEmptyInfo(): boolean {
    if (!this.canReorder && this.settingsProvider.configs.showTaskOnly) {
      return Boolean(this.routesProvider._activeRoutesCount);
    } else {
      return Boolean(this.routesProvider.routes.length);
    }
  }
}


