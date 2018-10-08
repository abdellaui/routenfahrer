import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { GoogleMap, GoogleMaps, ILatLng, Marker, MarkerOptions } from '@ionic-native/google-maps';
import { Loading, LoadingController, NavController } from 'ionic-angular';

import { Route } from '../../models/Route';
import { LocationProvider } from '../../providers/location';
import { RoutesProvider } from '../../providers/routes';

@Component({
  selector: 'page-routen-map',
  templateUrl: 'routen-map.html',
})
export class RoutenMapPage {

  @ViewChild('map') map: ElementRef;
  mapMap: GoogleMap;
  markMe: Marker;
  loading: Loading;

  constructor(public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private routesProvider: RoutesProvider,
    private locationProvider: LocationProvider,
    public zone: NgZone) {
    this.loading = this.loadingCtrl.create({
      content: 'Einen Moment bitte!'
    });
    this.loading.present();
    this.locationProvider.startTracking('routen-map');
  }

  ionViewDidLoad() {
    this.locationProvider.coordsChange.first().subscribe(() => {
      this.initMap();
    });


    this.locationProvider.coordsChange.subscribe((coords: ILatLng) => {
      this.zone.run(() => {
        this.moveMeMarker(coords);
      });
    });
  }

  ionViewWillLeave() {

    this.locationProvider.stopTracking('routen-map');
  }

  ionViewWillEnter() {
    this.locationProvider.startTracking('routen-map');
    if (!this.mapMap || this.loading.isOverlay) return;
    this.markMe = null;
    this.mapMap.clear();
    this.mapMap.setCameraTarget(this.locationProvider.coords);

    this.addMeMarker();


    this.routesProvider.routes.forEach((el: Route) => {

      this.addMarker({
        title: `<h3>${el.name}</h3><p>${el.address.formattedAddress}</p>`,
        icon: 'red',
        flat: true,
        position: el.address.coords
      }).catch(e => {
        console.log(JSON.stringify(e));
      });

    });

  }
  initMap() {
    this.mapMap = GoogleMaps.create(this.map.nativeElement,
      {
        camera: {
          target: this.locationProvider.coords,
          zoom: 10,
          tilt: 0,
        }
      });
    this.addMeMarker();
    this.loading.dismiss();
  }

  private moveMeMarker(coords) {
    if (!this.markMe) return;

    this.markMe.setPosition(coords);

  }
  private addMeMarker() {
    this.addMarker({
      title: 'Sie',
      icon: 'blue',
      flat: true,
      position: this.locationProvider.coords
    }).then((marker: Marker) => {

      this.zone.run(() => {
        this.markMe = marker
      });
    }).catch(e => {
      console.log(JSON.stringify(e));
    });
  }

  addMarker(option: MarkerOptions): Promise<Marker> {
    return this.mapMap.addMarker(option);
  }

}
