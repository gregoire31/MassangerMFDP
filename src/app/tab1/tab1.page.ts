import { Component } from '@angular/core';
import { UserService } from '../service/user.service';
import { map, mergeMap, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
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
  idPendingFriends :any[]=[]
  wantAddFriend :any[]=[]
  idFriendsStocke:any[]=[]

  constructor(private userService: UserService, private localNotifications: LocalNotifications, public plt: Platform) {

  }

  ngOnInit() {
    let self = this
    this.userService.getCurrentUser().then(function (user) {
      //console.log(user)
      self.userId = user.uid
    })
      .then(() => {
        //console.log(this.userId)
        this.userService.getUserId(this.userId).subscribe(user => {
          //console.log(user)
          this.userName = user.payload.data().displayName
        })
      }).then(() => {
        this.userService.friendListe(this.userId).subscribe((friends) => {  // renvoie tableau is friend true or false
          //console.log(friends)
          //console.log(friends)
          //console.log("TEST msg")
          friends.map(friend => {
            if(friend.isFriend === "true"){
              this.idFriends.push(friend.id);
            }
            else{
              if(friend.isFriend === "pending"){
                this.idPendingFriends.push(friend.id)
              }
              if(friend.isFriend === "wantAdd"){
                this.wantAddFriend.push(friend.id)
              }
            }
            
          })
          friends.map(friend => {
            if (friend.isFriend === "true") {
              self.userService.getUserId(friend.id).subscribe(data => {          // renvoie tableau avatar displayName etc amis utilisateur SEULEMENT
                if(self.idFriendsStocke.indexOf(data.payload.data().id) > -1){   // Si l'élément entrant est déja présent dans le tablea
                  let indexARemplacer = (self.idFriendsStocke.indexOf(data.payload.data().id))    // On remplace l'élément car celui ci est mis à jour (ONline / Offline)
                  self.usersFriends[indexARemplacer] = data.payload.data()
                }
                else{ 
                  this.idFriendsStocke.push(data.payload.data().id)
                  self.usersFriends.push({ ...data.payload.data() })
                }
                
              })
            }
          })

        })
      }).then(() => {
        //console.log(this.idFriends)
        this.userService.getUserList().subscribe((users) => {                // renvoie tous les utilisateurs de la bdd
          this.userNameListFilter = users
          self.users = users

          this.userNameListFilter.map(friend => {                            // Compare amis BDD avec la liste des users ! 
            //console.log(friend)
            if (this.idFriends.indexOf(friend.id) > -1) {
              friend.canBeAdded = false
              friend.isDoingAdded = false
              friend.wantAdd = false
              //console.log(friend.displayName + " est amis")
            }
            else {
              if(this.idPendingFriends.indexOf(friend.id) > -1){
                friend.canBeAdded = false
                friend.isDoingAdded = true
                friend.wantAdd = false
              }
              else{
                if(this.wantAddFriend.indexOf(friend.id) > -1){
                  friend.canBeAdded = false
                  friend.isDoingAdded = false
                  friend.wantAdd = true
                }
                else{
                  friend.canBeAdded = true
                  friend.isDoingAdded = false
                  friend.wantAdd = false
                }
              }
            }
          })

        })
      })
  }

  getItems() {
    console.log(this.userNameListFilter)
  }

  onSearchInput($event) { 
    if ($event !== undefined) {
      this.event = $event
      this.userNameListFilter = []
      let valueInput = $event.detail.value
      this.userNameListFilter = this.users.filter(c => c.displayName.toLowerCase().indexOf(valueInput) > -1)
    }

  }


  addUserToChannel(id: string) {

    console.log(id)
  }

  acceptFriend(user: any) {
    let id = user.id
    this.userService.acceptFriend(this.userId, id)
    user.canBeAdded = false
    user.isDoingAdded = false
    user.wantAdd = false

    //this.userService.getUserList().subscribe((users) => {                // renvoie tous les utilisateurs de la bdd
    //  this.userNameListFilter = users
//
    //  this.userNameListFilter.map(friend => {
    //    console.log(friend)
    //    if (this.idFriends.indexOf(friend.id) > -1) {
    //      friend.canBeAdded = false
    //      friend.isDoingAdded = false
    //      console.log(friend.displayName + " est amis")
    //    }
    //    else {
    //      if(this.idPendingFriends.indexOf(friend.id) > -1){
    //        friend.canBeAdded = false
    //        friend.isDoingAdded = true
    //      }
    //      else{
    //        friend.canBeAdded = true
    //        friend.isDoingAdded = false
    //      }
    //    }
    //  })
//
//
    //})


    //this.userService.friendListe(this.userId).subscribe(newFriendsPending => {
    //  if (newFriendsPending !== undefined) {
    //    this.userService.getUserId(newFriendsPending.id).subscribe(data => {
    //      console.log(data)
    //      this.usersFriendPending.push({ ...data })
    //    })
    //  }
    //  console.log(newFriendsPending)
    //})
  }
  callNotification(){
    this.localNotifications.schedule({
      id: 1,
      title: 'Messenger Ionic',
      text: "You've added a friend",
      sound: this.plt.is('android')? 'file://sound.mp3': 'file://beep.caf',
      vibrate: true
      //data: { secret: key }
    });
  }




  addfriend(user: any) {
    let idUserAAjouter = user.id
    user.canBeAdded = false
    user.wantAdd = true
    //console.log(idUserAAjouter)
    // console.log(this.userNameListFilter)
    // let self = this
    let verification = false
     this.userService.addFriendsToUsers(this.userId, idUserAAjouter)
     this.callNotification()
    // console.log("toto")
    // this.userService.getUserList().subscribe((users) => {                // renvoie tous les utilisateurs de la bdd
      // this.userNameListFilter = users
// 
      // this.userNameListFilter.map(friend => {
        // console.log(friend)
        // if (this.idFriends.indexOf(friend.id) > -1) {
          // friend.canBeAdded = false
          // friend.isDoingAdded = false
          // console.log(friend.displayName + " est amis")
        // }
        // else {
          // if(this.idPendingFriends.indexOf(friend.id) > -1){
            // friend.canBeAdded = false
            // friend.isDoingAdded = true
          // }
          // else{
            // friend.canBeAdded = true
            // friend.isDoingAdded = false
          // }
        // }
      // })
// 
// 
    // })

     //this.userService.friendListe(idUserAAjouter).subscribe(listeAmis => {   // renvoie la liste des amis d'un user passer en paramètre
     //  listeAmis.map(ami => {
     //    console.log(ami)
     //    if (ami.id === this.userId) {
     //      verification = true
     //      console.log("ça match")
     //      this.userService.acceptFriend(this.userId, idUserAAjouter)
     //      //return this.friendListe(idCurrentUser)                           // renvoie la liste des amis d'un user passer en paramètre
     //    }
     //  })
     //  if (verification === false) {
     //    console.log("n'a pas matché")
     //    this.userService.addFriendsToUsers(this.userId, idUserAAjouter)
     //  }
     //})

    //const friendList: Observable<boolean | void> = this.userService.friendListe(idUserAAjouter).pipe(
    //  mergeMap(friends => friends),
    //  map(friend => {
    //    console.log(friend);
//
    //    if (friend.id === this.userId) {
    //      verification = true;
    //      this.userService.acceptFriend(this.userId, idUserAAjouter);
    //    }
    //  }),
    //  finalize(() => {
    //    if (verification) return true;
    //    return false; 
    //  })
    //);
    //friendList.subscribe(verif => verif ? this.userService.addFriendsToUsers(this.userId, idUserAAjouter) : null);  
  }

  removeFriend(user: any) {

    user.canBeAdded = true
    user.isDoingAdded = false
    user.wantAdd = false

    this.userService.deniedFriend(this.userId, user.id)
    console.log(this.userNameListFilter)
  }


  logout() {
    this.userService.logout()
  }


}
