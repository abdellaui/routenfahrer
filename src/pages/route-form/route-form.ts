import { Component, NgZone, ViewChild } from '@angular/core';
import { GoogleMap, GoogleMaps, ILatLng, Marker } from '@ionic-native/google-maps';
import {
  NativeGeocoder,
  NativeGeocoderForwardResult,
  NativeGeocoderOptions,
  NativeGeocoderReverseResult,
} from '@ionic-native/native-geocoder';
import { AlertController, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

import { Address } from '../../models/Address';
import { Route } from '../../models/Route';
import { LocationProvider } from '../../providers/location';
import { RoutesProvider } from '../../providers/routes';

declare var Object;

@Component({
  selector: 'page-route-form',
  templateUrl: 'route-form.html'
})
export class RouteFormPage {
  @ViewChild('sMap') mapDiv: any;
  mapMap: GoogleMap
  mapMarker: Marker;
  subCoords: Subscription;

  searchInputValue: string;
  lockPossibleAddresses: boolean = false;
  possibleAddresses: Address[];

  editing: boolean = false;
  currentRoute: Route;

  loading: Loading;

  currentCoords: ILatLng;

  geoOptions: NativeGeocoderOptions = {
    useLocale: true,
    defaultLocale: 'de_DE',
    maxResults: 5
  }

  readonly dayFullname: any = {
    Mo: 'Montag',
    Di: 'Dienstag',
    Mi: 'Mittwoch',
    Do: 'Donnerstag',
    Fr: 'Freitag',
    Sa: 'Samstag',
    So: 'Sonntag'
  }

  readonly addressInfos: any = {
    thoroughfare: 'Straße *',
    subThoroughfare: 'Hausnummer',
    postalCode: 'PLZ',
    locality: 'Stadt *',
    countryName: 'Land'
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private routesProvider: RoutesProvider,
    private locationProvider: LocationProvider,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private nativeGeocoder: NativeGeocoder,
    public zone: NgZone) {
    this.locationProvider.startTracking('route-form');
    const paramRoute = navParams.get('route');
    if (paramRoute instanceof Route) {
      this.currentRoute = paramRoute;
      this.editing = true;
    } else {
      this.currentRoute = routesProvider.getDummy();

    }

    this.searchInputValue = this.currentRoute.address.formattedAddress;
  }

  ionViewWillEnter() {
    this.loading = this.loadingCtrl.create({
      content: 'Einen Moment bitte!'
    });
    this.loading.present();

    if (this.editing || this.searchInputValue) {

      this.currentCoords = this.currentRoute.address.coords;

    } else {
      this.currentCoords = this.locationProvider.coords;

      this.subCoords = this.locationProvider.coordsChange.subscribe((coords: ILatLng) => {
        this.mapShowCoard(coords);
      });
    }
    this.initMap();

  }

  private unsubscribeMeMaker() {
    if (this.subCoords) {
      this.subCoords.unsubscribe();
      this.subCoords = null;
    }
  }


  ionViewWillLeave() {
    this.unsubscribeMeMaker();
    this.locationProvider.stopTracking('route-form');
    this.navCtrl.popToRoot();
  }

  initMap(): void {
    this.mapMap = GoogleMaps.create(this.mapDiv.nativeElement, {
      camera: {
        target: this.currentCoords,
        zoom: 15,
        tilt: 30,
      }
    });
    this.mapMap.addMarker({
      animation: 'DROP',
      flat: true,
      icon: 'red',
      position: this.currentCoords
    }).then((marker: Marker) => {
      this.zone.run(() => {
        this.mapMarker = marker;
      });

    }).catch(e => {
      console.log(JSON.stringify(e));
    });


    this.loading.dismiss();

  }

  mapShowCoard(coords: any): void {
    if (!this.mapMap) return;
    this.mapMap.setCameraTarget(coords);
    if (!this.mapMarker) return;
    this.mapMarker.setPosition(coords);


  }
  resetAddress(): void {
    this.mapShowCoard(this.locationProvider.coords);
    this.currentRoute.address = new Address();
  }

  getInfoKeys(): string[] {
    return Object.keys(this.addressInfos);
  }

  clearRouteAddress(): void {
    this.currentRoute.address = new Address();
  }

  checkSearchString(): boolean {
    this.unsubscribeMeMaker();
    if (!this.searchInputValue) {
      this.lockPossibleAddresses = false;
      return true;
    } else {
      this.currentRoute.address.generateFormatedAdress();
      return false;
    }

  }
  onCancel(event) {
    this.resetAddress();
  }
  onInputSearch() {
    this.currentRoute.address.formattedAddress = this.searchInputValue;
    if (this.checkSearchString()) return;
    if (this.lockPossibleAddresses) return (this.lockPossibleAddresses = false);
    this.lockPossibleAddresses = true;
    this.geocodeAddress()
      .then((result: Address[]) => {
        this.zone.run(() => {
          this.lockPossibleAddresses = false;
          this.possibleAddresses = result;
        });
      }).catch((error: any) => {
        this.zone.run(() => {
          this.lockPossibleAddresses = false;
        });
        console.log(JSON.stringify(error));
      }
      );
  }

  onPropsFocusOut(event): void {


    if (this.checkSearchString()) return;
    this.searchInputValue = this.currentRoute.address.formattedAddress;
    this.geocodeAddress()
      .then((result: Address[]) => {

        if (result.length === 1) {
          this.zone.run(() => {
            this.mapShowCoard(result[0].coords)
          });
        }


      })
      .catch((error: any) => {
        console.log(JSON.stringify(error))
      });
  }

  geocodeAddress(): Promise<Address[]> {
    return new Promise((resolve, reject) => {


      this.nativeGeocoder.forwardGeocode(this.searchInputValue, this.geoOptions)
        .then((coordinates: NativeGeocoderForwardResult[]) => {

          /*console.log(JSON.stringify({
            'COARDS:': coordinates.length,
            '_': coordinates
          }));*/
          coordinates.forEach((coard: NativeGeocoderForwardResult) => {

            const lat = Number(coard.latitude);
            const lng = Number(coard.longitude);
            this.nativeGeocoder.reverseGeocode(lat, lng, this.geoOptions)
              .then((result: NativeGeocoderReverseResult[]) => {
                /*console.log(JSON.stringify({
                  'RESULT:': result.length,
                  '_': result
                }));*/
                resolve(result.map((item: NativeGeocoderReverseResult) => {
                  const address: Address = Object.assign(new Address(), item);
                  address.coords = { lat, lng };
                  address.generateFormatedAdress();
                  return address;
                }));
              }).catch((error: any) => { reject(error) });

          });
        }).catch((error: any) => reject(error));
    });

  }

  addressSelected(address: Address) {
    this.possibleAddresses = null;
    this.setAddressSettings(address);
  }

  setAddressSettings(address: Address): void {
    this.searchInputValue = address.formattedAddress;
    this.currentRoute.address = address;
    if (!this.currentRoute.name)
      this.currentRoute.name = this.currentRoute.address.thoroughfare;
    this.mapShowCoard(this.currentRoute.address.coords);

  }

  validateInput(): boolean {
    return (this.currentRoute.name && this.currentRoute.address.validateInput());
  }
  storeInput(): void {

    if (this.validateInput()) {

      this.checkSearchString();
      this.geocodeAddress()
        .then((result: Address[]) => {
          this.zone.run(() => {
            this.currentRoute.address = result[0];
            if (this.editing) {
              this.routesProvider.changeRoute(this.currentRoute);
            } else {
              this.routesProvider.addRoute(this.currentRoute);
            }

            this.navCtrl.pop();
          });
        })
        .catch((error: any) => {
          console.log(JSON.stringify(error));
          this.zone.run(() => {
            this.alertCtrl.create({
              title: 'Hinweis',
              subTitle: 'Adresse konnte nicht gefunden werden! Geben Sie gültige Adressen ein!',
              buttons: ['Ok']
            }).present();
          });
        });


    }



  }

}
