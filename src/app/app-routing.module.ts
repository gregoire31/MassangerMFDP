import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard'


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
  //{ path: 'channel-creation', loadChildren: './channel-creation/channel-creation.module#ChannelCreationPageModule' }



];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
