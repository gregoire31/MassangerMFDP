import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  emailRegister : string
  passwordRegister : string 
  nomRegister : string

  constructor(private userService : UserService) { }

  ngOnInit() {
    
  }

  signup() {
    this.userService.signup(this.emailRegister,this.passwordRegister,this.nomRegister)
  }

}
