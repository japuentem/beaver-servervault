import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServerUserPage } from './server-user.page';

const routes: Routes = [
  {
    path: '',
    component: ServerUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServerUserPageRoutingModule {}
