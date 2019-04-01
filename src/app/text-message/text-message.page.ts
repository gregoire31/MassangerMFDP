import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../service/user.service';
import { Content } from 'ionic-angular';
import { Subject, Subscription } from 'rxjs';
//import {take} from 'rxjs/operators'
//import { IonInfiniteScroll } from '@ionic/angular';
//import { ThrowStmt } from '@angular/compiler';
//import Peer from 'simple-peer';

@Component({
  selector: 'app-text-message',
  templateUrl: './text-message.page.html',
  styleUrls: ['./text-message.page.scss'],
})

export class TextMessagePage implements OnInit {
  //@ViewChild(IonInfiniteScroll) infiniteScroll : IonInfiniteScroll;
  //@ViewChild(Content) contentArea: Content;
  recVideo: ElementRef
  peer : any
  srcObject: string
  isVideoChatting : Boolean = false
  
  time: number
  channelId: string
  channelName: string
  channel: any
  textMsg: string = ""
  userId: string
  messagesFiltre: any[] = []
  avatar: string
  init : boolean
  numberResult: number = 100
  page = 0;
  msgSub : Subscription;
  verificationProvenance : boolean = false
  


  constructor(public activatedRoute: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    let self = this
    this.channelId = this.activatedRoute.snapshot.paramMap.get('channelId');
    this.userService.returnDetailsChannel(this.channelId).subscribe((channel) => {
      console.log(channel)
      self.channelName = channel.name
      self.channel = channel
      this.userService.getCurrentUser().then(function (user) {
        self.avatar = user.photoURL
        self.userId = user.uid
        console.log(self.channel)
        if(channel.id.length === 56){
          self.userService.listeAllUsersOfChannels(self.channelId).subscribe(users => {
            console.log(users)
            users.map(user => {
              console.log(user)
              if(user.id !== self.userId){
                self.userService.getUserById(user.id).subscribe(ami => {
                  self.channelName = ami.payload.data().displayName
                  console.log(ami.payload.data().displayName)
                  self.verificationProvenance = true
                })
              }
            })
          })
        }
      })

    })


     this.msgSub = this.userService.listeAllMessageOfAChannel(this.channelId).subscribe((messages) => {
      //this.messagesFiltre = []
       //console.log(messages)
       //this.messagesFiltre = messages
       messages.map(message => {
         //console.log(message)
        this.userService.getUserById(message.idUser).subscribe(user => {
          //console.log(user.payload.data())
          message.avatar = user.payload.data().avatar
          //message.avatar = user.payload.data().avatar
          //this.messagesFiltre.push(message)
          
        })
        
       })
       this.messagesFiltre = messages
       //this.messages = messages

     })
    
    // this.userService.listeAllMessageOfAChannel(this.channelId, this.numberResult).pipe(

    //   take(1)
    // ).subscribe((msg) =>{
    //   console.log("load data on init")
    //   let date = new Date()

    //   this.time = (date.getTime())

    //   this.messages = []

    //   msg.map(message => {

    //     message.time = this.convertSecond(message.date.seconds, this.time)

    //     this.messages.push(message)
    //   })

    // })
    //this.loadData();
  }


  //loadData(infiniteScroll?) {
  //  let test = true
  //  if(this.numberResult === 0){
  //    this.init = true
  //  }
  //  else{
  //    this.init = false
  //  }
//
  //  this.numberResult = this.numberResult + 5
//
  //  this.userService.listeAllMessageOfAChannel(this.channelId, this.numberResult).subscribe((data) => {
  //    console.log(`boolean test = ${test}` )
  //    console.log(`boolean init = ${this.init}` )
  //    if(test === false && this.init === false){
  //      console.log("load data scroll")
  //      this.messages = data
  //      console.log(`data length : ${data.length}`)
  //      console.log(`this.numberResult : ${this.numberResult}`)
  //
  //      if (infiniteScroll)
  //      {
  //        infiniteScroll.target.complete()
  //      }
  //        
  //    }
  //    if(test === true && this.init === true){
  //      console.log("load data scroll")
  //      this.messages = data
  //      console.log(`data length : ${data.length}`)
  //      console.log(`this.numberResult : ${this.numberResult}`)
  //
  //      if (infiniteScroll)
  //        infiniteScroll.target.complete()
//
  //    }
  //    test = false
//
//
  //    
  //  })
   
  compareDate() {
    //console.log(this.messages[0].date.compareTo(this.messages[1].date))
  }

  TextSubmit() {
    //if(this.numberResult === this.messages.length){
    //  
    //}
    //console.log(this.channelId)
    let date = new Date();
    this.userService.addMessageToChannel(this.channelId, this.userId, this.textMsg, date, this.avatar)
    this.textMsg = ""
    //this.contentArea.scrollToBottom();
  }

  switchToVideoChat(){
    this.isVideoChatting = !this.isVideoChatting;
    this.startPeer(TextTrackCueList);

  }
  navigateByUrlTxt() {
    this.userService.navigateTo(`textMessage/${this.channelId}/gestionChannel`);
  }
  navigationVersAmis(){
    this.userService.navigateTo(`app/tabs/tab1`);
  }
  navigationVersChannels(){
    this.userService.navigateTo(`app/tabs/tab2`);
  }
  
  startPeer(initiator){
    navigator.getUserMedia({
      video:true,
      audio:true
    },stream=>{
      /*this.peer = new Peer ({ //THIS SHIT BUGGIN' YOU KNOW
        initiator:initiator,
        stream:stream,
        trickle:false
      })*/
      this.bindEvents();
      //let emiVideo = document.querySelector("#emiVideo");
      //emiVideo.srcObject=stream;
      //emiVideo.play();
    },err=>{
      console.log("err : " + err);
    })
  }

  bindEvents(){
    this.peer.on("error",err=>{
      console.log("err on signal : " + err)
    });
    this.peer.on('signal',data=>{
      //get user offer
    })
    this.peer.on('stream',stream=>{
      //this.recVideo = document.querySelector("#recVideo")
      this.srcObject = stream;
      //this.recVideo.nativeElement.play();
    })
  }
}
