import { Component, ElementRef, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMap, GoogleMaps, ILatLng, Marker, MarkerOptions } from '@ionic-native/google-maps';
import { AlertController, Loading, LoadingController, NavController } from 'ionic-angular';

import { Route } from '../../models/Route';
import { RoutesProvider } from '../../providers/routes';

@Component({
  selector: 'page-routen-map',
  templateUrl: 'routen-map.html',
})
export class RoutenMapPage {

  @ViewChild('map') map: ElementRef;
  defaultCoard: ILatLng = { lat: 51.163375, lng: 10.447683 };
  mapMap: GoogleMap;
  markMe: Marker;
  loading: Loading;
  constructor(public navCtrl: NavController,
    private geolocation: Geolocation,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private routesProvider: RoutesProvider) {
    this.loading = this.loadingCtrl.create({
      content: 'Einen Moment bitte!'
    });
    this.loading.present();
  }

  ionViewDidLoad() {


    this.geolocation.getCurrentPosition()
      .then((position) => {
        if (position.coords) {
          this.defaultCoard.lat = position.coords.latitude;
          this.defaultCoard.lng = position.coords.longitude;
        }

        this.initMap();
        this.loading.dismiss();
        this.geolocation.watchPosition()
          .subscribe((data) => {
            if (data.coords === undefined) return;
            this.defaultCoard.lat = data.coords.latitude;
            this.defaultCoard.lng = data.coords.longitude;
            this.moveMeMarker(this.defaultCoard);

          });
      }).catch(e => {
        console.log(JSON.stringify(e));
        this.loading.dismiss();
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
    if (!this.mapMap) return;
    this.mapMap.clear();
    this.mapMap.setCameraTarget(this.defaultCoard);


    this.addMeMarker();


    this.routesProvider.routes.forEach((el: Route) => {

      this.addMarker({
        title: `<h3>${el.name}</h3><p>${el.address.formattedAddress}</p>`,
        icon: 'red',
        flat: true,
        position: el.address.coards
      }).catch(e => {
        console.log(JSON.stringify(e));
      });

    });

  }
  initMap() {
    this.mapMap = GoogleMaps.create(this.map.nativeElement,
      {
        camera: {
          target: this.defaultCoard,
          zoom: 10,
          tilt: 0,
        }
      });
    this.addMeMarker();
  }

  private moveMeMarker(coards) {
    if (!this.markMe) return;

    this.markMe.setPosition(this.defaultCoard);

  }
  private addMeMarker() {
    this.addMarker({
      title: 'Sie',
      icon: 'blue',
      flat: true,
      position: this.defaultCoard
    }).then((marker: Marker) => {
      this.markMe = marker
    }).catch(e => {
      console.log(JSON.stringify(e));
    });
  }

  addMarker(option: MarkerOptions): Promise<Marker> {
    return this.mapMap.addMarker(option);
  }

}
