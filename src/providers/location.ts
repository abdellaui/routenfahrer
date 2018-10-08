import { Injectable, NgZone } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { ILatLng } from '@ionic-native/google-maps';
import { Subject } from 'rxjs';

@Injectable()
export class LocationProvider {

  coordsChange: Subject<ILatLng>;
  coords: ILatLng = { lat: 51.163375, lng: 10.447683 };
  watch: any;
  instances: string[] = [];
  constructor(public zone: NgZone,
    private geolocation: Geolocation) {

    this.coordsChange = new Subject();


  }

  startTracking(channel: string): void {
    if (this.instances.indexOf(channel) !== -1) return;

    this.instances.push(channel);

    if (this.watch) return;
    this.watch = this.geolocation.watchPosition()
      .filter((p: any) => p.coords !== undefined)
      .subscribe((position: Geoposition) => {



        this.zone.run(() => {
          this.coords.lat = position.coords.latitude;
          this.coords.lng = position.coords.longitude;
          this.coordsChange.next(this.coords);
        });

      });


  }

  stopTracking(channel: string): void {
    const index = this.instances.indexOf(channel);
    if (index === -1) return;

    this.instances.splice(index, 1);
    if (this.instances.length === 0 && this.watch) {
      this.watch.unsubscribe();
      this.watch = null;
    }


  }

}
