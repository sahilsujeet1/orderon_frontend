import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

import firebase from 'firebase/app';
import 'firebase/auth';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  providerId: any;
  name: string;
  email: string;
  photoURL: string;
  phone: string;
  accountType: string;
  provider: any;
  userData: any;
  uid: string;
  userSince: any;

  constructor(private auth: AuthService, private http: HttpClient) {
    this.auth.checkProvider().forEach(element => {
      this.providerId = element.providerId
      this.name = element.displayName
      this.email = element.email
      this.photoURL = element.photoURL.replace('s96-c','s500-c')
    })

    this.uid = firebase.auth().currentUser.uid
    this.auth.getInfo(this.uid).then((res) => {
      var account = res.accountType
      this.accountType = account[0].toUpperCase() + account.slice(1)
      this.phone = res.phoneNumber
      this.userSince = res.createdOn
    })
  }

  ngOnInit(): void {
    
  }

  

  changePassword() {}
}
