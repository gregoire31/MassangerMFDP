import { Component, NgZone } from '@angular/core';
import { UserService } from '../service/user.service';
import { map, mergeMap, finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Platform } from 'ionic-angular';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  users: any[]
  userName: String
  userId: string
  entry: any
  userModified: any
  usersFriends: any[] = []
  donneeSearchbar: string = ""
  userNameListFilter: any[]
  idFriends: any[] = []
  newFriends: any[] = []
  event: string
  idPendingFriends: any[] = []
  wantAddFriend: any[] = []
  idFriendsStocke: any[] = []
  friends: any[] = []
  subscribe: Subscription
  usrListFinal: any[] = []
  isFriendsStocke: any[] = []
  booleanUser: boolean = false
  booleanFriend: boolean = false

  constructor(private userService: UserService, private localNotifications: LocalNotifications, public plt: Platform, private zone: NgZone) {

    console.log("HELLO FROM TAB1")
    let self = this
    this.userService.getCurrentUser().then(function (user) {
      //console.log(user)
      self.userId = user.uid
    })
      .then(() => {
        //console.log(this.userId)
        this.userService.getUserById(this.userId).subscribe(user => {

          this.userName = user.payload.data().displayName
        })
      }).then(() => {

        this.userService.getUserList().subscribe(users => {

          //if (this.booleanUser === false) {
           this.users = users
           if (this.friends.length !== 0) {
              this.mapfriends(this.users, this.friends)
          //    this.booleanUser = true
          //  }
          }
        })


        this.userService.friendList(this.userId).subscribe(friends => {

          this.friends = friends
          //console.log("send from friendList")
          //if (this.booleanFriend === false) {
           if (this.users.length !== 0) {
              this.mapfriends(this.users, this.friends);
          //    this.booleanFriend = true
          //    this.booleanUser = false
          //  }
          }
        })

      })

  }

  private mapfriends(users, friends) {
    console.log(friends)
    console.log(users)
    this.idFriendsStocke = []
    this.isFriendsStocke = []

    friends.map((friend, index) => {

      console.log(friend)
      this.idFriendsStocke[index] = friend.id
      this.isFriendsStocke[index] = friend.isFriend
    })


    this.users = users.map((user) => {
      //console.log(this.idFriendsStocke)
      if (this.idFriendsStocke.indexOf(user.id) > -1) {
        user.isFriend = this.isFriendsStocke[this.idFriendsStocke.indexOf(user.id)]

      }
      else {
        user.isFriend = "false"

      }


    })
    console.log(users)
    this.users = users
  }

  ngOnInit() {


    //this.userService.getUserList().subscribe(users => {
    //  //
    //  console.log(users)
    //  users.map(user => {
    //
    //    //console.log(user.id)
    //    //console.log(self.usersFriends)
    //    if (this.idFriendsStocke.indexOf(user.id) > -1) {
    //      let index = this.idFriendsStocke.indexOf(user.id)
    //      user.details = this.usersFriends[index].isFriend
    //      //user.details = false
    //
    //    }
    //    else {
    //      user.details = "false"
    //    }
    //  })
    //  console.log(users)
    //  this.userNameListFilter = users
    //  //this.zone.run(() => {
    //  //  this.userNameListFilter = users
    //  // });
    //})

  }


  // friendList(id: string) {
  //   return this.usersCollection.doc(id).collection("amis").snapshotChanges().pipe(
  //     map(actions => {
  //       return actions.map(a => {
  //         const data = a.payload.doc.data() as friendUserType;
  //         const id = a.payload.doc.id;
  //         return { id, ...data };
  //       });
  //     })
  //   );
  // }


  // getUserList() {
  //   return this.usersCollection.snapshotChanges().pipe(
  //     map(actions => {
  //       return actions.map(a => {
  //         const data = a.payload.doc.data();
  //         const id = a.payload.doc.id;
  //         return { id, ...data };
  //       });
  //     })
  //   );
  // }

  // ngOnInit() {
  //   let self = this
  //   this.userService.getCurrentUser().then(function (user) {
  //     //console.log(user)
  //     self.userId = user.uid
  //   })
  //     .then(() => {
  //       //console.log(this.userId)
  //       this.userService.getUserById(this.userId).subscribe(user => {
  //         //console.log(user)
  //         this.userName = user.payload.data().displayName
  //       })
  //     }).then(() => {
  //       this.userService.friendList(this.userId).subscribe((friends) => {  // renvoie tableau is friend true or false
  //         console.log(friends)
  //         //console.log(friends)
  //         //console.log(friends)
  //         //console.log("TEST msg")
  //         friends.map(friend => {
  //           if(friend.isFriend === "true"){
  //             this.idFriends.push(friend.id);
  //           }
  //           else{
  //             if(friend.isFriend === "pending"){
  //               this.idPendingFriends.push(friend.id)
  //             }
  //             if(friend.isFriend === "wantAdd"){
  //               this.wantAddFriend.push(friend.id)
  //             }
  //           }

  //         })
  //         friends.map(friend => {
  //           if (friend.isFriend === "true") {
  //             self.userService.getUserById(friend.id).subscribe(data => {          // renvoie tableau avatar displayName etc amis utilisateur SEULEMENT
  //               if(self.idFriendsStocke.indexOf(data.payload.data().id) > -1){   // Si l'élément entrant est déja présent dans le tablea
  //                 let indexARemplacer = (self.idFriendsStocke.indexOf(data.payload.data().id))    // On remplace l'élément car celui ci est mis à jour (ONline / Offline)
  //                 self.usersFriends[indexARemplacer] = data.payload.data()
  //               }
  //               else{ 
  //                 this.idFriendsStocke.push(data.payload.data().id)
  //                 self.usersFriends.push({ ...data.payload.data() })
  //               }

  //             })
  //           }
  //         })

  //       })
  //     }).then(() => {
  //       //console.log(this.idFriends)
  //       this.userService.getUserList().subscribe((users) => {                // renvoie tous les utilisateurs de la bdd
  //         console.log
  //         this.userNameListFilter = users
  //         self.users = users

  //         this.userNameListFilter.map(friend => {                            // Compare amis BDD avec la liste des users ! 
  //           //console.log(friend)
  //           if (this.idFriends.indexOf(friend.id) > -1) {
  //             friend.canBeAdded = false
  //             friend.isDoingAdded = false
  //             friend.wantAdd = false
  //             //console.log(friend.displayName + " est amis")
  //           }
  //           else {
  //             if(this.idPendingFriends.indexOf(friend.id) > -1){
  //               friend.canBeAdded = false
  //               friend.isDoingAdded = true
  //               friend.wantAdd = false
  //             }
  //             else{
  //               if(this.wantAddFriend.indexOf(friend.id) > -1){
  //                 friend.canBeAdded = false
  //                 friend.isDoingAdded = false
  //                 friend.wantAdd = true
  //               }
  //               else{
  //                 friend.canBeAdded = true
  //                 friend.isDoingAdded = false
  //                 friend.wantAdd = false
  //               }
  //             }
  //           }
  //         })

  //       })
  //     })
  // }

  getItems() {
    console.log(this.users)
    //console.log(this.userNameListFilter)
  }




  onSearchInput($event) {
    if ($event !== undefined) {
      this.event = $event
      this.userNameListFilter = []
      let valueInput = $event.detail.value
      this.userNameListFilter = this.users.filter(c => c.displayName.toLowerCase().indexOf(valueInput) > -1)
    }

  }
  entrerChatPrive(Id: string) {
    this.userService.entrerChatPrive(this.userId, Id)
  }


  addUserToChannel(id: string) {

    console.log(id)
  }

  acceptFriend(user: any) {
    user.isFriend = "true"
    let id = user.id
    this.userService.acceptFriend(this.userId, id)

  }
  callNotification() {
    this.localNotifications.schedule({
      id: 1,
      title: 'Messenger Ionic',
      text: "You've added a friend",
      sound: this.plt.is('android') ? 'file://sound.mp3' : 'file://beep.caf',
      vibrate: true
      //data: { secret: key }
    });
  }




  addfriend(user: any) {
    user.isFriend = "wantAdd"
    let idUserAAjouter = user.id
    this.userService.addFriendsToUsers(this.userId, idUserAAjouter)
    this.callNotification()
  }

  removeFriend(user: any) {
    console.log(user)
    user.isFriend = "false"

    this.userService.deniedFriend(this.userId, user.id)
  }

  refuseInvitation(user: any) {
    user.isFriend = "false"

    this.userService.deniedFriend(this.userId, user.id)
  }


  logout() {
    this.userService.logout()
  }


}
