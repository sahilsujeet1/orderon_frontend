import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

import firebase from 'firebase/app';
import 'firebase/auth';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  accountType: string = 'customer';
  uid: string;

  constructor(private auth: AuthService) {

    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.uid = user.uid
        this.auth.getInfo(this.uid).then((res) => {
            this.accountType = res.accountType;
          });
      }
    })
  }

  ngOnInit(): void {}
}
