import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { ActivatedRoute } from '@angular/router';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-gestion-users-channel',
  templateUrl: './gestion-users-channel.page.html',
  styleUrls: ['./gestion-users-channel.page.scss'],
})
export class GestionUsersChannelPage implements OnInit {

  userId: string
  inChannel : any[] = []
  inFriendList : any[] = []
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
        })
        this.userService.getRoleofUser(this.userId, this.channelId).subscribe(role => {
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
            this.idUtilisateurChannel=[];
            users.map((user, index) => {
              this.idUtilisateurChannel[index] = user.id
            })
            
            this.idAAjouter = [];
            this.tableauFinal = [].concat(this.idUtilisateurChannel);
            this.idUserAStocke.forEach(friendOfConnectedUser => {
              if (!this.idUtilisateurChannel.includes(friendOfConnectedUser)) {
                this.idAAjouter.push(friendOfConnectedUser);
              }
            });
            this.tableauFinal.map(id => {
              this.userService.getUserById(id).subscribe(friend => {
                if(this.usersFriends.filter(f=>f.id == friend.payload.data().id).length == 0){
                  if(this.userId != friend.payload.data().id){
                    this.usersFriends.push(friend.payload.data())
                  }
                }
              })
            })
            this.idAAjouter.map(id => {
              this.userService.getUserById(id).subscribe(friend => {
                if(this.usersFriendsAddable.filter(f=>f.id == friend.payload.data().id).length == 0){
                  this.usersFriendsAddable.push(friend.payload.data())
                }
              })
            })
          })
        })
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
    this.usersFriendsAddable.splice(user)
    this.usersFriends.push(user)
    this.userService.addUserToChannel(this.channelId, user.id, this.channelName)
    this.userService.addChannelToUser(user.id, this.channelId, this.channelName)
  }

  removeuserChannel(user: any) {
    this.usersFriends.splice(this.usersFriends.indexOf(user), 1)
    this.usersFriendsAddable.push(user)
    this.userService.removeUserFromChannel(user.id, this.channelId)
  }
  deleteChannel() {
    this.userService.deleteChannel(this.channelId)
    this.userService.navigateTo(`app/tabs/tab2`);
  }
  setAdmin(user: any) {
    this.userService.changeAdminModeUser(this.channelId, user.id)
    user.isAdmin = true
  }

  navigateByUrlTxt() {
    this.userService.navigateTo(`textMessage/${this.channelId}`);
  }
}
