export class Address {
  formattedAddress: string;
  thoroughfare: string;
  subThoroughfare: string;
  postalCode: string;
  locality: string;
  countryName: string;

  coards: { lat: number, lng: number }

  constructor() {

  }
  generateFormatedAdress() {

    this.formattedAddress = [
      this.thoroughfare,
      this.subThoroughfare,
      this.postalCode,
      this.locality,
      this.countryName
    ].filter(x => x).join(', ');

  }
  validateInput(): boolean {
    return Boolean(this.thoroughfare && this.locality);
  }


}
