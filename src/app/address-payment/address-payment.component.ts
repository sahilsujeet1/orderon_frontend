import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { CartService } from '../cart.service';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

@Component({
  selector: 'app-address-payment',
  templateUrl: './address-payment.component.html',
  styleUrls: ['./address-payment.component.css'],
})
export class AddressPaymentComponent implements OnInit {
  shippingAdd: any = null;
  mode: string;
  total: number = 0;
  uid: string;
  txnStatus: string;
  msg: string;
  odID: string;
  socket = io(`${environment.backend_uri}`);

  constructor(private http: HttpClient, private crt: CartService) {
  }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user != null) {
        this.uid = user.uid;
        this.crt.obs.subscribe((x) => (this.total = x.total));
      } else {
        this.uid = '';
      }
    });
  }

  selAdd(add) {
    this.shippingAdd = add;
  }

  async placeOrder() {
    let options = {
      cart: this.crt.cart,
      shipAdd: this.shippingAdd,
      mode: this.mode,
      uid: this.uid,
      amount: this.total,
    };
    if (this.mode == 'cod') {
      let res = await this.http
        .post(`${environment.backend_uri}/order/cod`, options)
        .toPromise();

      if (res) {
        this.odID = res.toString();
        this.txnStatus = 'TXN_SUCCESS';
        document.getElementById('orderStatus').style.display = 'block';
        document.getElementById('address-payment').style.display = 'none';
        console.log('Order ID: ' + res);
        console.log('Order placed successfully as COD');
        this.crt.empty();
      }
    }

    if (this.mode == 'online') {
      let res = await this.http
        .post(`${environment.backend_uri}/order/online`, options)
        .toPromise();

      if (res) {
        this.odID = res.toString();

        var paytmWindow = window.open(
          `${environment.backend_uri}/order/paytm`,
          'Payment Window',
          'width=700, height=1000'
        );

        this.socket.on('payment-status', (status) => {
          this.txnStatus = status;
          if (status == 'TXN_SUCCESS') {
            document.getElementById('orderStatus').style.display = 'block';
            document.getElementById('address-payment').style.display = 'none';
            this.crt.empty();
          } else {
            document.getElementById('orderStatus').style.display = 'block';
            document.getElementById('address-payment').style.display = 'none';
          }
          paytmWindow.close()
        });
      }
    }
  }
}
