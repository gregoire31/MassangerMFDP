import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase'




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


  phoneNumber: string
  email: string
  password: string
  user : any
  windowRef : any
  testVerificationCode : string = "123456"
  verificationCode : string
  appVerifier : any

  constructor(private userService : UserService, private router : Router, private _auth : AngularFireAuth ) { 
    
   }

  ngOnInit() {
    // let self = this
    // this._auth.user.subscribe(user => {
    //   this.user = user
    // })
    let self = this
    this.windowRef = this.userService.windowRef
    setTimeout(function(){ 
      self.windowRef.recapchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container')
      self.windowRef.recapchaVerifier.render()
     }, 1);

    //console.log(this.windowRef)
    //this.windowRef.recapchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container')
    //this.windowRef.recapchaVerifier.render()
  }

  



// This will render a fake reCAPTCHA as appVerificationDisabledForTesting is true.
// This will resolve after rendering without app verification.

// signInWithPhoneNumber will call appVerifier.verify() which will resolve with a fake
// reCAPTCHA response.
// loginWithPhone(){

//   firebase.auth().signInWithPhoneNumber(this.phoneNumber, this.appVerifier)
//       .then(function (confirmationResult) {
//         console.log(confirmationResult)
//         // confirmationResult can resolve with the whitelisted testVerificationCode above.
//         return confirmationResult.confirm(this.testVerificationCode)
//       }).catch(function (error) {
//         // Error; SMS not sent
//         // ...
//       }).then(() => {
//         this.userService.navigateTo('app')
//       });
// }

sendLoginCode() {
  const appVerifier = this.windowRef.recapchaVerifier;
  const num = `+33${this.phoneNumber}`
  firebase.auth().signInWithPhoneNumber(num,appVerifier)
  .then(result => {
    this.windowRef.confirmationResult = result;
  }).catch(error => console.log(error))
}


verifyLoginCode(){
  this.windowRef.confirmationResult
  .confirm(this.verificationCode)
  .then(user => {

    this.userService.setUserOnLine(user.user.uid)
  }).then(()=>{
    
    this.userService.navigateTo('app')
  })
  .catch(error => console.log(error, "incorrect code entered"));
}

  // verifyLoginCode(){

  //   this.windowRef.confirmationResult
  //   .confirm(this.verificationCode)
  //   .then(result => {
  //     this.user = result.user;
  //     return result
  //   }).then(user => {
  //     this.userService.setUserOnLine(user.user.uid)
  //   }).then(()=>{
      
  //     this.userService.navigateTo('app')
  //   })
  //   .catch(error => console.log(error, "incorrect code entered"));
  // }


  
  // loginPhone(){
  //   const num = `+33${this.phoneNumber}`
  //   const appVerifier = this.windowRef.recapchaVerifier;
  //   firebase.auth().signInWithPhoneNumber(num, appVerifier)
  //   .then(function (confirmationResult) {
  //     console.log(confirmationResult)
  //     this.windowRef.confirmationResult = confirmationResult;
  //     // confirmationResult can resolve with the whitelisted testVerificationCode above.
  //     //return confirmationResult.confirm(this.testVerificationCode)
  //   }).catch(function (error) {
  //     // Error; SMS not sent
  //     // ...
  //   });
  // }




  login() {
    this.userService.login(this.email,this.password)
  }
  //navigateTo(url: string) {
  //  this.router.navigateByUrl(url);
  //}

  logout() {
    this.userService.logout()
  }

}
