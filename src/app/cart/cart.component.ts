import { Component, OnInit, Input } from '@angular/core';
import { CartService } from '../cart.service';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cart: any;
  uid: string;
  loggedIn: boolean = false;
  decDisabled: boolean;
  total: number ;
  length: number;

  constructor(private crt: CartService) {}

  ngOnInit(): void {

  
    firebase.auth().onAuthStateChanged(async (user) => {
      if(user != null){
        this.loggedIn = true
        this.uid = user.uid
        this.cart = await this.crt.cart
        console.log(this.cart)
        
        this.crt.obs.subscribe(x => {
          this.total = x.total
          this.length = x.length
        })

      }
      else{
        this.loggedIn = false
        this.uid = ''
      }
    })

    
  }

  ngOnChanges() {
  }

  inc(item) {
    if(this.loggedIn){
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

  remove(item) {
    this.crt.removeItem(item)
  }

  emptyCart() {
    this.crt.empty()
  }

}
