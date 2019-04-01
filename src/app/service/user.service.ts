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
  details: string,
  friends: any[]
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
  id: string,
  idPrivate : string
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
    public db: AngularFirestore,
    public activatedRoute: ActivatedRoute
  ) {

    this.usersCollection = db.collection<UserList>('users');
    this.channelCollection = db.collection<any>('channel')

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


  setUserOnLine(idUser: string) {
    this.usersCollection.doc(idUser).update({
      "isOnline": true
    })
  }


  setUserOffLine(idUser: string) {
    this.usersCollection.doc(idUser).update({
      "isOnline": false
    })
  }


  async presentToastWithOptionsWithMessage(message: string, color: string) {
    const toast = await this.toastController.create({
      message: `${message}`,
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'Ok',
      color: color,
      duration: 2000,
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


  removeChannel(idChannel: string,navigate : boolean) {
    let waitBeforeDeleteChannel = false
    let usersId = []
    this.channelCollection.doc(idChannel).collection("messages").snapshotChanges().subscribe(data => {
      data.map((idADelete, index) => {
        this.channelCollection.doc(idChannel).collection("messages").doc(idADelete.payload.doc.id).delete()
        if (index === data.length - 1 && waitBeforeDeleteChannel) {
          this.channelCollection.doc(idChannel).delete()
        }
        if (index === data.length - 1 && waitBeforeDeleteChannel === false) {
          waitBeforeDeleteChannel = true
        }
      })
    })
    this.channelCollection.doc(idChannel).collection("users").snapshotChanges().subscribe(data => {
      data.map((idADelete, index) => {
        this.channelCollection.doc(idChannel).collection("users").doc(idADelete.payload.doc.id).delete()
        usersId[index] = idADelete.payload.doc.id
        if (index === data.length - 1 && waitBeforeDeleteChannel) {
          this.channelCollection.doc(idChannel).delete()
        }
        if (index === data.length - 1 && waitBeforeDeleteChannel === false) {
          waitBeforeDeleteChannel = true
        }

      })
    })
    this.channelCollection.doc(idChannel).collection("users").snapshotChanges().subscribe(data => {
      data.map((idADelete) => {
        this.usersCollection.doc(idADelete.payload.doc.id).collection("channels").doc(idChannel).delete()
        if(navigate){
          this.navigateTo('app/tabs/tab2')
        } 
        
      })
    })
  }

  entrerChatPrive(currentuserId: string, userId: string) {
    let valeurBoolean = false
    let currentIdUserId = `${currentuserId}${userId}`
    let currentIdUserIdInverse = `${userId}${currentuserId}`
    this.usersCollection.doc(currentuserId).collection("channels").snapshotChanges().subscribe(data => {
      if (data.length === 0) {
        let isAdmin = {
          isAdmin: true,
          name: "",
          idPrivate : currentIdUserId
        }
        let dataAdd = {
          isAdmin: true,
          name: "",
          idPrivate : currentIdUserId,
          isFriend : "true"
        }
        let name = {
          name: ""
        }
        this.channelCollection.doc(currentIdUserId).set(name).then(() => {
          this.channelCollection.doc(currentIdUserId).collection("users").doc(userId).set(isAdmin).then(() => {
            this.usersCollection.doc(currentuserId).collection("channels").doc(currentIdUserId).set(isAdmin).then(() => {
              this.usersCollection.doc(currentuserId).collection("amis").doc(userId).set(dataAdd).then(() => {   // A modifier
                this.usersCollection.doc(userId).collection("amis").doc(currentuserId).set(dataAdd).then(() => { // A modifier
                  this.usersCollection.doc(userId).collection("channels").doc(currentIdUserId).set(isAdmin).then(() => {
                    this.channelCollection.doc(currentIdUserId).collection("users").doc(currentuserId).set(isAdmin).then(() => {
                      this.navigateTo(`textMessage/${currentIdUserId}`)
                    })
                  })
                })
              })
            })
          })
        })

      }
      else {

        let longeurData = data.length - 1
        data.map((aa, index) => {
          if (aa.payload.doc.id === currentIdUserId) {
            valeurBoolean = true
            this.router.navigateByUrl(`textMessage/${currentIdUserId}`);

            index = longeurData + 1
          } if (aa.payload.doc.id === currentIdUserIdInverse) {
            valeurBoolean = true
            this.router.navigateByUrl(`textMessage/${currentIdUserIdInverse}`)

            index = longeurData + 1
          }
          if (index === longeurData && valeurBoolean === false) {
            let isAdmin = {
              isAdmin: true,
              name: "",
              idPrivate : currentIdUserId
            }
            let name = {
              name: ""
            }
            let dataAdd = {
              isAdmin: true,
              name: "",
              idPrivate : currentIdUserId,
              isFriend : "true"
            }

            this.channelCollection.doc(currentIdUserId).set(name).then(() => {
              this.channelCollection.doc(currentIdUserId).collection("users").doc(userId).set(isAdmin).then(() => {
                this.usersCollection.doc(currentuserId).collection("channels").doc(currentIdUserId).set(isAdmin).then(() => {
                  this.usersCollection.doc(currentuserId).collection("amis").doc(userId).set(dataAdd).then(() => {   // A modifier
                    this.usersCollection.doc(userId).collection("amis").doc(currentuserId).set(dataAdd).then(() => { // A modifier
                      this.usersCollection.doc(userId).collection("channels").doc(currentIdUserId).set(isAdmin).then(() => {
                        this.channelCollection.doc(currentIdUserId).collection("users").doc(currentuserId).set(isAdmin).then(() => {
                          this.navigateTo(`textMessage/${currentIdUserId}`)
                        })
                      })
                    })
                  })
                })
              })
            })


          }

        })
      }

    })


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
      return docRef.id
    }).catch(function (error) {
    });
  }

  getUserById(id) {

    return this.usersCollection.doc<UserList>(id).snapshotChanges();

  }


  updateUserDetail(id: string, displayName: string, avatar: string) {
    this.navigateTo('app')
    return this.usersCollection.doc(id).update({
      id: id,
      displayName: displayName,
      avatar: avatar
    })

  }


  addChannelToAdminUser(id: string, idChannel: string, nom: string) {
    let isNotAdmin = {
      name: nom,
      isAdmin: true
    }
    return this.usersCollection.doc(id).collection('channels').doc(idChannel).set(isNotAdmin)
  }



  addFriendsToUsers(idCurrentUser: string, idUserAAjouter: any) {

    let isFriendPending = {
      isFriend: "pending"
    }
    let isFriendwantAdd = {
      isFriend: "wantAdd"
    }

    this.usersCollection.doc(idUserAAjouter).collection('amis').doc(idCurrentUser).set(isFriendPending)
    this.usersCollection.doc(idCurrentUser).collection('amis').doc(idUserAAjouter).set(isFriendwantAdd)

  }


  acceptFriend(idCurrentUser: string, idUserAAjouter: string) {
    let isFriend = {
      isFriend: "true"
    }
    this.usersCollection.doc(idCurrentUser).collection('amis').doc(idUserAAjouter).set(isFriend)
    this.usersCollection.doc(idUserAAjouter).collection('amis').doc(idCurrentUser).set(isFriend)

  }

  deniedFriend(idCurrentUser: string, idUserAAjouter: string) {
    this.usersCollection.doc(idUserAAjouter).collection('amis').doc(idCurrentUser).delete()
    this.usersCollection.doc(idCurrentUser).collection('amis').doc(idUserAAjouter).delete()
  }


  removeFriend(idCurrentUser: string, idUserAAjouter: string) {
    this.usersCollection.doc(idCurrentUser).collection('amis').doc(idUserAAjouter).valueChanges().subscribe(data => {
      let dataConverti = data as Channel
      if(dataConverti.idPrivate !== undefined){
        this.removeChannel(dataConverti.idPrivate,false)
        this.navigateTo('app/tabs/tab1')
      }
      this.usersCollection.doc(idCurrentUser).collection('amis').doc(idUserAAjouter).delete()
      this.usersCollection.doc(idUserAAjouter).collection('amis').doc(idCurrentUser).delete()
    })

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
  addChannelToUser(id: string, idChannel: string, nom: string) {

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



  deleteChannel(idChannel: string) {
    this.listeAllUsersOfChannels(idChannel).subscribe(users => {
      users.map(user => {
        this.usersCollection.doc(user.id).collection("channels").doc(idChannel).delete()
      })
    })
  }



  addUserDetails(id: string, displayName: string, avatar: string) {
    return this.usersCollection.doc(id).set({
      id: id,
      displayName: displayName,
      avatar: avatar
    })
  }

  returnDetailsChannel(id: string) {
    return this.channelCollection.doc(id).snapshotChanges().pipe(
      map(actions => {
        const data = actions.payload.data() as Channel;
        const id = actions.payload.id;
        return { id, ...data };
      })
    )}





  addMessageToChannel(idChannel: string, idUser: string, message: string, date: Date, avatar: string) {
    let messageAEntrer = {
      idUser: idUser,
      message: message,
      date: date,
      avatar: avatar
    }
    return this.channelCollection.doc(idChannel).collection("messages").add(messageAEntrer)
  }


  returnListChannelOfCurrentUser(id: string) {
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

  listeAllMessageOfAChannel(idChannel: string) {
    let date = new Date().getTime()
    return this.channelCollection.doc(idChannel).collection("messages", ref => ref.orderBy('date').startAt(0)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Message;
          data.dateNumber = this.convertSecond(data.date.seconds, date)
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  changeAdminModeUser(idChannel: string, idUser: string) {

    this.channelCollection.doc(idChannel).collection('users').doc(idUser).update({
      isAdmin : true
    })
    this.usersCollection.doc(idUser).collection('channels').doc(idChannel).update({
      isAdmin : true
    })
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
      return `${Math.floor(secondeEntreLesDeux / 86400)} jours`
    }
  }


  getCurrentUser() {
    return new Promise<any>((resolve, reject) => {
      resolve(firebase.auth().currentUser)

    })
  }
  returnUser(): Observable<any> {
    return this.user
  }


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
        this.setUserOnLine(value.user.uid)
        this.navigateTo('app')
      })
      .catch(err => {
      });
  }

  logout() {
    let self = this
    this.getCurrentUser().then(user => {
      this.setUserOffLine(user.uid)
    }).then(() => {
      setTimeout(function () {
        return self._auth.auth.signOut();

      }, 100);


    })

  }

}
