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

  constructor(private userService : UserService) {
    let self = this


      
    

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
      //self.usersFriends = []
      this.userService.friendListe(this.userId).subscribe((friends)=>{
        friends.map(friend => {
          this.idFriends.push(friend.id);
        })

        //console.log(friends)
        //this.usersFriends = friends
        friends.map(friend => {
          self.userService.getUserId(friend.id).subscribe(data => {
            self.usersFriends.push({... data})
          })
        })

      })
    }).then(()=>{
      console.log(this.idFriends)
      this.userService.getUserList().subscribe( (users) =>{
        
        self.users = users
        self.userNameListFilter = users
        users.map(user => {
          console.log(user.id)

              //if(this.idFriends.indexOf(user.id) > -1 === true){
              //  console.log(true)
              //}
              //if(this.idFriends.indexOf(user.id) > -1 === false){
              //  user.canAdd = true
              //}
          
        })
    })
  })
  }

  getItems(){
    console.log("Salut tout le monde")
  }

  onSearchInput($event){
    let valueInput = $event.detail.value
    console.log(valueInput)

    const search = valueInput;
  
    if (!search) return this.users;

    //this.userNameListFilter.push({... this.users.filter(c => c.displayName.toLowerCase().indexOf(valueInput) > -1)})
    this.userNameListFilter = this.users.filter(c => c.displayName.toLowerCase().indexOf(valueInput) > -1)
  }



  testerFriendsData(){
    console.log(this.usersFriends)
  }

  addUserToChannel(id : string) {

    console.log(id)
  }

  addfriend(){
    this.users.map(user => {
      if(user.isChecked === true){
        this.userService.addFriendsToUsers(this.userId,user.id)
      }
    })
  }

  logout(){
    this.userService.logout()
  }


}
