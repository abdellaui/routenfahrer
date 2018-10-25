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

  closeSlidingItems(): void {
    if (this.listView)
      this.listView.closeSlidingItems();
  }

  edit(item: Route): void {
    this.closeSlidingItems();
    this.navCtrl.push(RouteFormPage, { route: item });
  }

  onPress(item: Route): void {
    if (this.canReorder) return;

    this.routesProvider.showErinnnerung(item);

  }
  changeStatus(item: Route): void {
    item.switchIsTask();
    this.routesProvider.changeRoute(item);
    this.closeSlidingItems();
  }

  delete(item: Route): void {
    this.routesProvider.removeRoute(item);
    this.closeSlidingItems();
  }

  play(index: number): void {
    this.routesProvider.wantToPlay(index);
    this.closeSlidingItems();
  }

  reorder(event: any): void {
    this.routesProvider.reorderRoutes(event);
  }

  isPlaying(): boolean {
    return this.routesProvider.isPlaying;
  }
  showEmptyInfo(): boolean {
    if (this.dontSlide()) {
      return Boolean(this.routesProvider._activeRoutesCount);
    } else {
      return Boolean(this.getLength());
    }
  }

  dontSlide(): boolean {
    return (!this.canReorder && this.settingsProvider.configs.showTaskOnly);
  }




  getRoutes(): Route[] {
    return this.routesProvider.routes;
  }

  getLength(): number {
    return this.getRoutes().length;
  }

  getIndex(): number {
    return this.routesProvider.currentIndex
  }

  getCurrentRoute(): Route {
    return this.routesProvider.currentRoute;
  }


  getInactiveText(): string {
    const count = this.getInactiveCount();

    if (count === 0)
      return 'Füge einen Ziel zu!';
    else if (count === 1)
      return `${count} inaktives Ziel vorhanden.`;
    else
      return `${count} inaktive Ziele vorhanden.`;

  }
  getInactiveCount(): number {
    return this.routesProvider.getInactiveCount();
  }
}


