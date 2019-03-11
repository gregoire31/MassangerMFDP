import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import * as firebase from 'firebase'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  emailRegister : string
  passwordRegister : string 
  nomRegister : string
  windowRef : any
  phoneNumber : string;
  verificationCode : string;
  user : any

  constructor(private userService : UserService) { }

  ngOnInit() {
    let self = this
    this.windowRef = this.userService.windowRef
    setTimeout(function(){ 
      self.windowRef.recapchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container')
      self.windowRef.recapchaVerifier.render()
     }, 1);
    
  }

  //signup() {
  //  this.userService.signup(this.emailRegister,this.passwordRegister,this.nomRegister)
  //}

  sendLoginCode() {
    const appVerifier = this.windowRef.recapchaVerifier;
    const num = `+33${this.phoneNumber}`
    firebase.auth().signInWithPhoneNumber(num,appVerifier)
    .then(result => {
      this.windowRef.confirmationResult = result;
    }).catch(error => console.log(error))
  }
  

  verifyLoginCode(){
    let photoURL = "https://www.gettyimages.ie/gi-resources/images/Homepage/Hero/UK/CMS_Creative_164657191_Kingfisher.jpg"
    this.windowRef.confirmationResult
    .confirm(this.verificationCode)
    .then(result => {
      this.user = result.user;
      return result
    }).then(user => {
      console.log(user)
      this.userService.addUserDetails(user.user.uid,this.nomRegister,photoURL)
      user.user.updateProfile({
        displayName: this.nomRegister,
        photoURL: photoURL,
      })
      this.userService.userOnLine(user.user.uid)
    }).then(()=>{
      
      this.userService.navigateTo('app')
    })
    .catch(error => console.log(error, "incorrect code entered"));
  }


}
