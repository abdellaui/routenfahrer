import { Injectable, NgZone } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { ILatLng } from '@ionic-native/google-maps';
import { AlertController, Platform } from 'ionic-angular';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable()
export class LocationProvider {

  coordsChange: Subject<ILatLng>;
  coords: ILatLng = { lat: 51.163375, lng: 10.447683 };
  watch: any;

  option: any = { timeout: 30000 };
  instances: string[] = [];
  constructor(
    private zone: NgZone,
    private geolocation: Geolocation,
    private platform: Platform,
    private alertCtrl: AlertController) {

    this.coordsChange = new Subject();

    this.platform.ready().then(() => {


      this.geolocation.getCurrentPosition(this.option)
        .then((position: Geoposition) => {
          this.zone.run(() => {
            this.coords.lat = position.coords.latitude;
            this.coords.lng = position.coords.longitude;
            this.coordsChange.next(this.coords);
          });
        }).catch(e => {
          console.log('premission', JSON.stringify(e));

          this.zone.run(() => {
            this.coordsChange.next(this.coords);
          });


          if (Object.keys(e).length === 0) {
            return;
          }

          if (e && !e.message) {
            return;
          }

          this.alertCtrl.create({
            title: 'Achtung!',
            subTitle: 'Erlauben Sie den Zugriff auf Ihren Standort!',
            buttons: ['OK']
          }).present();


        });

    });

  }

  startTracking(channel: string): void {

    this.coordsChange.next(this.coords);

    if (this.instances.indexOf(channel) !== -1) return;

    this.instances.push(channel);

    if (this.watch) return;

    this.watch = this.geolocation.watchPosition(this.option)
      .pipe(filter((p: any) => p.coords !== undefined))
      .subscribe((position: Geoposition) => {



        this.zone.run(() => {
          this.coords.lat = position.coords.latitude;
          this.coords.lng = position.coords.longitude;
          this.coordsChange.next(this.coords);
        });

      }, err => {
        console.log('subw', JSON.stringify(err));
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
