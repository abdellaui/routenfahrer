import { Address } from './Address';

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
    this.id = this.createDate();
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

  getFence(): any {
    return {
      id: this.id,
      latitude: this.address.coards.lat,
      longitude: this.address.coards.lng,
      radius: 100,
      transitionType: 1,
      notification: {
        id: `${this.id}_${this.createDate()}`,
        title: 'Du hast dich dem Ziel genähert!',
        text: `Bist du am ${this.name} angekommen?`,
        openAppOnClick: true
      }
    }
  }
}
