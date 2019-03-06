import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app'
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';


export interface UserList {
  id: string;
  displayName: string;
  avatar: string;
  channel: any[]
}

interface Message {
  id : string,
  idUser : string,
  message : string,
  avatar : string
}


@Injectable({
  providedIn: 'root'
})
export class UserService {
  userId: any
  user: Observable<any[]>
  private usersCollection: AngularFirestoreCollection<UserList>;
  private users: Observable<UserList[]>;
  private channelCollection: AngularFirestoreCollection<any>;
  private channels: Observable<any[]>;
  uid: string
  displayName: string
  avatar: string

  constructor(
    public toastController: ToastController, 
    private _auth: AngularFireAuth, 
    private router: Router, 
    db: AngularFirestore,
    public activatedRoute: ActivatedRoute,
    private localNotifications: LocalNotifications
    ) {

    this.usersCollection = db.collection<UserList>('users');
    this.channelCollection = db.collection<any>('channel')
    //this.users = this.usersCollection.snapshotChanges().pipe(
    //  map(actions => {
    //    return actions.map(a => {
    //      const data = a.payload.doc.data();
    //      const id = a.payload.doc.id;
    //      return { id, ...data };
    //    });
    //  })
    //);

    firebase.auth().onAuthStateChanged(user => {
      if (user) { this.userId = user.uid }
    });

  }
  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      message: 'Email ou Mot de passe incorect',
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'Ok',
      color: 'danger'
    });
    toast.present();
    
  }

  async presentToastWithOptionsWithMessage(message: string, color: string) {
    const toast = await this.toastController.create({
      message: `Bienvenue ${message}`,
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'Ok',
      color: color
    });
    toast.present();
  }

  getUserList() {
    return this.usersCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  createChannel(id: string, nom: string) {

    let self = this
    return this.channelCollection.add({
      name: nom
    }).then(function (docRef) {

      self.addChannelToAdminUser(id, docRef.id, nom)
      return docRef
    }).then(function (docRef) {

      let isAdmin =  {
        nom: nom,
        isAdmin: true
      }

      self.channelCollection.doc(docRef.id).collection('users').doc(id).set(isAdmin)
      console.log(docRef)
      return docRef.id
    }).catch(function (error) {
        console.error("Error adding document: ", error);
      });
  }

  getUserId(id) {
    return this.usersCollection.doc<UserList>(id).valueChanges();
  }

  updateUser(todo: UserList, id: string) {
    return this.usersCollection.doc(id).update(todo);
  }

  updateUserDetail(id: string, displayName: string, avatar: string) {
    console.log("Enregistré")
    this.navigateTo('app')
    return this.usersCollection.doc(id).update({
      id: id,
      displayName: displayName,
      avatar: avatar
    })

  }

  pushNotification() {
    this.localNotifications.schedule({
      id: this.userId,
      title: 'New user',
      text: 'New User',
      foreground: true,
      //sound: isAndroid? 'file://sound.mp3': 'file://beep.caf',
      sound: 'file://sound.mp3',
      //data: { secret: key } 
    });
  }


  //addChanneNewUser(id: string, channel : any){
  //  return this.usersCollection.doc(id).update({
  //    channel : channel
  //  })
  //}

  addChannelToAdminUser(id: string, idChannel: string, nom : string) {
    // //return firebase.database().ref(id).push(channel)
    // console.log(this.usersCollection.doc(id).collection('channel'))
    console.log(id)
    let isNotAdmin =  {
      nom : nom,
      isAdmin: true
    }
    return this.usersCollection.doc(id).collection('channels').doc(idChannel).set(isNotAdmin)
  }

  addFriendsToUsers(idCurrentUser : string, idUserAAjouter : any){
    let isFriend = {
      isFriend : true
    }

      this.usersCollection.doc(idCurrentUser).collection('amis').doc(idUserAAjouter).set(isFriend)
      this.usersCollection.doc(idUserAAjouter).collection('amis').doc(idUserAAjouter).set(isFriend)

    //console.log(this.friendListe(idCurrentUser))
    //return this.friendListe(idCurrentUser)
  }

  addChannelToUser(id: string, idChannel: string, nom : string) {
    // //return firebase.database().ref(id).push(channel)
    // console.log(this.usersCollection.doc(id).collection('channel'))
    console.log(id)
    let isNotAdmin =  {
      nom : nom,
      isAdmin: false
    }
    return this.usersCollection.doc(id).collection('channels').doc(idChannel).set(isNotAdmin)
  }

  addUserToChannel(idChannel: string, idUser: string, nameChannel : string) {
    let isNotAdmin =  {
      nom : nameChannel,
      isAdmin: false
    }
    this.channelCollection.doc(idChannel).collection('users').doc(idUser).set(isNotAdmin)
  }
  

  friendListe(id : string){
    return this.usersCollection.doc(id).collection("amis").snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  changeAdminModeUser(idChannel:string, idUser : string){
    
    let isAdmin =  {
      isAdmin: true
    }

    this.channelCollection.doc(idChannel).collection('users').doc(idUser).set(isAdmin)
  }

  returnListChannelOfCurrentUser(id:string){
    //return this.channelCollection.snapshotChanges().pipe(
    //  map(actions => {
    //    console.log(actions)
    //  })
    //);
    console.log(id)
    return this.usersCollection.doc(id).collection("channels").snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  returnDetailsChannel(id : string){
    return this.channelCollection.doc(id).valueChanges()
  }

  addMessageToChannel(idChannel : string, idUser : string, message :string, date:Date, avatar : string){
    console.log("ID CHANNEL : " + idChannel + "ID User : " + idUser + "message : " + message + "date : " + date + "avatar : "+ avatar)
    let messageAEntrer =  {
      idUser : idUser,
      message : message,
      date : date,
      avatar : avatar
    }
    return this.channelCollection.doc(idChannel).collection("messages").add(messageAEntrer)
  }

  listeAllUsersOfChannels (idChannel : string){
    return this.channelCollection.doc(idChannel).collection("users")
  }

  listeAllMessageOfAChannel(idChannel : string, numberResult : number) {
      return this.channelCollection.doc(idChannel).collection("messages", ref => ref.orderBy('date').limit(numberResult)).snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
    }
  
  
  
  //updateChannelUser(){
  //  this.usersCollection.doc(id).collection('channel').doc(myBookId).set({
  //    password: this.password,
  //    name: this.name,
  //    rollno: this.rollno
  //  })
  //}

  addUser(todo: UserList) {
    return this.usersCollection.add(todo);
  }

  addUserDetails(id: string, displayName: string, avatar: string) {
    return this.usersCollection.doc(id).set({
      id: id,
      displayName: displayName,
      avatar: avatar
    })
  }

  removeUser(id) {
    return this.usersCollection.doc(id).delete();
  }

  getCurrentUser() {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().onAuthStateChanged(function (user) {
        //if (user) {
        resolve(user);
        //} else {
        //  reject('No user logged inside !!');
        //}
      })
    })
  }
  returnUser(): Observable<any> {
    return this.user
  }

  get currentUser() {
    return (
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          return user
        } else {
          // No user is signed in.
        }
      })
    )
  }


  //get currentUser() {
  //  return this._auth.authState
  //    .pipe(switchMap(auth => auth ? this.getUserById(auth.uid) : of(null)));
  //}
  //
  //getUserById(userId: string) {
  //  return this.doc(`users/${userId}`);
  //}




  

  signup(emailRegister, passwordRegister, nomRegister) {
    let self = this
    let photoURL = "https://www.gettyimages.ie/gi-resources/images/Homepage/Hero/UK/CMS_Creative_164657191_Kingfisher.jpg"
    this._auth
      .auth
      .createUserWithEmailAndPassword(emailRegister, passwordRegister)
      .then(
        (newUser) => {
          self.addUserDetails(newUser.user.uid, nomRegister, photoURL)
          this.presentToastWithOptionsWithMessage(nomRegister, "tertiary")
          console.log(newUser)
          newUser.user.updateProfile({
            displayName: nomRegister,
            photoURL: photoURL,
          })
          //console.log(newUser.user.uid)
          //console.log(newUser.user.displayName)
          //console.log(newUser.user.photoURL)
          //self.uid = newUser.user.uid
          //self.displayName = newUser.user.displayName
          //self.avatar = newUser.user.photoURL
        })

      .then(function () {
        self.navigateTo('app')
      })
      .catch(err => {
        this.presentToastWithOptionsWithMessage(err.message, "warning")
      });
  }

  navigateTo(url: string) {
    this.router.navigateByUrl(url);
  }

  navigateWithoutUrl(url : any){
    this.router.navigate(url)
  }


  login(email, password) {
    return this._auth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log(value);
        console.log(value.user.displayName)
        this.navigateTo('app')
      })
      .catch(err => {
        this.presentToastWithOptions()
      });
  }

  logout() {
    return this._auth.auth.signOut();
  }

}
