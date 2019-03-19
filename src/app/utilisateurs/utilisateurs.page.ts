import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-utilisateurs',
  templateUrl: './utilisateurs.page.html',
  styleUrls: ['./utilisateurs.page.scss'],
})
export class UtilisateursPage implements OnInit {
    users = null
  constructor(private route : ActivatedRoute) { }

  ngOnInit() {
    //this.route.data.subscribe(data => {
    //  console.log(data)
    //})

    
    console.log(this.route.snapshot.data);
    
  }

}
