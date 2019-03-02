import { Component } from '@angular/core';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  users : any
  userName : string
  avatar : string
  userId : string
  //userName = "toto"
  displayName: string

  constructor(private userService : UserService) {
    let self = this

   }

   ngOnInit() {
    let self = this
    
    this.userService.getCurrentUser().then(function (user) {
      console.log(user)
      self.userId = user.uid
    }).then(() => {
      this.userService.getUserId(this.userId).subscribe(user => {
        console.log(user.displayName)
        this.avatar = user.avatar
        this.displayName = user.displayName
        self.users = user
      })
    }
    )
  }

  save(){
    this.userService.updateUserDetail(this.userId,this.displayName,this.avatar)
  }


  logout(){
    this.userService.logout()
  }


}
