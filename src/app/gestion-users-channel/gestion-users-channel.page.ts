import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gestion-users-channel',
  templateUrl: './gestion-users-channel.page.html',
  styleUrls: ['./gestion-users-channel.page.scss'],
})
export class GestionUsersChannelPage implements OnInit {

  userId: string
  userIdAdmin: boolean = false
  usersFriends: any[] = []
  usersFriendsAddable: any[] = []
  channelId: string
  usersId: any[] = []
  usersAddable: any[] = []
  idUserAStocke: any[] = []
  channelName: string = ""
  idUtilisateurChannel: any[] = []
  idTries: any[] = []
  idAAjouter: any[] = []
  tableauFinal: any[] = []
  constructor(private userService: UserService, public activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    let self = this
    this.userService.getCurrentUser().then(function (user) {
      self.userId = user.uid
    })
      .then(() => {

        let isAdmin = false
        let isRemovable: boolean
        this.channelId = this.activatedRoute.snapshot.paramMap.get('channelId');
        this.userService.returnDetailsChannel(this.channelId).subscribe((channel) => {
          self.channelName = channel.name
          //self.channel = channel
          //console.log(channel)

        })
        this.userService.getRoleofUser(this.userId, this.channelId).subscribe(role => {
          //console.log(role)
          isAdmin = role.isAdmin
          if (role.isAdmin) {
            this.userIdAdmin = true
          }


        })
        this.userService.friendList(this.userId).subscribe(friends => {
          let i = 0
          friends.map(friend => {
            if (friend.isFriend === "true") {
              this.idUserAStocke[i] = friend.id
              i++
            }
          })
          this.userService.listeAllUsersOfChannels(this.channelId).subscribe(users => {
            users.map((user, index) => {
              //console.log(users)
              this.idUtilisateurChannel[index] = user.id
            })
            let i = 0
            let u = 0
            this.idTries = []
            this.idAAjouter = []
            this.tableauFinal = []
            this.idUserAStocke.map(friend => {
              //console.log(friend.id)
              if (this.idUtilisateurChannel.indexOf(friend) > -1) { // friend et userId présent dans le channel
                //console.log(friend)
                this.idTries[i] = friend
                i++
              }
              else {
                //console.log(friend)
                this.idAAjouter[u] = friend
                u++
              }
            })
            //console.log(this.idTries)
            //console.log(this.idAAjouter)
            this.tableauFinal = this.idTries.concat(this.idAAjouter)
            //console.log(this.tableauFinal)
            //console.log(i)
            let v = 0
            let x = 0
            this.tableauFinal.map((idUserFinal, index) => {
              if (index < i) {
                this.userService.getUserById(idUserFinal).subscribe(data => {
                  console.log(data.payload.data())
                  this.usersFriends[v] = data.payload.data()
                  v++
                })
              }
              else {
                this.userService.getUserById(idUserFinal).subscribe(data => {
                  this.usersFriendsAddable[x] = data.payload.data()
                  x++
                })
              }
              //this.usersFriends.map(user => {
              //  console.log(user)
              //})
            })
            console.log(this.usersFriends)
            console.log(this.usersFriendsAddable)




          })

        })




        //new Promise(resolve => {
        //  this.userService.friendList(this.userId).subscribe(friends => {
        //
        //    let i = 0
        //    let u = 0
        //
        //    friends.map(friend => {
        //      if (friend.isFriend === "true") {
        //        this.idUserAStocke[i] = friend.id
        //        i++
        //
        //      }
        //      u++
        //      if (u === friends.length) {
        //
        //        resolve(this.idUserAStocke)
        //      }
        //
        //
        //
        //    })
        //  })
        //
        //}).then(data => {
        //  this.userService.listeAllUsersOfChannels(this.channelId).subscribe(users => {
        //    console.log("pouki")
        //    let i = 0
        //    let u = 0
        //    let idUtilisateurChannel = []
        //    let idTries = []
        //    let idAAjouter = []
        //    let x = 0
        //    let v = 0
        //    users.map((user, index) => {
        //      console.log(users)
        //      idUtilisateurChannel[index] = user.id
        //    })
        //    //console.log(idUtilisateurChannel)
        //
        //    //console.log(data)
        //    let friendsListeOfCurrentUser = data as Array<any>
        //    //console.log(users)
        //    friendsListeOfCurrentUser.map(friend => {
        //      //console.log(friend.id)
        //      if (idUtilisateurChannel.indexOf(friend) > -1) {
        //        //console.log(friend)
        //        idTries[i] = friend
        //        i++
        //      }
        //      else {
        //        //console.log(friend)
        //        idAAjouter[u] = friend
        //        u++
        //      }
        //    })
        //
        //    users.map(user => {
        //      if (idTries.indexOf(user.id) > -1) {
        //        idTries[idTries.indexOf(user.id)] = user
        //      }
        //    })
        //
        //    let tableauFinal = idTries.concat(idAAjouter)
        //    console.log(tableauFinal)
        //    let longeurUserPresentDansLeChannel = idTries.length
        //    console.log(longeurUserPresentDansLeChannel)
        //
        //    tableauFinal.map((user, index) => {
        //      console.log(user, index)
        //      if (index < longeurUserPresentDansLeChannel) {
        //        this.userService.getUserById(user.id).subscribe(data => {
        //
        //          if (isAdmin) {
        //            isRemovable = true
        //          }
        //          else {
        //            isRemovable = false
        //          }
        //
        //          let dato = data.payload.data()
        //          //this.usersId[i] = data.payload.id
        //          //console.log(dato)
        //          this.usersFriends[x] = { dato, isRemovable }
        //          console.log(this.usersFriends)
        //          //console.log(this.usersFriends)
        //          //self.usersFriends.push({dato,isRemovable})
        //          x++
        //          if (x === users.length - 1) {
        //            console.log(this.usersFriends)
        //          }
        //
        //        })
        //      }
        //      else {
        //        this.userService.getUserById(user).subscribe(data => {
        //          this.usersFriendsAddable[v] = data.payload.data()
        //          v++
        //        })
        //      }
        //    })
        //
        //
        //
        //  })
        //
        //})
      })
  }




  recupId(user: any) {
    console.log(user.id)
  }

  ajouteFrienddsToChannel(user) {
    this.usersFriendsAddable.map(userAAjouter => {

      this.usersFriendsAddable.splice(this.usersFriendsAddable.indexOf(userAAjouter), 1)
    })
    this.userService.addUserToChannel(this.channelId, user.id, this.channelName)
    this.userService.addChannelToUser(user.id, this.channelId, this.channelName)


  }


  removeuserChannel(user: any) {
    this.usersFriends.splice(this.usersFriends.indexOf(user), 1)
    this.userService.removeUserFromChannel(user.dato.id, this.channelId)
  }
  deleteChannel() {
    this.userService.deleteChannel(this.channelId)
    this.userService.navigateTo(`app/tabs/tab2`);
  }
  setAdmin(user: any) {
    console.log(user)
    this.userService.changeAdminModeUser(this.channelId, user.dato.id)
  }

  navigateByUrlTxt() {
    this.userService.navigateTo(`app/tabs/textMessage/${this.channelId}`);
  }

}
