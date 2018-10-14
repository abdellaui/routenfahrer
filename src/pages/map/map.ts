import { Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { GoogleMap, GoogleMaps, ILatLng, Marker } from '@ionic-native/google-maps';
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
      content: 'Einen Moment bitte...'
    });
    this.loading.present();
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
    this.mapMap.clear().then(() => {


      this.mapMap.setCameraTarget(this.locationProvider.coords);

      this.addMeMarker();


      this.routesProvider.routes.forEach((el: Route) => {

        const color = el.canRide() ? 'blue' : el.isTask() ? 'green' : 'black';
        this.mapMap.addMarker({
          title: `${el.name}`,
          snippet: el.address.formattedAddress,
          icon: color,
          position: el.address.coords
        }).catch(e => {
          console.log(JSON.stringify(e));
        });

      });

    }).catch(e => { console.log(JSON.stringify(e)); });

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
    this.mapMap.addMarker({
      title: 'Sie',
      icon: 'red',
      position: this.locationProvider.coords
    }).then((marker: Marker) => {

      this.zone.run(() => {
        this.markMe = marker
      });
    }).catch(e => {
      console.log(JSON.stringify(e));
    });
  }


}
