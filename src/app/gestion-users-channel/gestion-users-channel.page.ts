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
          console.log(channel)

        })
        this.userService.getRoleofUser(this.userId, this.channelId).subscribe(role => {
          console.log(role)
          isAdmin = role.isAdmin
          if (role.isAdmin) {
            this.userIdAdmin = true
          }
          

        })
        new Promise(resolve => {
          this.userService.friendList(this.userId).subscribe(friends => {
            //console.log(`longeur data : ${friends.length}`)
            //console.log(friends)
            let i = 0
            let u = 0
            //this.friendsListe = friends
            friends.map(friend => {
              if (friend.isFriend === "true") {
                //console.log(friend)
                this.idUserAStocke[i] = friend.id
                i++
                //console.log('u = ' + u)
                //if(u === friends.length -1){
                //  
                //  console.log("OKI")
                //}
              }
              u++
              if (u === friends.length) {

                resolve(this.idUserAStocke)
              }



            })
          })
        }).then(data => {
          this.userService.listeAllUsersOfChannels(this.channelId).subscribe(users => {
            console.log("pouki")
            let i = 0
            let u = 0
            let idUtilisateurChannel = []
            let idTries = []
            let idAAjouter = []
            let x = 0
            let v = 0
            users.map((user, index) => {
              console.log(users)
              idUtilisateurChannel[index] = user.id
            })
            //console.log(idUtilisateurChannel)

            //console.log(data)
            let friendsListeOfCurrentUser = data as Array<any>
            //console.log(users)
            friendsListeOfCurrentUser.map(friend => {
              //console.log(friend.id)
              if (idUtilisateurChannel.indexOf(friend) > -1) {
                //console.log(friend)
                idTries[i] = friend
                i++
              }
              else {
                //console.log(friend)
                idAAjouter[u] = friend
                u++
              }
            })

            users.map(user => {
              if (idTries.indexOf(user.id) > -1) {
                idTries[idTries.indexOf(user.id)] = user
              }
            })

            let tableauFinal = idTries.concat(idAAjouter)
            console.log(tableauFinal)
            let longeurUserPresentDansLeChannel = idTries.length
            console.log(longeurUserPresentDansLeChannel)
            //console.log(idTries)
            //console.log(idAAjouter)
            //users.map(utilisateurDansChannel => {
            //  console.log(utilisateurDansChannel.id)
            //  if(friendsListeOfCurrentUser.indexOf(utilisateurDansChannel.id) > -1 ){
            //    console.log(utilisateurDansChannel.id)
            //  }
            //  else{
            //    console.log(utilisateurDansChannel)
            //  }
            //})
            //let i = 0
            //this.usersFriends = []
            //this.usersId = []
            //
            tableauFinal.map((user, index) => {
              console.log(user, index)
              if (index < longeurUserPresentDansLeChannel) {
                this.userService.getUserById(user.id).subscribe(data => {

                  if (isAdmin) {
                    isRemovable = true
                  }
                  else {
                    isRemovable = false
                  }

                  let dato = data.payload.data()
                  //this.usersId[i] = data.payload.id
                  //console.log(dato)
                  this.usersFriends[x] = { dato, isRemovable }
                  console.log(this.usersFriends)
                  //console.log(this.usersFriends)
                  //self.usersFriends.push({dato,isRemovable})
                  x++
                  if (x === users.length - 1) {
                    console.log(this.usersFriends)
                  }

                })
              }
              else {
                this.userService.getUserById(user).subscribe(data => {
                  this.usersFriendsAddable[v] = data.payload.data()
                  v++
                })
              }
            })



          })

        })
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
