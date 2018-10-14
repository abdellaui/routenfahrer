import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { BedienungshilfePageModule } from './bedienungshilfe/bedienungshilfe.module';
import { CustomSettingsPage } from './custom-settings';
import { InformationPageModule } from './information/information.module';

@NgModule({
  declarations: [
    CustomSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomSettingsPage),
    InformationPageModule,
    BedienungshilfePageModule,
  ],
  exports: [
    CustomSettingsPage,
  ]
})
export class CustomSettingsPageModule { }
