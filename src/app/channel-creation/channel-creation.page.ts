import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-channel-creation',
  templateUrl: './channel-creation.page.html',
  styleUrls: ['./channel-creation.page.scss'],
})
export class ChannelCreationPage implements OnInit {

  channelId = null;
  user : any
  userId : string
  userDisplayName : string
  nameChannel : string = ""
  users : any
  userFriends : any[]=[]
  constructor(public activatedRoute: ActivatedRoute, private userService : UserService) {
  }
  

  ngOnInit() {
    let self = this
    this.userService.getCurrentUser().then(function(user)  {
      self.userId = user.uid
      return user.uid
    }).then((userId)=>{
      this.userService.getUserById(userId).subscribe((user)=> {
        this.userDisplayName = user.payload.data().displayName
      })
    }).then(() => {

      this.userService.friendList(this.userId).subscribe( (users) =>{
        let i = 0
        users.map((user) => {
          if(user.isFriend ==="true" && user.id !== this.userId){
            this.userService.getUserById(user.id).subscribe(user => {

              this.userFriends[i] = (user.payload.data())
              i++
              
            })
          }
        })
      })
    })
  }

  navigateToTab2() {
    this.userService.navigateTo("app/tabs/tab2")
  }

  crerNewChannel(){
    if(this.nameChannel === ""){
      this.userService.presentToastWithOptionsWithMessage("Nommez votre channel", "danger")
    }else{

      this.userService.createChannel(this.userId,this.nameChannel).then((channelId) => {
        let channelIdString = String(channelId)
        this.userFriends.map(user => {
          
          if(user.isChecked === true){
            this.userService.addUserToChannel(channelIdString,user.id,this.nameChannel)
            this.userService.addChannelToUser(user.id,channelIdString,this.nameChannel)
          }
        })
        this.userService.navigateTo(`textMessage/${channelId}`)
      })
    }
  }

}
