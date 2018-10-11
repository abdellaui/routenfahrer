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



  storeConfigs(): void {
    this.storage.set('configs', this.configs);
  }

  setShowTaskOnly(val: boolean): void {
    if (this.configs.showTaskOnly === val) return;
    this.configs.showTaskOnly = val;
    this.storeConfigs();
  }

  setAutoRun(val: boolean): void {
    if (this.configs.autoRun === val) return;
    this.configs.autoRun = val;
    this.storeConfigs();
  }

  generateNewNextDate(): void {
    const nowDate = new Date();

    /*
     if autorefreshtoday was not affected,
     so set last date to yesterday => today it will be applied
     */
    if (this.getAutoRefreshToday().getTime() > nowDate.getTime()) {
      this.setAutoRefreshLastDate(new Date(nowDate.getTime() - 24 * 60 * 60 * 1000).toString());
    } else {
      this.setAutoRefreshLastDate(nowDate.toString());
    }

  }
  setAutoRefresh(val: boolean): void {
    if (this.configs.autoRefresh === val) return;
    this.configs.autoRefresh = val;
    if (this.configs.autoRefresh) {
      this.generateNewNextDate();
    }
    this.storeConfigs();
  }
  setAutoRefreshHour(val: string): void {
    if (this.configs.autoRefreshHour === val) return;
    this.configs.autoRefreshHour = val;
    this.generateNewNextDate();
    this.storeConfigs();
  }
  setAutoRefreshLastDate(val: string) {
    if (this.configs.autoRefreshHour === val) return;
    this.configs.autoRefreshLastDate = val;
    this.storeConfigs();
  }


  getAutoRefreshToday(): Date {
    const { hour, minute } = this.getAutoRefreshClock();

    const refDay = new Date();
    refDay.setHours(hour, minute, 0);
    return refDay;
  }


  getNextAutoRefreshDate(): string {
    const lastDay = new Date(this.configs.autoRefreshLastDate);
    const nextDay = new Date(lastDay.getTime() + 24 * 60 * 60 * 1000);
    const { hour, minute } = this.getAutoRefreshClock();
    nextDay.setHours(hour, minute, 0);
    const returnText = nextDay.toLocaleString('de-DE');
    return returnText.substr(0, returnText.length - 3);
  }

  getAutoRefreshClock(): { hour: number, minute: number } {
    const currentTime = this.configs.autoRefreshHour.split(':');
    return { hour: Number(currentTime[0]), minute: Number(currentTime[1]) };
  }

  doAutoRefresh(): boolean {
    if (!this.configs.autoRefresh) return false;

    console.log(this.configs.autoRefreshLastDate)

    const lastDay = new Date(this.configs.autoRefreshLastDate);
    const toDay = new Date();

    if (lastDay.toDateString() === toDay.toDateString()) return false;

    if (this.getAutoRefreshToday().getTime() > toDay.getTime()) return false;
    return true;
  }
}
