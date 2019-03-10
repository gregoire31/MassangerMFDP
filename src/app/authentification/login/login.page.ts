import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';





//get e164() {
//  const num = this.country + this.area + this.prefix + this.line
//  return `+${num}`
//}


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {



  email: string
  password: string
  user : any

  constructor(private userService : UserService, private router : Router, private _auth : AngularFireAuth ) { 
    
   }

  ngOnInit() {
    let self = this
    this._auth.user.subscribe(user => {
      this.user = user
    })

    //console.log(this.windowRef)
    //this.windowRef.recapchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container')
    //this.windowRef.recapchaVerifier.render()
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
