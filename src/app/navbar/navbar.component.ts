import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import io from 'socket.io-client';
import firebase from 'firebase/app';
import 'firebase/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  myLocation: any = {};
  category: string = 'Shop by Category';
  category_selected: boolean = false;
  cat: string;
  icon: string;
  accountType: string = 'customer';
  sellerStores: any;
  sellCat: string;
  id: string;
  uid: string;
  userInfo: any;
  loggedIn: boolean = false;
  socket = io(`${environment.backend_uri}`);

  bg = {
    restaurants: '../assets/images/food_bg.png',
    groceries: '../assets/images/groceries_bg.png',
    pharmacy: '../assets/images/pharmacy_bg.png',
  };

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.sellCat = this.activatedRoute.snapshot.paramMap.get('cat');
    console.log(this.sellCat);

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.loggedIn = true;
        this.uid = user.uid;
        this.icon = user.photoURL;

        this.authService.getInfo(this.uid).then((res) => {
          this.accountType = res.accountType
          this.sellerStores = res.userData.data.stores
          console.log(this.sellerStores)
        })
      } else {
        this.loggedIn = false;
        this.icon = '../../assets/images/man.svg';
      }
    });

    
  }

  disp(event) {
    console.log(event);
  }

  ngOnInit(): void {}

  signout() {
    this.authService.signout().then(() => {
      console.log('Logged out from Frontend');
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
    });
  }
}
