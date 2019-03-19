import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app'
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { promise } from 'protractor';


export interface UserList {
  id: string;
  displayName: string;
  avatar: string;
  channel: any[];
  isOnline: boolean;
  details: string
}


interface Message {
  dateNumber: string,
  id: string,
  idUser: string,
  message: string,
  avatar: string,
  time: string,
  date: {
    seconds: number
  },

}

interface Channel {
  isAdmin: boolean,
  name: string,
  id: string
}

export interface friendUserType { isFriend: string, details: any }
export interface isAdminType { isAdmin: boolean }


@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: Observable<any[]>
  private usersCollection: AngularFirestoreCollection<UserList>;
  private channelCollection: AngularFirestoreCollection<any>;

  constructor(
    public toastController: ToastController,
    private _auth: AngularFireAuth,
    private router: Router,
    db: AngularFirestore,
    public activatedRoute: ActivatedRoute
  ) {

    this.usersCollection = db.collection<UserList>('users');
    this.channelCollection = db.collection<any>('channel')

  }

  get windowRef() {
    return window
  }

  setUserStatusOnLine() {
    this.getCurrentUser().then(user => {
      if (user) {
        this.setUserOnLine(user.uid)
      }
    });
  }


  setUserStatusOffLine() {
    this.getCurrentUser().then(user => {
      if (user) {
        this.setUserOffLine(user.uid)
      }

    })

  }

  //statusConnection(idUser: string) {
  //  this.usersCollection.doc(idUser).snapshotChanges().subscribe(user => {
  //    let userSend = user.payload.data() as UserList
  //    return userSend.isOnline
  //  })
  //}

  setUserOnLine(idUser: string) {
    this.usersCollection.doc(idUser).update({
      "isOnline": true
    })
  }



  //userLeaveApp(idUser: string) {
  //  this.usersCollection.doc(idUser).update({
  //    "isOnline": "pending"
  //  })
  //  setTimeout(function () {
  //    if(this.statusConnection(idUser) === "pending"){
  //      this.usersCollection.doc(idUser).update({
  //        "isOnline": "false"
  //      })
  //    }
  //  }, 10000);
  //}
  setUserOffLine(idUser: string) {
    this.usersCollection.doc(idUser).update({
      "isOnline": false
    })
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
          const data = a.payload.doc.data() as UserList;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  entrerChatPrive(currentuserId: string, userId: string) {
    let currentIdUserId = `${currentuserId}${userId}`
    let verificationChannelExiste = false
    let idReel: string
    //console.log(currentIdUserId)
    let setData = {
      isAdmin: true,
      name: currentIdUserId
    }
    return new Promise(resolve=> {
      this.returnListChannelOfCurrentUser(currentuserId).subscribe(channels => {
        if(channels.length === 0){
          resolve([false,""])
        }
        channels.map((channel, index) => {
          //console.log(channel.name)
          //console.log(channel.name.length)
          if (channel.name.length > 30) {
            let premierePartie = channel.name.substr(0, 28)
            let deuxiemePartie = channel.name.substr(28, 55)
            let deuxiemeIdPossible = deuxiemePartie + premierePartie

            console.log(`channel entrant :  ${currentIdUserId} channel sortant ${deuxiemeIdPossible} channel name : ${channel.name}`)
            if (channel.name === currentIdUserId) {
              console.log("PREMIERE IDDDDDDDD")
              resolve([true,currentIdUserId]
              //verificationChannelExiste = true
              //idReel = currentIdUserId
              )
            }
            if (channel.name === deuxiemeIdPossible) {
              console.log("DEXIEME IDDDDDDD")
              resolve([true,deuxiemeIdPossible])
              //verificationChannelExiste = true
              //idReel = deuxiemeIdPossible
            }
            if(index === channels.length -1){
              console.log("rien trouvé")
              resolve([false,""])
            }
  
          }
        })
        //console.log("finis")
        //resolve([false,""])
      })
    }).then((data)=> {
      console.log(data[0])
      console.log(data[1])

      if(data[0] === false){
        return new Promise( () => {
          this.usersCollection.doc(userId).collection("channels").doc(currentuserId).set(setData)
          this.usersCollection.doc(currentuserId).collection("channels").doc(userId).set(setData)
          this.channelCollection.doc(currentIdUserId).collection("users").doc(userId).set(setData)
          this.channelCollection.doc(currentIdUserId).collection("users").doc(currentuserId).set(setData)
        }).then(() => {
          this.usersCollection.doc(currentuserId).collection("channels").doc(userId).get().subscribe(data => {
            console.log(data.data())
            this.navigateTo(`app/tabs/textMessage/${data.data().name}`)
          })
        })

      }else{
        this.navigateTo(`app/tabs/textMessage/${data[1]}`)
      }
      //console.log(idReel)
      //console.log(verificationChannelExiste)
      //if (verificationChannelExiste === false) {
      //  return new Promise(resolve => {
      //    this.usersCollection.doc(userId).collection("channels").doc(currentuserId).set(setData)
      //    this.usersCollection.doc(currentuserId).collection("channels").doc(userId).set(setData)
      //    this.channelCollection.doc(currentIdUserId).collection("users").doc(userId).set(setData)
      //    this.channelCollection.doc(currentIdUserId).collection("users").doc(currentuserId).set(setData)
      //  }).then(() => {
      //    this.usersCollection.doc(currentuserId).collection("channels").doc(userId).get().subscribe(data => {
      //      console.log(data.data())
      //      this.navigateTo(`app/tabs/textMessage/${data.data().name}`)
      //    })
      //  })
      //}
      //else {
      //  this.navigateTo(`app/tabs/textMessage/${idReel}`)
      //}
    })




    

    //this.usersCollection.doc(currentuserId).collection("channels").doc(userId).get().subscribe(data => {
    //  if (!data.exists) {
    //    return new Promise(resolve => {
    //    this.usersCollection.doc(userId).collection("channels").doc(currentuserId).set(setData)
    //    this.usersCollection.doc(currentuserId).collection("channels").doc(userId).set(setData)
    //    this.channelCollection.doc(currentIdUserId).collection("users").doc(userId).set(setData)
    //    this.channelCollection.doc(currentIdUserId).collection("users").doc(currentuserId).set(setData)
    //    }).then(()=> {
    //      this.usersCollection.doc(currentuserId).collection("channels").doc(userId).get().subscribe(data => {
    //        console.log(data.data())
    //        this.navigateTo(`app/tabs/textMessage/${data.data().name}`)
    //      })
    //    })
    //    
    //  }
    //  else{
    //    
    //  }
    //
    //  
    //
    //  //this.navigateTo(`app/tabs/textMessage/${currentIdUserId}`)
    //
    //})

  }

  createChannel(id: string, nom: string) {

    let self = this
    return this.channelCollection.add({
      name: nom
    }).then(function (docRef) {

      self.addChannelToAdminUser(id, docRef.id, nom)
      return docRef
    }).then(function (docRef) {

      let isAdmin = {
        name: nom,
        isAdmin: true
      }

      self.channelCollection.doc(docRef.id).collection('users').doc(id).set(isAdmin)
      console.log(docRef)
      return docRef.id
    }).catch(function (error) {
      console.error("Error adding document: ", error);
    });
  }

  getUserById(id) {
    return this.usersCollection.doc<UserList>(id).snapshotChanges();
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


  addChannelToAdminUser(id: string, idChannel: string, nom: string) {

    console.log(id)
    let isNotAdmin = {
      name: nom,
      isAdmin: true
    }
    return this.usersCollection.doc(id).collection('channels').doc(idChannel).set(isNotAdmin)
  }



  addFriendsToUsers(idCurrentUser: string, idUserAAjouter: any) {
    let isNotfriend = {
      isFriend : "false"
    }
    let isFriendPending = {
      isFriend: "pending"
    }
    let isFriendwantAdd = {
      isFriend: "wantAdd"
    }

    this.usersCollection.doc(idUserAAjouter).collection('amis').doc(idCurrentUser).set(isFriendPending)
    this.usersCollection.doc(idCurrentUser).collection('amis').doc(idUserAAjouter).set(isFriendwantAdd)
    //this.getUserList()
    console.log("complete")
  }

  acceptFriend(idCurrentUser: string, idUserAAjouter: string) {
    let isFriend = {
      isFriend: "true"
    }
    this.usersCollection.doc(idCurrentUser).collection('amis').doc(idUserAAjouter).set(isFriend)
    this.usersCollection.doc(idUserAAjouter).collection('amis').doc(idCurrentUser).set(isFriend)
    //return this.friendList(idCurrentUser)
  }

  deniedFriend(idCurrentUser: string, idUserAAjouter: string) {
    this.usersCollection.doc(idCurrentUser).collection('amis').doc(idUserAAjouter).delete()
    this.usersCollection.doc(idUserAAjouter).collection('amis').doc(idCurrentUser).delete()
  }

  addChannelToUser(id: string, idChannel: string, nom: string) {
    console.log(id)

    let isNotAdmin = {
      name: nom,
      isAdmin: false
    }
    return this.usersCollection.doc(id).collection('channels').doc(idChannel).set(isNotAdmin)
  }

  addUserToChannel(idChannel: string, idUser: string, nameChannel: string) {
    let isNotAdmin = {
      name: nameChannel,
      isAdmin: false
    }
    this.channelCollection.doc(idChannel).collection('users').doc(idUser).set(isNotAdmin)
  }


  friendList(id: string) {
    return this.usersCollection.doc(id).collection("amis").snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as friendUserType;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  deleteChannel(idChannel: string) {
    this.listeAllUsersOfChannels(idChannel).subscribe(users => {
      users.map(user => {
        console.log(user)
        this.usersCollection.doc(user.id).collection("channels").doc(idChannel).delete()
      })
    })
    //this.channelCollection.doc(idChannel).delete()
  }


  changeAdminModeUser(idChannel: string, idUser: string) {

    let isAdmin = {
      isAdmin: true
    }

    this.channelCollection.doc(idChannel).collection('users').doc(idUser).set(isAdmin)
  }

  returnListChannelOfCurrentUser(id: string) {
    //console.log(id)
    return this.usersCollection.doc(id).collection("channels").snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Channel;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  returnDetailsChannel(id: string) {
    return this.channelCollection.doc(id).valueChanges()
  }

  addMessageToChannel(idChannel: string, idUser: string, message: string, date: Date, avatar: string) {
    //console.log("ID CHANNEL : " + idChannel + "ID User : " + idUser + "message : " + message + "date : " + date + "avatar : "+ avatar)
    let messageAEntrer = {
      idUser: idUser,
      message: message,
      date: date,
      avatar: avatar
    }
    return this.channelCollection.doc(idChannel).collection("messages").add(messageAEntrer)
  }

  listeAllUsersOfChannels(idChannel: string) {
    return this.channelCollection.doc(idChannel).collection("users").snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as isAdminType;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    )
  }

  convertSecond(datedernierMessage: number, dateActuel: number) {
    let secondeEntreLesDeux = dateActuel / 1000 - datedernierMessage


    if (secondeEntreLesDeux < 60) {
      if (secondeEntreLesDeux < 1) {
        return "A l'instant"
      } else {

        return `${Math.floor(secondeEntreLesDeux)} secondes`
      }
    }
    if (secondeEntreLesDeux < 3600) {

      return `${Math.floor(secondeEntreLesDeux / 60)} minutes`
    }
    if (secondeEntreLesDeux < 86400) {
      return `${Math.floor(secondeEntreLesDeux / 3600)} heures`
    }
    else {
      //console.log(secondeEntreLesDeux)
      return `${Math.floor(secondeEntreLesDeux / 86400)} jours`
    }
  }


  listeAllMessageOfAChannel(idChannel: string) {
    let date = new Date().getTime()
    console.log(date)

    console.log("service in")
    return this.channelCollection.doc(idChannel).collection("messages", ref => ref.orderBy('date').startAt(0)).snapshotChanges().pipe(
      map(actions => {
        //console.log(actions)
        return actions.map(a => {
          const data = a.payload.doc.data() as Message;
          console.log(data)
          data.dateNumber = this.convertSecond(data.date.seconds, date)
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }


  addUserDetails(id: string, displayName: string, avatar: string) {
    return this.usersCollection.doc(id).set({
      id: id,
      displayName: displayName,
      avatar: avatar
    })
  }

  removeUser(id) {
    this.friendList(id).subscribe(friends => {
      console.log(friends)
      friends.map(friend => {
        console.log(friend.id)
        //this.getUserById(friend.id).subscribe(friend => {
        //  this.usersCollection.id
        //})
      })
    })
    //return this.usersCollection.doc(id).delete();
  }
  removeUserFromChannel(idUser: string, idChannel: string) {
    this.usersCollection.doc(idUser).collection('channels').doc(idChannel).delete()
    this.channelCollection.doc(idChannel).collection('users').doc(idUser).delete()
  }

  getRoleofUser(id: string, idChannel: string) {
    return this.usersCollection.doc(id).collection("channels").doc(idChannel).snapshotChanges().pipe(
      map(actions => {
        return actions.payload.data() as isAdminType
      })
    )
  }

  getCurrentUser() {
    return new Promise<any>((resolve, reject) => {
      resolve(firebase.auth().currentUser)

    })
  }
  returnUser(): Observable<any> {
    return this.user
  }




  //signup(emailRegister, passwordRegister, nomRegister) {
  //  let self = this
  //  let photoURL = "https://www.gettyimages.ie/gi-resources/images/Homepage/Hero/UK/CMS_Creative_164657191_Kingfisher.jpg"
  //  this._auth
  //    .auth
  //    .createUserWithEmailAndPassword(emailRegister, passwordRegister)
  //    .then(
  //      (newUser) => {
  //        self.addUserDetails(newUser.user.uid, nomRegister, photoURL)
  //        this.presentToastWithOptionsWithMessage(nomRegister, "tertiary")
  //        console.log(newUser)
  //        newUser.user.updateProfile({
  //          displayName: nomRegister,
  //          photoURL: photoURL,
  //        })
  //      })
  //
  //    .then(function () {
  //      self.navigateTo('app')
  //    })
  //    .catch(err => {
  //      this.presentToastWithOptionsWithMessage(err.message, "warning")
  //    });
  //}

  navigateTo(url: string) {
    this.router.navigateByUrl(url);
  }

  navigateWithoutUrl(url: any) {
    this.router.navigate(url)
  }


  login(email, password) {
    return this._auth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        //console.log(value);
        //console.log(value.user.displayName)
        this.setUserOnLine(value.user.uid)
        this.navigateTo('app')
      })
      .catch(err => {
        this.presentToastWithOptions()
      });
  }

  logout() {
    let self = this
    this.getCurrentUser().then(user => {
      console.log(user)
      this.setUserOffLine(user.uid)
    }).then(() => {
      setTimeout(function () {
        return self._auth.auth.signOut();

      }, 100);


    })

  }




}
