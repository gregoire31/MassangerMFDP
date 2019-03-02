import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import { AngularFireAuth } from 'angularfire2/auth';
import { Subject } from 'rxjs'

@Injectable()
export class AuthGuard implements CanActivate {


    constructor( private router:Router, private afAuth: AngularFireAuth) {

    }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
      const authenticated: Subject<boolean> = new Subject();
      this.afAuth.auth.onAuthStateChanged(firebaseUser => {
          if (!firebaseUser) {
              this.router.navigate(['/login']);
              authenticated.next(false);
          } else {
              authenticated.next(true);
          }
          authenticated.complete();
      });
      return authenticated;
  }

}