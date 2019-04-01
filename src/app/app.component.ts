import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { UserService } from './service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  user : any
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private localNotifications: LocalNotifications,
    private userService : UserService
  ) {
    //
    this.initializeApp();
  }

  initializeApp() {

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.platform.pause.subscribe(() => {

         this.userService.setUserStatusOffLine()

     });
     this.platform.resume.subscribe(() => {

       this.userService.setUserStatusOnLine()
     });
    });
  }


}


