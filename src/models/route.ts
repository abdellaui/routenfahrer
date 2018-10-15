import { ILatLng } from '@ionic-native/google-maps';

import { Address } from './Address';

export class Route {
  static countInstance = 0;
  public id: number;
  public name: string;
  public erinnerung: string;
  public done: boolean = false;
  public switchedActive: boolean = false;

  public activeDays: any = {
    Mo: false,
    Di: false,
    Mi: false,
    Do: false,
    Fr: false,
    Sa: false,
    So: false
  }


  public address: Address;


  constructor(parent?: Address) {
    this.address = (parent) ? parent : new Address();
    this.id = this.createDate() + Route.countInstance;
    Route.countInstance++;
  };

  createDate(): number {
    return new Date().getTime();
  }
  dayKeys(): string[] {
    return Object.keys(this.activeDays);
  }

  getWeekDay(): number {
    return (new Date().getDay() + 6) % 7;
  }
  isTodayTask(): boolean {
    return this.activeDays[this.dayKeys()[this.getWeekDay()]];
  }

  canRide(): boolean {
    return !this.done && this.isTask();
  }

  isTask(): boolean {
    return (this.isTodayTask() && !this.switchedActive) || (!this.isTodayTask() && this.switchedActive);
  }

  switchIsTask(): void {
    this.switchedActive = !this.switchedActive;
  }


  toJsonForCsv(): any {
    return {
      _Name: this.name,
      Erinnerung: this.erinnerung,
      _Strasse: this.address.thoroughfare,
      Hausnummer: this.address.subThoroughfare,
      PLZ: this.address.postalCode,
      _Stadt: this.address.locality,
      Land: this.address.countryName,
      _Kooardinaten_Lat: this.address.coords.lat,
      _Kooardinaten_Lng: this.address.coords.lng,
      StatusSchalter: this.switchedActive,
      ...this.activeDays
    }
  }
  static fromJsonToInstance(json: any): Route | undefined {
    try {
      const route = new Route();
      route.name = json._Name;
      route.erinnerung = json.Erinnerung;
      route.switchedActive = json.StatusSchalter === 'true';
      route.activeDays.Mo = json.Mo === 'true';
      route.activeDays.Di = json.Di === 'true';
      route.activeDays.Mi = json.Mi === 'true';
      route.activeDays.Do = json.Do === 'true';
      route.activeDays.Fr = json.Fr === 'true';
      route.activeDays.Sa = json.Sa === 'true';
      route.activeDays.So = json.So === 'true';

      const address = new Address();
      address.thoroughfare = json._Strasse;
      address.subThoroughfare = json.Hausnummer;
      address.postalCode = json.PLZ;
      address.locality = json._Stadt;
      address.countryName = json.Land;
      address.coords = <ILatLng>{
        lat: Number(json._Kooardinaten_Lat),
        lng: Number(json._Kooardinaten_Lng),
      };
      address.generateFormatedAdress();
      route.address = address;
      if (route.name && address.validateInput()) {

        return route;
      } else {
        throw Error('wrong format');
      }
    } catch (e) {
      return undefined;
    }
  }
}
