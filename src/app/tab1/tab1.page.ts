import { Component } from '@angular/core';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  users : any[]
  userName : String
  userId : string
  entry : any
  userModified : any
  usersFriends : any[]=[]
  donneeSearchbar : string=""
  userNameListFilter : any[]
  idFriends : any[]=[]
  userNameListFilterCheckbox : any[]=[]
  newFriends : any[]=[]
  event : string

  constructor(private userService : UserService) {

   }

  ngOnInit() {
    let self = this
    this.userService.getCurrentUser().then(function(user)  {
      //console.log(user)
      self.userId = user.uid
    })
    .then(()=>{
      //console.log(this.userId)
      this.userService.getUserId(this.userId).subscribe(user => {
        //console.log(user)
        this.userName = user.displayName
      })
    }).then(()=>{
      console.log("pousse")
      this.userService.friendListe(this.userId).subscribe((friends)=>{
        friends.map(friend => {
          this.idFriends.push(friend.id);
        })
        self.usersFriends = []
        friends.map(friend => {
          console.log("pousse")
          self.userService.getUserId(friend.id).subscribe(data => {
            console.log(data)
            self.usersFriends.push({... data})
          })
        })

      })
    }).then(()=>{
      console.log(this.idFriends)
      this.userService.getUserList().subscribe( (users) =>{
        this.userNameListFilter = users
        self.users = users

        this.userNameListFilter.map(friend => {
          if(this.idFriends.indexOf(friend.id) > -1){
            friend.canBeAdded = false
            console.log(friend.displayName + " est amis")
          }
          else{
            friend.canBeAdded = true
          }
        })


        //self.userNameListFilter = users
        //users.map(user => {
        //  console.log(user.id)          
        //})
    })
  })}

  getItems(){
    console.log("Salut tout le monde")
  }

  onSearchInput($event){
    if($event !== undefined){
      this.event = $event
      this.userNameListFilter = []
      let valueInput = $event.detail.value
      this.userNameListFilter = this.users.filter(c => c.displayName.toLowerCase().indexOf(valueInput) > -1)
    }
    
    //this.userNameListFilter.map(friend => {
    //  if(this.idFriends.indexOf(friend.id) > -1){
    //    friend.canBeAdded = false
    //    console.log(friend.displayName + " est amis")
    //  }
    //  else{
    //    friend.canBeAdded = true
    //  }
    //})
    //console.log(this.userNameListFilter)
    
  }



  testerFriendsData(){
  }

  addUserToChannel(id : string) {

    console.log(id)
  }

  addfriend(idUserAAjouter : string){
    console.log(idUserAAjouter)
    this.userService.addFriendsToUsers(this.userId,idUserAAjouter)
    //let self = this
    //let idAAjouter : any[]=[]
    //this.users.map(user => {
//
    //    if(user.isChecked){
    //      idAAjouter.push(user.id)
    //    }
//
    //})
    //this.userService.addFriendsToUsers(this.userId,idAAjouter)
    //this.onSearchInput(this.event)
    
  }


  logout(){
    this.userService.logout()
  }


}
