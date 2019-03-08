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
  nameChannel : string
  users : any
  userFriends : any[]=[]
  constructor(public activatedRoute: ActivatedRoute, private userService : UserService) {
  }

  //returnDetailsChannel(id : string){
  //  return this.channelCollection.doc(id).valueChanges()
  //}

  

  ngOnInit() {
    let self = this

    //this.channelId = this.activatedRoute.snapshot.paramMap.get('channelId');
    //console.log(this.channelId)
    this.userService.getCurrentUser().then(function(user)  {
      self.userId = user.uid
      return user.uid
    }).then((userId)=>{
      this.userService.getUserId(userId).subscribe((user)=> {
        this.userDisplayName = user.displayName
      })
      //console.log(userId)
    }).then(() => {

      this.userService.friendListe(this.userId).subscribe( (users) =>{
        users.map(user => {
          this.userService.getUserId(user.id).subscribe(user => {
            this.userFriends.push(user)
          })
        })
        //self.users = users
        //users.map(user => {
        //  console.log(user)
        //})
      })


      //this.userService.getUserList().subscribe( (users) =>{
      //  console.log(users)
      //  self.users = users
      //  users.map(user => {
      //    console.log(user)
      //  })
      //})
    })
  }



  crerNewChannel(){
    this.userService.createChannel(this.userId,this.nameChannel).then((channelId) => {
      //let channelIdString = stringify(channelId)
      //console.log(channelIdString)
      let channelIdString = String(channelId)
      this.userFriends.map(user => {
        console.log(user)
        
        if(user.isChecked === true){
          console.log(user)
          this.userService.addUserToChannel(channelIdString,user.id,this.nameChannel)
          this.userService.addChannelToUser(user.id,channelIdString,this.nameChannel)
        }
      })
      this.userService.navigateTo(`app/tabs/textMessage/${channelId}`)
    })
  }

}
