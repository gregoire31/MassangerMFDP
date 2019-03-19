import { Injectable } from '@angular/core';
//import { UserService } from '../service/user.service';
import { Resolve } from '@angular/router';
import { HttpClient } from '@angular/common/http'
import { UserService } from '../service/user.service';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
export interface UserList {
  id: string;
  displayName: string;
  avatar: string;
  channel: any[];
  isOnline: boolean;
  details : string
}

@Injectable({
  providedIn: 'root'
})
export class UserListService implements Resolve<any>{
  //usersCollection : any
  observableUser : Observable<any>
  
  constructor(db: AngularFirestore, private usersCollection: AngularFirestoreCollection<UserList>) {
    this.usersCollection = db.collection<UserList>('users')
   }

  resolve(){
    
      //return this.http.get('https://jsonplaceholder.typicode.com/posts')
      this.observableUser =  this.usersCollection.snapshotChanges()
      return this.observableUser
      //return new Promise((resolve, reject) => {
      //  // must import 'rxjs/add/operator/first'; before using it here
      //  this.usersCollection.snapshotChanges().subscribe((data)=> {
      //    resolve(data)
      //  },reject)
      //  //list.first().subscribe(() => {
      //  //  resolve(list)
      //  //}, reject);
      //});
      //  map(actions => {
      //    return actions.map(a => {
      //      const data = a.payload.doc.data();
      //      const id = a.payload.doc.id;
      //      return { id, ...data };
      //    });
      //  })
      //);
    }
    
  
}
