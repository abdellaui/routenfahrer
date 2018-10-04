import { Component, Input } from '@angular/core';

import { Route } from '../../models/Route';

@Component({
  selector: 'route-view',
  templateUrl: 'route-view.html'
})
export class RouteViewComponent {
  @Input() route: Route;
}
