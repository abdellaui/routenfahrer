import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { RoutenMapPage } from '../routen-map/routen-map';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {


  tabRouten = HomePage;
  tabRoutenMap = RoutenMapPage;

  constructor() {

  }
}
