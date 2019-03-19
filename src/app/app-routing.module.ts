import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard'
import { UserListService } from './resolver/user-list.service';


const routes: Routes = [


  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full'
  }, { 
    path: 'login', 
    loadChildren: './authentification/login/login.module#LoginPageModule' 
  }, { 
    path: 'signup', 
    loadChildren: './authentification/signup/signup.module#SignupPageModule'
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
  //{ path: 'list-users', loadChildren: './list-users/list-users.module#ListUsersPageModule' },


  //{ path: 'gestion-users-channel', loadChildren: './gestion-users-channel/gestion-users-channel.module#GestionUsersChannelPageModule' },
  //{ path: 'utilisateurs', loadChildren: './utilisateurs/utilisateurs.module#UtilisateursPageModule' },

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
