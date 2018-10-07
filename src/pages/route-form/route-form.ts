import { Component, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMap, GoogleMaps, Marker } from '@ionic-native/google-maps';
import {
  NativeGeocoder,
  NativeGeocoderForwardResult,
  NativeGeocoderOptions,
  NativeGeocoderReverseResult,
} from '@ionic-native/native-geocoder';
import { AlertController, LoadingController, NavController, NavParams } from 'ionic-angular';

import { Address } from '../../models/Address';
import { Route } from '../../models/Route';
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
  searchInputValue: string;
  lockPossibleAddresses: boolean = false;
  possibleAddresses: Address[];
  editing: boolean = false;
  currentRoute: Route;
  subCoard: any;

  defaultCoard: any = { lat: 51.163375, lng: 10.447683 };
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
    private geolocation: Geolocation,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private nativeGeocoder: NativeGeocoder) {
    console.log(JSON.stringify(navParams.data));
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
    let loading = this.loadingCtrl.create({
      content: 'Einen Moment bitte!'
    });
    loading.present();

    if (this.editing || this.searchInputValue) {
      loading.dismiss();
      this.defaultCoard = this.currentRoute.address.coards;
      this.initMapsAndSearch();

    } else {
      this.geolocation.getCurrentPosition()
        .then((position) => {
          if (position.coords) {
            this.defaultCoard.lat = position.coords.latitude;
            this.defaultCoard.lng = position.coords.longitude;

          }

          loading.dismiss();
          this.initMapsAndSearch();


          this.subCoard = this.geolocation.watchPosition().subscribe((data) => {
            if (data.coords === undefined) return;
            this.defaultCoard.lat = data.coords.latitude;
            this.defaultCoard.lng = data.coords.longitude;


            this.mapShowCoard(this.defaultCoard);
          });



        }).catch(e => {
          loading.dismiss();
          this.initMapsAndSearch();
          this.alertCtrl.create({
            title: 'Hinweis',
            subTitle: 'Bitte Zugriff auf Standort erlauben!',
            buttons: ['Ok']
          }).present();
        });
    }

  }

  private unsubscribeMeMaker() {
    if (this.subCoard) {
      this.subCoard.unsubscribe();
      this.subCoard = null;
    }
  }
  ionViewWillLeave() {
    this.unsubscribeMeMaker();
    this.navCtrl.popToRoot();
  }
  initMapsAndSearch(): void {
    this.mapMap = GoogleMaps.create(this.mapDiv.nativeElement, {
      camera: {
        target: this.defaultCoard,
        zoom: 15,
        tilt: 30,
      }
    });
    this.mapMap.addMarker({
      animation: 'DROP',
      flat: true,
      icon: 'red',
      position: this.defaultCoard
    }).then((marker: Marker) => {

      this.mapMarker = marker;

    }).catch(e => {
      console.log(JSON.stringify(e));
    });

  }

  mapShowCoard(coards: any): void {
    if (!this.mapMap) return;
    this.mapMap.setCameraTarget(coards);
    if (!this.mapMarker) return;
    this.mapMarker.setPosition(coards);


  }
  resetAddress(): void {
    this.mapShowCoard(this.defaultCoard);
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
    console.log('CANCELLED!');
    this.resetAddress();
  }
  onInputSearch() {
    this.currentRoute.address.formattedAddress = this.searchInputValue;
    if (this.checkSearchString()) return;
    if (this.lockPossibleAddresses) return (this.lockPossibleAddresses = false);
    this.lockPossibleAddresses = true;
    this.geocodeAddress()
      .then((result: Address[]) => {
        this.lockPossibleAddresses = false;
        this.possibleAddresses = result;
      }).catch((error: any) => {
        this.lockPossibleAddresses = false;
        console.log(JSON.stringify(error));
      }
      );
  }


  onChangeProps(): void {
    if (this.checkSearchString()) return;
    this.searchInputValue = this.currentRoute.address.formattedAddress;
    this.geocodeAddress()
      .then((result: Address[]) => {

        if (result.length === 1)
          this.mapShowCoard(result[0].coards)


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
                  address.coards = { lat, lng };
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
    this.mapShowCoard(this.currentRoute.address.coards);

  }

  validateInput(): boolean {
    return (this.currentRoute.name && this.currentRoute.address.validateInput());
  }
  storeInput(): void {

    if (this.validateInput()) {

      this.checkSearchString();
      this.geocodeAddress()
        .then((result: Address[]) => {
          this.currentRoute.address = result[0];
          if (this.editing) {
            this.routesProvider.changeRoute(this.currentRoute);
          } else {
            this.routesProvider.addRoute(this.currentRoute);
          }

          this.navCtrl.pop();

        })
        .catch((error: any) => {
          this.alertCtrl.create({
            title: 'Hinweis',
            subTitle: 'Adresse konnte nicht gefunden werden! Geben Sie gültige Adressen ein!',
            buttons: ['Ok']
          }).present();
        });


    }



  }

}
