import { AppSelection, LaunchNavigator } from '@ionic-native/launch-navigator';


export interface LaunchNavigatorOptions {
  /**
   * name of the navigation app to use for directions. Specify using launchnavigator.APP constants. If not specified, defaults to User Selection.
   */
  app?: string;
  /**
   * nickname to display in app for destination. e.g. "Bob's House".
   */
  destinationName?: string;
  /**
   * Start point of the navigation
   */
  start?: string | number[];
  /**
   * nickname to display in app for start . e.g. "My House".
   */
  startName?: string;
  /**
   * Transportation mode for navigation: "driving", "walking" or "transit". Defaults to "driving" if not specified.
   */
  transportMode?: string;
  /**
   * If true, debug log output will be generated by the plugin. Defaults to false.
   */
  enableDebug?: boolean;
  /**
   * a key/value map of extra app-specific parameters. For example, to tell Google Maps on Android to display Satellite view in "maps" launch mode: `{"t": "k"}`
   */
  extras?: any;
  /**
   * (Android only) mode in which to open Google Maps app: "maps" or "turn-by-turn". Defaults to "maps" if not specified. Specify using launchnavigator.LAUNCH_MODE constants.
   */
  launchMode?: string;
  /**
   * text to display in the native picker which enables user to select which navigation app to launch. Defaults to "Select app for navigation" if not specified.
   */
  appSelectionDialogHeader?: string;
  /**
   * text to display for the cancel button in the native picker which enables user to select which navigation app to launch. Defaults to "Cancel" if not specified.
   */
  appSelectionCancelButton?: string;
  successCallback?: Function;
  errorCallback?: Function;
}
export class LaunchNavigatorMock extends LaunchNavigator {
  /**
   * Launches navigator app
   * @param destination {string|number[]} Location name or coordinates (as string or array)
   * @param options {LaunchNavigatorOptions}
   * @returns {Promise<any>}
   */
  navigate(destination: string | number[], options?: LaunchNavigatorOptions): Promise<any> { return new Promise((r, j) => { r(true) }) }
  /**
   * Determines if the given app is installed and available on the current device.
   * @param app {string}
   * @returns {Promise<any>}
   */
  isAppAvailable(app: string): Promise<any> { return new Promise((r, j) => { r(true) }) }
  /**
   * Returns a list indicating which apps are installed and available on the current device.
   * @returns {Promise<string[]>}
   */
  availableApps(): Promise<string[]> { return new Promise((r, j) => { r([]) }) }
  /**
   * Returns the display name of the specified app.
   * @param app {string}
   * @returns {string}
   */
  getAppDisplayName(app: string): string { return app }
  /**
   * Returns list of supported apps on a given platform.
   * @param platform {string}
   * @returns {string[]}
   */
  getAppsForPlatform(platform: string): string[] { return [] }
  /**
   * Indicates if an app on a given platform supports specification of transport mode.
   * @param app {string} specified as a string, you can use one of the constants, e.g `LaunchNavigator.APP.GOOGLE_MAPS`
   * @param platform {string}
   * @returns {boolean}
   */
  supportsTransportMode(app: string, platform: string): boolean { return true }
  /**
   * Returns the list of transport modes supported by an app on a given platform.
   * @param app {string}
   * @param platform {string}
   * @returns {string[]}
   */
  getTransportModes(app: string, platform: string): string[] { return [] }
  /**
   * Indicates if an app on a given platform supports specification of launch mode.
   * Note that currently only Google Maps on Android does.
   * @param app {string}
   * @param platform {string}
   * @returns {boolean}
   */
  supportsLaunchMode(app: string, platform: string): boolean { return true }
  /**
   * Indicates if an app on a given platform supports specification of start location.
   * @param app {string}
   * @param platform {string}
   * @returns {boolean}
   */
  supportsStart(app: string, platform: string): boolean { return true }
  /**
   * @param app {string}
   * @param platform {string}
   * @returns {boolean}
   */
  supportsStartName(app: string, platform: string): boolean { return true }
  /**
   * @param app {string}
   * @param platform {string}
   * @returns {boolean}
   */
  supportsDestName(app: string, platform: string): boolean { return true }
  /**
   * @param destination {string | number[]}
   * @param options {LaunchNavigatorOptions}
   */
  userSelect(destination: string | number[], options: LaunchNavigatorOptions): void { }
  APP: any;
  TRANSPORT_MODE: any;
  appSelection: AppSelection
}
