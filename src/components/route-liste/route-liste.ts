import { Component, Input, ViewChild } from '@angular/core';
import { List, NavController } from 'ionic-angular';

import { Route } from '../../models/route';
import { RouteFormPage } from '../../pages/route-form/route-form';
import { RoutesProvider } from '../../providers/routes/routes';

@Component({
  selector: 'route-liste',
  templateUrl: 'route-liste.html'
})
export class RouteListeComponent {
  @Input('reorder') canReorder: boolean;

  @ViewChild('listOfRoutes', { read: List }) listView: List;

  constructor(public routesProvider: RoutesProvider, private navCtrl: NavController) {
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






}
