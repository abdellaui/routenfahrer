import { Address } from './address';

export class Route {
  public id: number;
  public name: string;
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
    this.id = new Date().getTime();
  };

  dayKeys(): string[] {
    return ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  }

  isTodayTask(): boolean {
    return this.activeDays[this.dayKeys()[(new Date()).getDay()]];
  }

  isTask(): boolean {
    return (this.isTodayTask() && !this.switchedActive) || (!this.isTodayTask() && this.switchedActive);
  }

  switchIsTask() {
    this.switchedActive = !this.switchedActive;
  }
}
