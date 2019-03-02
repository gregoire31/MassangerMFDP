import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../service/user.service';

interface Message {
  id : string,
  idUser : string,
  message : string
}

@Component({
  selector: 'app-text-message',
  templateUrl: './text-message.page.html',
  styleUrls: ['./text-message.page.scss'],
})


export class TextMessagePage implements OnInit {
  channelId: string
  channelName : string
  channel : any
  textMsg : string
  userId : string
  messages : any
  avatar : string
  numberResult : number = 20
  constructor(public activatedRoute: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    let self = this
    this.channelId = this.activatedRoute.snapshot.paramMap.get('channelId');
    this.userService.returnDetailsChannel(this.channelId).subscribe((channel)=> {
      //self.channelName = channel.name 
      self.channel = channel
    })
    this.userService.getCurrentUser().then(function (user) {
      console.log(user)
      self.avatar = user.photoURL
      self.userId = user.uid
    })

    this.userService.listeAllMessageOfAChannel(this.channelId,this.numberResult).subscribe((data)=>{
      this.messages = data
      //data.map(message => {
      //  //console.log(message.date)
      //})
      //console.log(data)
    })
  }

  listerLesMessages(){
    this.userService.listeAllMessageOfAChannel(this.channelId,this.numberResult).subscribe((data)=>{
      this.messages = data
    })
  }

  loadData(event) {
    //setTimeout(() => {
    //  this.numberResult = this.numberResult + 20
    //  console.log('Done');
    //  event.target.complete();
//
    //  this.userService.listeAllMessageOfAChannel(this.channelId,this.numberResult).subscribe((data)=>{
    //    this.messages = data
    //    data.map(message => {
    //      console.log(message.date)
    //    })
    //    console.log(data)
    //  })
//
//
    //  // App logic to determine if all data is loaded
    //  // and disable the infinite scroll
    //  if (this.messages.length == 4) {
    //    event.target.disabled = true;
    //  }
    //}, 500);
  }



  compareDate() {
    //console.log(this.messages[0].date.compareTo(this.messages[1].date))
  }


  TextSubmit(){
    if(this.numberResult === this.messages.length)
    console.log(this.channelId)
    let date = new Date();

    this.userService.addMessageToChannel(this.channelId,this.userId,this.textMsg,date,this.avatar)
  }

}
