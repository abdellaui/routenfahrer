export class Configs {
  currentIndex: number = 0;
  showTaskOnly: boolean = false;
  isPlaying: boolean = false;
  isActionSheetOpen: boolean = false;
  autoRun: boolean = false;
  autoRefresh: boolean = false;
  autoRefreshHour: string = '00:00';
  autoRefreshLastDate: string = new Date().toString();
}
