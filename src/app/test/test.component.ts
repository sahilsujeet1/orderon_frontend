import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

import 'firebase/auth'

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  myLocation: any = {};
  category: string = 'Shop by Category';
  category_selected: boolean = false;
  cat: string;
  icon: string;
  // accountType: string = 'seller'
  accountType: string = 'customer'

  user: any;
  userInfo: any;
  loggedIn: boolean = false;

  bg = {
    restaurants: '../assets/images/food_bg.png',
    groceries: '../assets/images/groceries_bg.png',
    pharmacy: '../assets/images/pharmacy_bg.png',
  };

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    public router: Router
  ) {
    firebase.auth().onAuthStateChanged((user) => {
      this.user = user;
      if (user) {
        this.loggedIn = true;
        let uid = this.user.uid;
        this.icon = user.photoURL;
      } else {
        this.loggedIn = false;
        this.icon = '../../assets/images/man.svg'
      }
    });
  }

  ngOnChanges() {
  }

  ngOnInit(): void {}

  signout() {
    this.authService.signout().then(() => {
      console.log("Logged out from Frontend")
    });
  }

  getCategory(event: any) {
    this.category = event.target.value;
    this.cat = this.category;
    this.category = this.category[0].toUpperCase() + this.category.slice(1);
    this.category_selected = true;

    // if(this.cat == 'restaurants') {
    //   document.body.style.backgroundImage = this.bg.restaurants
    // } else if (this.cat == 'groceries') {
    //   document.body.style.backgroundImage = this.bg.groceries
    // } else if (this.cat == 'pharmacy') {
    //   document.body.style.backgroundImage = this.bg.pharmacy
    // }
    console.log(this.category);
  }

  async getStores() {
    await navigator.geolocation.getCurrentPosition(async (location) => {
      this.myLocation.lat = location.coords.latitude;
      this.myLocation.long = location.coords.longitude;

      let options = {
        location: {
          latitude: this.myLocation.lat,
          longitude: this.myLocation.long,
        },
        category: this.cat,
      };
      console.log(options);

      this.http
        .post(`${environment.backend_uri}/stores`, options)
        .toPromise()
        .then(() => {
          console.log('in the then');
          window.location.href = `${environment.frontend_uri}/stores`;
        });
    })
  }

}
