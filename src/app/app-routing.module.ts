import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';


const routes: Routes = [


  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full'
  }, { 
    path: 'login', 
    loadChildren: './authentification/login/login.module#LoginPageModule' 
  },
  // { 
  //   path: 'forgot-password', 
  //   loadChildren: './pages/forgot-password/forgot-password.module#ForgotPasswordPageModule' 
  // }, 
  
  {
    path: 'app',
    loadChildren: './tabs/tabs.module#TabsPageModule',
    canActivate: [AuthGuard]
  },

  {
    path: 'newChannelCreate',
    children: [
      {
        path: '',
        loadChildren: './channel-creation/channel-creation.module#ChannelCreationPageModule'
      }
    ]
  },


  {
    path: 'textMessage/:channelId',
    children: [
      {
        path: '',
        loadChildren: './text-message/text-message.module#TextMessagePageModule'
      }
    ]
  },

  {
    path: 'textMessage/:channelId/gestionChannel',
    children: [
      {
        path: '',
        loadChildren: './gestion-users-channel/gestion-users-channel.module#GestionUsersChannelPageModule'
      }
    ]
  },
  {
    path: 'listUsers',
    children: [
      {
        path: '',
        //resolve : {
        //  userLists : UserListService
        //},
        loadChildren: './list-users/list-users.module#ListUsersPageModule'
      }
    ]
  },
  
  //{ path: 'list-users', loadChildren: './list-users/list-users.module#ListUsersPageModule' },


  //{ path: 'gestion-users-channel', loadChildren: './gestion-users-channel/gestion-users-channel.module#GestionUsersChannelPageModule' },

  //{ path: 'channel-creation', loadChildren: './channel-creation/channel-creation.module#ChannelCreationPageModule' }



];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  //providers : [
  //  UserListService
  //]
})
export class AppRoutingModule {}
