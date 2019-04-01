import { Component } from '@angular/core';
import { UserService } from '../service/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  users : any
  userName : string
  avatar : string
  userId : string
  //userName = "toto"
  channelName: string
  displayName : string
  userList : any
  channels : any
  test : any

  constructor(private userService : UserService, public activatedRoute: ActivatedRoute) {
    this.userService.getUserList().subscribe( (users) =>{
      this.userList = users
    })



   }

   ngOnInit() {
    let self = this
    
    this.userService.getCurrentUser().then(function (user) {
      self.userId = user.uid
    }).then(() => {
      this.userService.getUserById(this.userId).subscribe(user => {
        this.avatar = user.payload.data().avatar
        this.displayName = user.payload.data().displayName
        self.users = user
      })
    }
    ).then(() => {
      let self = this
      this.test = this.userService.returnListChannelOfCurrentUser(this.userId).subscribe(function(channels){
        self.channels = channels
        //let selfe = self
        //channels.map(channel => {
        //  let selfi = selfe
        //  console.log(channel.id)
        //  let stringifyIDChannel = channel.id.length
        //  if (stringifyIDChannel < 21){
        //    console.log(channel)
        //    selfi.channels.push(channel)
        //  }
        //})
        //self.channels = channels
      })
    })

  }

  //createChannel() {
  //  this.userService.createChannel(this.userId, this.channelName)
  //}
  //navigateByUrl(id : string){
  //  this.userService.navigateTo(`app/tabs/channelCreate/${id}`);
  //}

  navigateByUrl(){
    this.userService.navigateTo(`newChannelCreate`);
  }
  navigateByUrlTxt(id : string){
    this.userService.navigateTo(`textMessage/${id}`);
  }

  deleteChannel(channel){
    this.userService.removeChannel(channel.id,true)
  }


  //<ion-button href="/app/tabs/channelCreate/{{channel.id}}">ouvre nouveau channel</ion-button>

}
