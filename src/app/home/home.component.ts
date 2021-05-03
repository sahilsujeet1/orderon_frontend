import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

import firebase from 'firebase/app';
import 'firebase/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  uid: string;
  accountType: string = 'customer';
  store: any;

  constructor(private auth: AuthService, public router: Router) { 
    
  }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.uid = user.uid
        this.auth.getInfo(this.uid).then((res) => {
          this.store = res.userData.data.stores
            this.accountType = res.accountType;
            if(this.accountType == 'seller') {
              if(this.store){
                this.router.navigate([`/home/seller/${this.store[0].category}/${this.store[0].storeId}`])
              } else {
                this.router.navigate(['/profile'])
              }
            }
          });
      }
    })
  }

}
