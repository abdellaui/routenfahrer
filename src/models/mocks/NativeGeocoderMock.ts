import {
  NativeGeocoder,
  NativeGeocoderForwardResult,
  NativeGeocoderOptions,
  NativeGeocoderReverseResult,
} from '@ionic-native/native-geocoder';

class NativeGeocoderReverseResultE implements NativeGeocoderReverseResult {
  countryCode: string = 'countryCode';
  countryName: string = 'countryName';
  postalCode: string = 'postalCode';
  administrativeArea: string = 'administrativeArea';
  subAdministrativeArea: string = 'subAdministrativeArea';
  locality: string = 'locality';
  subLocality: string = 'subLocality';
  thoroughfare: string = 'thoroughfare';
  subThoroughfare: string = 'subThoroughfare';
};

export class NativeGeocoderMock extends NativeGeocoder {
  reverseGeocode(latitude: number, longitude: number, options?: NativeGeocoderOptions): Promise<NativeGeocoderReverseResult[]> {

    return new Promise((resolve, reject) => {
      resolve([new NativeGeocoderReverseResultE(),
      new NativeGeocoderReverseResultE(),
      new NativeGeocoderReverseResultE(),
      new NativeGeocoderReverseResultE(),
      new NativeGeocoderReverseResultE()]);
    });
  }

  forwardGeocode(addressString: string, options?: NativeGeocoderOptions): Promise<NativeGeocoderForwardResult[]> {
    return new Promise((resolve, reject) => {
      resolve([{ latitude: "51.163375", longitude: "10.447683" },
      { latitude: "51.163375", longitude: "10.447683" },
      { latitude: "51.163375", longitude: "10.447683" },
      { latitude: "51.163375", longitude: "10.447683" },
      { latitude: "51.163375", longitude: "10.447683" }]);
    });
  }
}
