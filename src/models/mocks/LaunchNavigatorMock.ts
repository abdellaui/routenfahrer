import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';


export class UserChoiceMock {

  exists: (callback: (exists: boolean) => void) => void;
  clear: (callback: () => void) => void;

  get(cb: Function) { cb('launchnavigator.APP.GOOGLE_MAPS') }

  set(app: string, cb: Function) {
    cb();
  }
}
export class AppSelectionMock {
  userChoice: UserChoiceMock = new UserChoiceMock();
  userPrompted: any;
}

export class LaunchNavigatorMock extends LaunchNavigator {

  navigate(destination: string | number[], options?: LaunchNavigatorOptions): Promise<any> {
    return new Promise((res, rej) => { console.log('LaunchNavigatorMock::navigate:', destination); res(); });
  }

  isAppAvailable(app: string): Promise<any> {
    return new Promise((res, rej) => { console.log('LaunchNavigatorMock::isAppAvailable:', app); res(); });
  };

  availableApps(): Promise<string[]> {
    return new Promise((res, rej) => {
      console.log('LaunchNavigatorMock::availableApps:');
      res([
        'launchnavigator.APP.GOOGLE_MAPS',
        'launchnavigator.APP.WAZE',
        'launchnavigator.APP.CITYMAPPER']);
    });
  }

  getAppDisplayName(app: string): string {
    return app;
  }

  appSelection: AppSelectionMock = new AppSelectionMock();

}
