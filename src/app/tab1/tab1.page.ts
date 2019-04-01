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

    let self = this
    this.userService.getCurrentUser().then(function (user) {
      self.userId = user.uid
    })
      .then(() => {
        this.userService.getUserById(this.userId).subscribe(user => {

          this.userName = user.payload.data().displayName
        })
      }).then(() => {

        this.userService.getUserList().subscribe(users => {
           this.users = users
           if (this.friends.length !== 0) {
              this.mapfriends(this.users, this.friends)
          }
        })


        this.userService.friendList(this.userId).subscribe(friends => {

          this.friends = friends
           if (this.users.length !== 0) {
              this.mapfriends(this.users, this.friends);
          }
        })

      })

  }

  private mapfriends(users, friends) {
    this.idFriendsStocke = []
    this.isFriendsStocke = []
    
    if(friends.length !== 0){
      friends.map((friend, index) => {
        this.idFriendsStocke[index] = friend.id
        this.isFriendsStocke[index] = friend.isFriend
      })
    }


    this.users = users.map((user) => {
      if (this.idFriendsStocke.indexOf(user.id) > -1) {
        user.isFriend = this.isFriendsStocke[this.idFriendsStocke.indexOf(user.id)]

      }
      else {
        user.isFriend = "false"

      }


    })
    this.users = users
    this.userNameListFilter = users
  }

  ngOnInit() {



  }

  onSearchInput($event) {
    if ($event !== undefined) {
      this.event = $event
      this.userNameListFilter = []
      let valueInput = $event.detail.value
      valueInput = valueInput.toLowerCase()
      this.userNameListFilter = this.users.filter(c => c.displayName.toLowerCase().indexOf(valueInput) > -1)
    }

  }
  entrerChatPrive(Id: string) {
    this.userService.entrerChatPrive(this.userId, Id)
  }


  navigateToUSerList(){
    this.userService.navigateTo(`listUsers`)
  }

  acceptFriend(user: any) {
    user.isFriend = "true"
    let id = user.id
    this.userService.acceptFriend(this.userId, id)
    this.callNotification()

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
    
  }

  removeFriend(user: any) {
    user.isFriend = "false"

    this.userService.removeFriend(this.userId, user.id)
  }

  refuseInvitation(user: any) {
    user.isFriend = "false"

    this.userService.deniedFriend(this.userId, user.id)
  }



}
