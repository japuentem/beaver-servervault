import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServerUserPageRoutingModule } from './server-user-routing.module';

import { ServerUserPage } from './server-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServerUserPageRoutingModule
  ],
  declarations: [ServerUserPage]
})
export class ServerUserPageModule {}
