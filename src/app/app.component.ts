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

         this.userService.callNotificationLeave()

     });
     this.platform.resume.subscribe(() => {

       this.userService.callNotificationEnter()
     });
    });
  }


}


// import { Component } from '@angular/core';
// import { Platform } from '@ionic/angular';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
// import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
// import * as firebase from 'firebase/app'

// @Component({
//   selector: 'app-root',
//   templateUrl: 'app.component.html'
// })
// export class AppComponent {
//   user : any
//   constructor(
//     private platform: Platform,
//     private splashScreen: SplashScreen,
//     private statusBar: StatusBar,
//     private localNotifications: LocalNotifications
//   ) {
//     //
//     this.initializeApp();
//   }

//   initializeApp() {

//     this.platform.ready().then(() => {
//       setTimeout(function(){ this.user = firebase.auth().currentUser;
//         console.log(this.user) }, 3000);
//       this.user = firebase.auth().currentUser;
//       console.log(this.user)
//       this.statusBar.styleDefault();
//       this.splashScreen.hide();
//       this.platform.pause.subscribe(() => {
//         var user = firebase.auth().currentUser;
//         if(user === undefined || user === null){
//           this.callNotificationEnterTest(user.uid)
//         }
//         //this.callNotificationLeave()
//     });
//     this.platform.resume.subscribe(() => {
//       var user = firebase.auth().currentUser;
//       if(user !== undefined || user !== null){
//         this.callNotificationEnterTest(user.uid)
//       }
//       //this.callNotificationEnter()
//     });
//     });
//   }

//   callNotificationEnter(){
//     this.localNotifications.schedule({
//       id: 1,
//       title: 'Messenger Ionic Enter',
//       text: "You've enter",
//       sound: this.platform.is('android')? 'file://sound.mp3': 'file://beep.caf',
//       vibrate: true
//     });
//   }

//   callNotificationEnterTest(id : string){
//     this.localNotifications.schedule({
//       id: 1,
//       title: 'Messenger Ionic Enter' ,
//       text: "You've enter " + id,
//       sound: this.platform.is('android')? 'file://sound.mp3': 'file://beep.caf',
//       vibrate: true
//     });
//   }

//   callNotificationLeave(){
//     this.localNotifications.schedule({
//       id: 1,
//       title: 'Messenger Ionic Leave',
//       text: "You've close",
//       sound: this.platform.is('android')? 'file://sound.mp3': 'file://beep.caf',
//       vibrate: true
//     });
//   }

// }

// import { Component } from '@angular/core';

// import { Platform } from '@ionic/angular';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
// import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
// import { UserService } from './service/user.service';

// @Component({
//   selector: 'app-root',
//   templateUrl: 'app.component.html'
// })
// export class AppComponent {
//   userId
//   constructor(
//     private platform: Platform,
//     private splashScreen: SplashScreen,
//     private statusBar: StatusBar,
//     private localNotifications: LocalNotifications,
//     private userService : UserService
//   ) {
//     this.initializeApp();

//   }

//   initializeApp() {
//     this.platform.ready().then(() => {
//       this.statusBar.styleDefault();
//       this.splashScreen.hide();
//       this.platform.pause.subscribe(() => {
//         this.userService.getCurrentUser().then(function (user) {
//           if(user !== undefined){
//             this.callNotificationLeave(user.uid)
//           }
//           else{
//             this.testCallNotif()
//           }
          
//         })
        
//     });
//     this.platform.resume.subscribe(() => {
//       this.userService.getCurrentUser().then(function (user) {
//         if(user !== undefined){
//         this.callNotificationEnter()(user.uid)
//         }
//         else{
//           this.testCallNotif()
//         }
//       })
      
//     });
//     });
//   }



//   callNotificationEnter(id : string){
//     this.localNotifications.schedule({
//       id: 1,
//       title: 'Messenger Ionic Enter',
//       text: "You've enter " + id,
//       sound: this.platform.is('android')? 'file://sound.mp3': 'file://beep.caf',
//       vibrate: true
//       //data: { secret: key }
//     });
//   }

//   testCallNotif(){
//     this.localNotifications.schedule({
//       id: 1,
//       title: 'Messenger Ionic Enter',
//       text: "You've enter ",
//       sound: this.platform.is('android')? 'file://sound.mp3': 'file://beep.caf',
//       vibrate: true
//       //data: { secret: key }
//     });
//   }

//   callNotificationLeave(id : string){
//     this.localNotifications.schedule({
//       id: 1,
//       title: 'Messenger Ionic Leave',
//       text: "You've close "+ id,
//       sound: this.platform.is('android')? 'file://sound.mp3': 'file://beep.caf',
//       vibrate: true
//       //data: { secret: key }
//     });
//   }


// }

