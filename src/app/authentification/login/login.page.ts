import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string
  password: string
  user : firebase.User

  constructor(private userService : UserService, private router : Router, private _auth : AngularFireAuth ) { 
   }

  ngOnInit() {
    this._auth.user.subscribe(user => {
      this.user = user
    })
  }

  login() {
    this.userService.login(this.email,this.password)
    
  }
  navigateTo(url: string) {
    this.router.navigateByUrl(url);
  }

  logout() {
    this.userService.logout()
  }

}
