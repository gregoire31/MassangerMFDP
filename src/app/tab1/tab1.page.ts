import { Component } from '@angular/core';
import { UserService } from '../service/user.service';
import { map, mergeMap, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
  usersFriendPending: any[] = []
  idPendingFriends :any[]=[]

  constructor(private userService: UserService) {

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
          this.userName = user.displayName
        })
      }).then(() => {
        this.userService.friendListe(this.userId).subscribe((friends) => {  // renvoie tableau is friend true or false
          console.log(friends)
          console.log("TEST msg")
          friends.map(friend => {
            if(friend.isFriend === true){
              this.idFriends.push(friend.id);
            }
            else{
              this.idPendingFriends.push(friend.id)
            }
          })
          self.usersFriends = []
          friends.map(friend => {
            if (friend.isFriend === true) {
              self.userService.getUserId(friend.id).subscribe(data => {          // renvoie tableau avatar displayName etc ...
                console.log(data)
                self.usersFriends.push({ ...data })
              })
            }
          })

        })
      }).then(() => {
        console.log(this.idFriends)
        this.userService.getUserList().subscribe((users) => {
          this.userNameListFilter = users
          self.users = users

          this.userNameListFilter.map(friend => {
            console.log(friend)
            if (this.idFriends.indexOf(friend.id) > -1) {
              friend.canBeAdded = false
              friend.isDoingAdded = false
              console.log(friend.displayName + " est amis")
            }
            else {
              if(this.idPendingFriends.indexOf(friend.id) > -1){
                friend.canBeAdded = false
                friend.isDoingAdded = true
              }
              else{
                friend.canBeAdded = true
                friend.isDoingAdded = false
              }
            }
          })


          //self.userNameListFilter = users
          //users.map(user => {
          //  console.log(user.id)          
          //})
        })
      }).then(() => {
        this.userService.friendListe(this.userId).subscribe((friendsPending) => {
          friendsPending.map(friendPending => {
            this.userService.getUserId(friendPending.id).subscribe(data => {
              this.usersFriendPending.push({ ...data })
            })
          })

        })
      })
  }

  getItems() {
    console.log("Salut tout le monde")
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

  acceptFriend(id: string) {
    this.usersFriendPending = []
    this.userService.acceptFriend(this.userId, id)
    this.userService.friendListe(this.userId).subscribe(newFriendsPending => {
      if (newFriendsPending !== undefined) {
        this.userService.getUserId(newFriendsPending.id).subscribe(data => {
          console.log(data)
          this.usersFriendPending.push({ ...data })
        })
      }
      console.log(newFriendsPending)
    })
  }



  addfriend(idUserAAjouter: string) {
    console.log(idUserAAjouter)
    //let verification = false
    this.userService.addFriendsToUsers(this.userId, idUserAAjouter)
    

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


  logout() {
    this.userService.logout()
  }


}
