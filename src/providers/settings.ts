import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Configs } from '../models/Configs';

@Injectable()
export class SettingsProvider {

  configs: Configs = new Configs();

  constructor(private storage: Storage) {
    this.storage.ready().then(() => {
      this.storage.keys().then((result: any) => {
        if (result.indexOf('configs') === -1) {
          this.storeConfigs();
        }
      });

      this.storage.get('configs').then((result: any) => {
        this.configs = Object.assign(this.configs, result);

      });
    });
  }


  toggleShowTaskOnly() {
    this.configs.showTaskOnly != this.configs.showTaskOnly;
    this.storeConfigs();
  }
  storeConfigs(): void {
    this.storage.set('configs', this.configs);
  }


}
