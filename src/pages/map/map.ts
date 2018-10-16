import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { GoogleMap, GoogleMaps, ILatLng, Marker } from '@ionic-native/google-maps';
import { AlertController, Loading, LoadingController } from 'ionic-angular';
import { first } from 'rxjs/operators';

import { Route } from '../../models/Route';
import { LocationProvider } from '../../providers/location';
import { RoutesProvider } from '../../providers/routes';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  @ViewChild('map') map: ElementRef;
  mapMap: GoogleMap;
  markMe: Marker;
  loading: Loading;
  counter: number = 0;
  constructor(
    private loadingCtrl: LoadingController,
    private routesProvider: RoutesProvider,
    private locationProvider: LocationProvider,
    private alertCtrl: AlertController,
    private zone: NgZone) {
    this.loading = this.loadingCtrl.create({
      content: 'Einen Moment bitte...'
    });
    this.loading.present();
    this.locationProvider.startTracking('map');
  }

  ionViewDidLoad() {
    this.locationProvider.coordsChange.pipe(first()).subscribe(() =>
      this.zone.run(() => {
        this.initMap();
      }));


    this.locationProvider.coordsChange.subscribe((coords: ILatLng) => this.zone.run(() => {
      this.moveMeMarker(coords);

    }));
  }

  ionViewWillLeave() {

    this.locationProvider.stopTracking('map');
  }

  ionViewWillEnter() {
    this.locationProvider.startTracking('map');
    this.counter = 0;
    this.waitForMap();
  }

  waitForMap() {
    if (this.mapMap) {
      this.initMarkers();
    } else if (this.counter === 50) {
      this.dismissLoad();
      this.alertCtrl.create({
        title: 'Achtung!',
        subTitle: 'Es ist ein unerwarteter Fehler entstanden!',
        buttons: ['OK']
      }).present();
    } else {
      this.counter++;
      setTimeout(() => {
        this.waitForMap();
      }, 100);
    }
  }

  dismissLoad(): void {
    if (this.loading) {
      this.loading.dismiss();
    }
  }

  initMarkers() {
    this.dismissLoad();

    this.markMe = null;
    this.mapMap.clear().then(() => {

      this.mapMap.setCameraTarget(this.locationProvider.coords);

      this.addMeMarker();

      this.routesProvider.routes.forEach((el: Route) => {

        const colorElse = el.isTask() ? '#33CC33FF' : '#FF9900FF';
        const color = el.canRide() ? '#0066CCFF' : colorElse;
        this.mapMap.addMarker({
          title: `${el.name}`,
          snippet: el.address.formattedAddress,
          icon: color,
          position: el.address.coords
        }).catch(e => {
          console.log('marker', JSON.stringify(e));
        });

      });

    }).catch(e => { console.log('clear', JSON.stringify(e)); });

  }
  initMap(): void {
    this.mapMap = GoogleMaps.create(this.map.nativeElement,
      {
        camera: {
          target: this.locationProvider.coords,
          zoom: 10,
          tilt: 0,
        }
      });

  }

  private moveMeMarker(coords): void {
    if (!this.markMe) return;

    this.markMe.setPosition(coords);

  }
  private addMeMarker(): void {
    this.markMe = this.mapMap.addMarkerSync({
      title: 'Sie',
      icon: '#FF0000',
      position: this.locationProvider.coords
    });
  }


}
