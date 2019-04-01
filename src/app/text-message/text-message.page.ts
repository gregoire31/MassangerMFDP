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
  @ViewChild('myContent') contentArea: Content;
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
      let sizeMessage = messages.length
       messages.map((message,index) => {
        this.userService.getUserById(message.idUser).subscribe(user => {
          message.avatar = user.payload.data().avatar
          if(index === sizeMessage-1){
            this.contentArea.scrollToBottom();
            //console.log(this.contentArea)
          }
        })
        
       })
       this.messagesFiltre = messages
       
       console.log(this.messagesFiltre)
       

     })
    
  }


   
  compareDate() {
  }

  TextSubmit() {
    if(this.textMsg !== ""){
      let date = new Date();
    this.userService.addMessageToChannel(this.channelId, this.userId, this.textMsg, date, this.avatar)
    }
    
    this.textMsg = ""
    this.contentArea.scrollToBottom();
  }

  //switchToVideoChat(){
  //  this.isVideoChatting = !this.isVideoChatting;
  //  this.startPeer(TextTrackCueList);
//
  //}
  navigateByUrlTxt() {
    this.userService.navigateTo(`textMessage/${this.channelId}/gestionChannel`);
  }
  navigationVersAmis(){
    this.userService.navigateTo(`app/tabs/tab1`);
  }
  navigationVersChannels(){
    this.userService.navigateTo(`app/tabs/tab2`);
  }
  
  //startPeer(initiator){
  //  navigator.getUserMedia({
  //    video:true,
  //    audio:true
  //  },stream=>{
  //    /*this.peer = new Peer ({ //THIS SHIT BUGGIN' YOU KNOW
  //      initiator:initiator,
  //      stream:stream,
  //      trickle:false
  //    })*/
  //    this.bindEvents();
  //    //let emiVideo = document.querySelector("#emiVideo");
  //    //emiVideo.srcObject=stream;
  //    //emiVideo.play();
  //  },err=>{
  //    console.log("err : " + err);
  //  })
  //}
//
  //bindEvents(){
  //  this.peer.on("error",err=>{
  //    console.log("err on signal : " + err)
  //  });
  //  this.peer.on('signal',data=>{
  //    //get user offer
  //  })
  //  this.peer.on('stream',stream=>{
  //    //this.recVideo = document.querySelector("#recVideo")
  //    this.srcObject = stream;
  //    //this.recVideo.nativeElement.play();
  //  })
  //}
}
