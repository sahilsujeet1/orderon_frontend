import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../cart.service';
import { environment } from '../../environments/environment';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  details: any = {
    name: '',
    address: '',
    rating: ''
  };

  menu;
  decDisabled: boolean;
  loggedIn: boolean = false;
  user: any;

  constructor(private http: HttpClient, 
    private activatedRoute: ActivatedRoute,
    private crt: CartService) { 

    this.getMenu();
  }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged((user) => {
      this.user = user;
      if(user){
        this.loggedIn = true;
        let uid =this.user.uid;
        this.crt.getCart(uid)
      }
      else{
        this.loggedIn = false;
      }
    })

  }

  ngOnChanges() {
    this.details;
  }

   async getMenu() 
  {
    this.details = await this.http.get(`${environment.backend_uri}/store/details`).toPromise()
    this.menu = await this.http.get(`${environment.backend_uri}/store/menu`).toPromise()
    console.log(this.details)
    console.log(this.menu)
  }

  inc(item) {
    if(this.loggedIn){
      item.storeName = this.details.name
      item.quantity++
      item.netPrice = item.quantity * item.price
      this.crt.addToCartInc(item)
    } else {
      window.alert("Please login first to add items to cart!")
    }
  }
      

  dec(item) {
    if(this.loggedIn){
      if (item.quantity == 0){
        this.decDisabled = true
      }
      else {
        item.quantity--;
        item.netPrice = item.quantity * item.price
        this.crt.addToCartDec(item)
      }
    }else {
      window.alert("Please login first to add items to cart!")
    }
    
  }
}