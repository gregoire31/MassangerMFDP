import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GestionUsersChannelPage } from './gestion-users-channel.page';

const routes: Routes = [
  {
    path: '',
    component: GestionUsersChannelPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GestionUsersChannelPage]
})
export class GestionUsersChannelPageModule {}
