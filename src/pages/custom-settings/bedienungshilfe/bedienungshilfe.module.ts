import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { BedienungshilfePage } from './bedienungshilfe';

@NgModule({
  declarations: [
    BedienungshilfePage,
  ],
  imports: [
    IonicPageModule.forChild(BedienungshilfePage),
  ],
  exports: [
    BedienungshilfePage,
  ]
})
export class BedienungshilfePageModule { }
