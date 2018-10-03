import { Component, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { AlertController, Item, LoadingController, NavController, NavParams, TextInput } from 'ionic-angular';

import { Route } from '../../models/route';
import { RoutesProvider } from '../../providers/routes/routes';

declare var google;
declare var Object;
@Component({
  selector: 'page-route-form',
  templateUrl: 'route-form.html'
})
export class RouteFormPage {
  @ViewChild('sInput') searchInput: TextInput;
  @ViewChild('sMap') map: Item;

  editing: boolean = false;
  showAddressSetting: boolean;
  defaulCoard: any = { lat: 51.163375, lng: 10.447683 };
  currentRoute: Route;
  mapLoad: any;
  mapMarker: any;
  mapCircle: any;
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
    route: 'Straße *',
    street_number: 'Hausnummer',
    postal_code: 'PLZ',
    locality: 'Stadt *',
    country: 'Land'
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private routesProvider: RoutesProvider,
    private geolocation: Geolocation,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {


    if (navParams.data instanceof Route) {
      this.currentRoute = navParams.data;
      this.defaulCoard = this.currentRoute.coards;
      this.editing = true;
    } else {
      this.currentRoute = routesProvider.getDummy();
    }

  }

  ionViewWillEnter() {
    let loading = this.loadingCtrl.create({
      content: 'Einen Moment bitte!'
    });
    loading.present();

    if (this.editing) {
      this.initMapsAndSearch();
      loading.dismiss();

    } else {
      this.geolocation.getCurrentPosition()
        .then((position) => {
          if (position.coords) {
            this.defaulCoard.lat = position.coords.latitude;
            this.defaulCoard.lng = position.coords.longitude;
          }

          this.initMapsAndSearch();
          loading.dismiss();
        }).catch(e => {
          loading.dismiss();
          this.initMapsAndSearch();
          let alert = this.alertCtrl.create({
            title: 'Hinweis',
            subTitle: 'Bitte Zugriff auf Standort erlauben!',
            buttons: ['Ok']
          });
          alert.present();
        });
    }

  }

  initMapsAndSearch(): void {
    let mapDiv = this.map._elementRef.nativeElement;



    this.mapCircle = new google.maps.Circle({
      center: this.defaulCoard,
      radius: 33
    });

    this.mapLoad = new google.maps.Map(mapDiv, {
      center: this.defaulCoard,
      zoom: 16
    });

    this.mapMarker = new google.maps.Marker({
      map: this.mapLoad,
      anchorPoint: new google.maps.Point(0, -29)
    });


    this.mapMarker.setPosition(this.defaulCoard);

    this.showAddressSetting = (this.currentRoute.formattedAddress) ? true : false;

    let searchInputNative = this.searchInput._native.nativeElement;
    let autocomplete = new google.maps.places.Autocomplete(
      searchInputNative,
      {
        types: ['address'],
        componentRestrictions: { country: ['de', 'nl', 'fr', 'be', 'pl', 'ch', 'lu', 'at', 'cz', 'dk'] }
      }
    );
    autocomplete.setBounds(this.mapCircle.getBounds());

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (!place.address_components) return;

      const currentCoards = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };

      this.mapShowCoard(currentCoards);


      this.currentRoute.coards = currentCoards;
      this.currentRoute.formattedAddress = place.formatted_address;
      this.currentRoute.name = place.name;
      this.setAddressSettings(place.address_components);

    });
  }

  mapShowCoard(coards: any): void {
    this.mapMarker.setVisible(false);

    this.mapLoad.setCenter(coards);

    this.mapMarker.setPosition(coards);
    this.mapMarker.setVisible(true);

  }
  resetAddress(): void {
    this.mapShowCoard(this.defaulCoard);
    this.showAddressSetting = false;
  }

  getInfoKeys(): string[] {
    return Object.keys(this.addressInfos);
  }

  clearRouteAddress(): void {
    this.currentRoute.coards = { lat: 0.0, lng: 0.0 };
    for (let key of this.getInfoKeys()) {
      this.currentRoute.address[key] = '';
    }
  }
  onChange(): void {

    console.log(this.currentRoute.formattedAddress);
    if (!this.currentRoute.formattedAddress) {
      this.resetAddress();
    }

    this.currentRoute.formattedAddress = Object.values(this.currentRoute.address).filter(x => x).join(', ');

  }

  setAddressSettings(address: any): void {
    this.clearRouteAddress();
    const mapper: any = {
      route: 'long_name',
      street_number: 'short_name',
      locality: 'long_name',
      country: 'long_name',
      postal_code: 'short_name'
    };

    for (var i = 0; i < address.length; i++) {
      let addressType = address[i].types[0];
      if (mapper[addressType]) {
        this.currentRoute.address[addressType] = address[i][mapper[addressType]];
      }
    }

    this.showAddressSetting = true;
  }

  validateInput(): boolean {
    return (this.showAddressSetting && this.currentRoute.name && this.currentRoute.address.route && this.currentRoute.address.locality)
  }
  storeInput(): void {

    if (this.validateInput()) {
      if (this.editing) {
        this.routesProvider.changeRoute(this.currentRoute);
      } else {
        this.routesProvider.addRoute(this.currentRoute);
      }

      this.navCtrl.pop();

    }



  }

}
