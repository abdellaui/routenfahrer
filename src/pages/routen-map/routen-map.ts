import { Component, ElementRef, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMap, GoogleMaps, MarkerOptions } from '@ionic-native/google-maps';
import { AlertController, LoadingController, NavController } from 'ionic-angular';

import { Route } from '../../models/route';
import { RoutesProvider } from '../../providers/routes/routes';


@Component({
  selector: 'page-routen-map',
  templateUrl: 'routen-map.html',
})
export class RoutenMapPage {

  @ViewChild('map') map: ElementRef;
  defaulCoard: any = { lat: 51.163375, lng: 10.447683 };
  mapMap: GoogleMap;
  constructor(public navCtrl: NavController,
    private geolocation: Geolocation,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private routesProvider: RoutesProvider) {

  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: 'Einen Moment bitte!'
    });
    loading.present();


    this.geolocation.getCurrentPosition()
      .then((position) => {
        if (position.coords) {
          this.defaulCoard.lat = position.coords.latitude;
          this.defaulCoard.lng = position.coords.longitude;
        }

        this.initMap();
        loading.dismiss();
      }).catch(e => {
        loading.dismiss();
        this.initMap();
        let alert = this.alertCtrl.create({
          title: 'Hinweis',
          subTitle: 'Bitte Zugriff auf Standort erlauben!',
          buttons: ['Ok']
        });
        alert.present();
      });

  }
  ionViewWillEnter() {
    this.mapMap.clear();
    this.mapMap.moveCamera({
      target: this.defaulCoard,
      zoom: 9,
      tilt: 30
    });
    this.routesProvider.routes.forEach((el: Route) => {

      this.addMarker({
        title: `<h3>${el.name}</h3><p>${el.address.formattedAddress}</p>`,
        position: el.address.coards
      });

    });
  }
  initMap() {
    this.mapMap = GoogleMaps.create(this.map.nativeElement);
  }

  addMarker(option: MarkerOptions) {
    return this.mapMap.addMarker(option);
  }

}
