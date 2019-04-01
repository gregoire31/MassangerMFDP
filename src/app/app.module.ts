import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AngularFireAuthModule } from '@angular/fire/auth'
import { AngularFirestore, FirestoreSettingsToken } from 'angularfire2/firestore';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment'
import { AuthGuard } from '../guards/auth.guard'
import { Platform } from 'ionic-angular';
import { AngularFireStorage } from '@angular/fire/storage'

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: FirestoreSettingsToken, useValue: { }},
    AngularFirestore,
    AuthGuard,
    Platform,
    AngularFireStorage
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
