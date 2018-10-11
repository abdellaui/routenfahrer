import { ILatLng } from '@ionic-native/google-maps';

export class Address {
  formattedAddress: string;
  thoroughfare: string;
  subThoroughfare: string;
  postalCode: string;
  locality: string;
  countryName: string;

  coords: ILatLng

  constructor() {
  }
  generateFormatedAdress() {

    let address = this.thoroughfare;
    if (this.subThoroughfare)
      address += ` ${this.subThoroughfare}`;

    if (address)
      address += `,\n`;

    if (this.postalCode)
      address += ` ${this.postalCode}`;

    if (this.locality)
      address += ` ${this.locality}`;
    if (address) {
      address += ', \n';
    }
    if (this.countryName)
      address += this.countryName;


    this.formattedAddress = address;
  }
  validateInput(): boolean {
    return Boolean(this.thoroughfare && this.locality);
  }


}
