import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  sub = new BehaviorSubject<any>({length:0,total:0});
  cart: any = [];
  uid: string;
  obs = this.sub.asObservable();

  constructor(private http: HttpClient) {}

  async getCart(uid) {
    this.uid = uid
    this.cart = [];
    await firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .collection('cart')
      .get()
      .then((query) => {
        query.docs.forEach((doc) => {
          this.cart.push(doc.data());
        });
      });

    console.log(
      this.cart.length == 0 ? 'No item in cart!' : `${this.cart.length} items in  cart`
    );
    this.updateObs()
    return this.cart;
  }

  addToCartInc(item) {
    var found: boolean = false;
    if (this.cart.length > 0) {
      for (let x of this.cart) {
        if (x.id === item.id) {
          x.quantity = item.quantity;
          found = true;
        }
      }
    }

    if (found == true) {
      this.updateValue(item);
    } else {
      this.sendToDB(item);
      this.cart.push(item);
    }

    this.updateObs()
  }

  addToCartDec(item) {
    for (let x of this.cart) {
      if (x.id == item.id) {
        x.quantity = item.quantity;
        if (x.quantity == 0) {
          this.removeItem(item);
        } else {
          this.updateValue(item);
        }
      }
    }

   this.updateObs()
  }

  updateObs() {
    var t = 0;
    for (let c of this.cart) {
      t += c.netPrice;
    }
    this.sub.next({length:this.cart.length, total:t})
  }

  sendToDB(item) {
    firebase
      .firestore()
      .collection('users')
      .doc(this.uid)
      .collection('cart')
      .add(item)
      .then(() => {
        console.log('Item added to cart!');
      });
  }

  updateValue(item) {
    firebase
      .firestore()
      .collection('users')
      .doc(this.uid)
      .collection('cart')
      .where('id', '==', item.id)
      .get()
      .then((query) => {
        var updateId;
        query.docs.forEach((doc) => {
          updateId = doc.id;
        });

        firebase
          .firestore()
          .collection('users')
          .doc(this.uid)
          .collection('cart')
          .doc(updateId)
          .set(item)
          .then(() => console.log('Quantity updated!'))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  removeItem(item) {
    firebase
      .firestore()
      .collection('users')
      .doc(this.uid)
      .collection('cart')
      .where('id', '==', item.id)
      .get()
      .then((query) => {
        query.docs.forEach((doc) => {
          let deleteId = doc.id;
          firebase
            .firestore()
            .collection('users')
            .doc(this.uid)
            .collection('cart')
            .doc(deleteId)
            .delete()
            .then(() => {
              this.cart.splice(this.cart.indexOf(item),1);
              this.updateObs()
              console.log('Item removed from cart!');
            })
            .catch((err) => console.log(err));
        });

      })
      .catch((err) => console.log(err));
  }

  empty() {
    firebase.firestore().collection('users').doc(this.uid).collection('cart').get().then((query) => {
      query.docs.forEach(doc => {
        firebase.firestore().collection('users').doc(this.uid).collection('cart').doc(doc.id).delete().catch(err => console.log(err))
      })
      console.log("Cart emptied!")
      this.cart.splice(this.cart)
      this.updateObs()
    }).catch(err => console.log(err))
  }
}
