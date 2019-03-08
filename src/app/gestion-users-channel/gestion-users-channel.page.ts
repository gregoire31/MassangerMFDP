import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gestion-users-channel',
  templateUrl: './gestion-users-channel.page.html',
  styleUrls: ['./gestion-users-channel.page.scss'],
})
export class GestionUsersChannelPage implements OnInit {

  userId : string
  userIdAdmin : boolean = false
  usersFriends: any[] = []
  channelId : string

  constructor(private userService: UserService,public activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    let self = this
    this.userService.getCurrentUser().then(function (user) {
      self.userId = user.uid
    })
    .then(() => {
      let isAdmin = false
      let isRemovable : boolean
      this.channelId = this.activatedRoute.snapshot.paramMap.get('channelId');
      this.userService.getRoleofUser(this.userId,this.channelId).subscribe(role => {
        isAdmin = role.isAdmin
        if(role.isAdmin){
          this.userIdAdmin = true
        }
      })
      this.userService.listeAllUsersOfChannels(this.channelId).subscribe(users => {
        console.log(users)
        users.map(user => {
          this.userService.getUserId(user.id).subscribe( data => {
            if(isAdmin){
              isRemovable = true
            }
            else{
              isRemovable = false
            }
            if(this.userId !== data.id){
              this.usersFriends.push({data,isRemovable})
            }
          })
        })
        
      })
    })
  }

  removeuserChannel(user: any) {

    this.userService.removeUserFromChannel(user.id, this.channelId)
    //console.log(this.userNameListFilter)
  }

  navigateByUrlTxt(){
    this.userService.navigateTo(`app/tabs/textMessage/${this.channelId}`);
  }

  testos() {
    console.log(this.usersFriends)
  }




}
