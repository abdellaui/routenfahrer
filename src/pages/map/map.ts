import { Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { GoogleMap, GoogleMaps, ILatLng, Marker, MarkerOptions } from '@ionic-native/google-maps';
import { Loading, LoadingController } from 'ionic-angular';
import { first } from 'rxjs/operators';

import { Route } from '../../models/Route';
import { LocationProvider } from '../../providers/location';
import { RoutesProvider } from '../../providers/routes';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage implements OnDestroy {

  @ViewChild('map') map: ElementRef;
  mapMap: GoogleMap;
  markMe: Marker;
  loading: Loading;

  constructor(
    private loadingCtrl: LoadingController,
    private routesProvider: RoutesProvider,
    private locationProvider: LocationProvider,
    private zone: NgZone) {
    this.loading = this.loadingCtrl.create({
      content: 'Einen Moment bitte!'
    });
    this.loading.present();
    this.locationProvider.startTracking('map');
  }

  ionViewDidLoad() {
    this.locationProvider.coordsChange.pipe(first()).subscribe(() => {
      this.initMap();
    });


    this.locationProvider.coordsChange.subscribe((coords: ILatLng) => {
      this.zone.run(() => {
        this.moveMeMarker(coords);
      });
    });
  }

  ionViewWillLeave() {

    this.locationProvider.stopTracking('map');
  }
  ngOnDestroy() {
    if (this.mapMap) {
      this.mapMap.destroy();
      this.mapMap = null;
    }
  }
  ionViewWillEnter() {
    this.locationProvider.startTracking(' map');
    if (!this.mapMap) return;
    this.markMe = null;
    this.mapMap.clear();
    this.mapMap.setCameraTarget(this.locationProvider.coords);

    this.addMeMarker();


    this.routesProvider.routes.forEach((el: Route) => {

      const color = el.canRide() ? 'blue' : el.isTask() ? 'green' : 'black';
      this.addMarker({
        title: `${el.name}`,
        snippet: el.address.formattedAddress,
        icon: color,
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
      icon: 'red',
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
