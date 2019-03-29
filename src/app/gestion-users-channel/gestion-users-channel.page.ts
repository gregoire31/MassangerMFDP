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
  tableauId : any[] = []
  tableauIdAddable : any[] = []
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
          console.log("j'apelle friends : " + friends)
          let i = 0
          friends.map(friend => {
            if (friend.isFriend === "true") {
              this.idUserAStocke[i] = friend.id
              i++
            }
          })
          this.userService.listeAllUsersOfChannels(this.channelId).subscribe(users => {
            console.log(users)
            console.log("j'apelle liste user channel  : " + users)
            users.map((user, index) => {
              //console.log(users)
              this.idUtilisateurChannel[index] = user.id
              //console.log(index)
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
            //console.log(this.idTries)
            //console.log(this.idAAjouter)
            //console.log(this.tableauFinal)
            //console.log(i)
            let v = 0
            let x = 0
            //console.log("toto")
            this.idTries.map(friends => {

              this.userService.getUserById(friends).subscribe(friend => {
                this.usersFriends.map(user => {
                  if(!this.tableauId.includes(user.id)){
                    this.tableauId.push(user.id)
                  }
                })
                if(this.tableauId.includes(friend.payload.data().id)){

                }else{
                  this.usersFriends.push(friend.payload.data())
                }
                console.log(this.usersFriends)
                //console.log(friend.payload.data().id)
                //console.log(this.usersFriends)
                ////if(this.idTries.indexOf())
                //if (this.usersFriends.indexOf(friend.payload.data().id) > -1){
                //  
                //}
                //else{
                //  this.usersFriends[v] = friend.payload.data()
                //  v++
                //}
                //console.log(friend.payload.data())
                //console.log(this.idTries)
                //
                //console.log(this.usersFriends)
              })
            })

            this.idAAjouter.map(friends => {

              this.userService.getUserById(friends).subscribe(friend => {
                this.usersFriendsAddable.map(user => {
                  if(!this.tableauIdAddable.includes(user.id)){
                    this.tableauIdAddable.push(user.id)
                  }
                })
                if(this.tableauIdAddable.includes(friend.payload.data().id)){
                  
                }else{
                  this.usersFriendsAddable.push(friend.payload.data())
                }
                  console.log(this.usersFriendsAddable)
                //console.log(friend.payload.data().id)
                //console.log(this.usersFriends)
                ////if(this.idTries.indexOf())
                //if (this.usersFriends.indexOf(friend.payload.data().id) > -1){
                //  
                //}
                //else{
                //  this.usersFriends[v] = friend.payload.data()
                //  v++
                //}
                //console.log(friend.payload.data())
                //console.log(this.idTries)
                //
                //console.log(this.usersFriends)
              })
            })

            //this.idAAjouter.map(friends => {
            //  this.userService.getUserById(friends).subscribe(friend => {
            //    this.usersFriendsAddable[v] = friend
            //    v++
            //  })
            //})
            //this.usersFriends = []
            //this.usersFriendsAddable = []
            //this.tableauFinal.map((idUserFinal, index) => {
            //  if (index < i) {
            //    this.userService.getUserById(idUserFinal).subscribe(data => {
//
            //      console.log(data.payload.data())
            //      this.usersFriends[v] = data.payload.data()
            //      v++
            //    })
            //  }
            //  else {
            //    this.userService.getUserById(idUserFinal).subscribe(data => {
            //      this.usersFriendsAddable[x] = data.payload.data()
            //      x++
            //    })
            //  }
            //  this.usersFriends.map(user => {
            //    console.log(user)
            //  })
            //})
            //let toto = new Promise [""]
            //this.tableauFinal.map(async (idUserFinal, index) => {
            //  // await this.userService.getUserById1(idUserFinal,(err,res)=>{
            //  //   console.log(res)
            //  //   this.usersFriends[index]= res;
            //  // })
            //    this.userService.getUserById(idUserFinal).subscribe(data => {
            //     console.log(data.payload.data())
            //     this.usersFriends[index] = data.payload.data()
            //     v++
            //    })
 //
            //  })
            
              //this.usersFriends.map(user => {
              //  console.log(user)
              //
            





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



  test(){
    console.log(this.usersFriends)
    console.log(this.usersFriendsAddable)
  }
  recupId(user: any) {
    console.log(user.id)
  }

  ajouteFrienddsToChannel(user) {
    this.idAAjouter.splice(this.idAAjouter.indexOf(user.id),1)
    this.idTries.push(user.id)
    this.usersFriendsAddable.splice(user)
    this.usersFriends.push(user)
    //this.usersFriendsAddable.map(userAAjouter => {
//
    //  this.usersFriendsAddable.splice(this.usersFriendsAddable.indexOf(userAAjouter), 1)
    //})
    this.userService.addUserToChannel(this.channelId, user.id, this.channelName)
    this.userService.addChannelToUser(user.id, this.channelId, this.channelName)

  }

  removeuserChannel(user: any) {
    this.idTries.splice(this.idAAjouter.indexOf(user.id),1)

    this.idAAjouter.push(user.id)
    
    this.usersFriends.splice(this.usersFriends.indexOf(user), 1)

    this.usersFriendsAddable.push(user)

    this.userService.removeUserFromChannel(user.id, this.channelId)
  }
  deleteChannel() {
    this.userService.deleteChannel(this.channelId)
    this.userService.navigateTo(`app/tabs/tab2`);
  }
  setAdmin(user: any) {
    console.log(user)
    this.userService.changeAdminModeUser(this.channelId, user.id)
  }

  navigateByUrlTxt() {
    this.userService.navigateTo(`app/tabs/textMessage/${this.channelId}`);
  }

}
