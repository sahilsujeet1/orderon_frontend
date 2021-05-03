import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

import firebase from 'firebase/app';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-orderhistory',
  templateUrl: './orderhistory.component.html',
  styleUrls: ['./orderhistory.component.css'],
})
export class OrderhistoryComponent implements OnInit {
  delivered: boolean = false;
  accountType: string = 'seller';
  // accountType: string = 'customer'

  ordersPackage: any;
  store_name: string;
  uid: string;

  constructor(
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private auth: AuthService
  ) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid;
        this.auth.getInfo(this.uid).then((res) => {
          this.accountType = res.accountType;
          if (this.accountType == 'customer') {
            this.getCustomerOrderHistory();
          } else {
            this.activatedRoute.params.subscribe((params) => {
              this.getSellerOrderHistory(params.id, params.cat);
            });
          }
        });
      }
    });
  }

  ngOnInit(): void {}

  async getCustomerOrderHistory() {
    this.ordersPackage = await this.http
      .get(`${environment.backend_uri}/orderhistory/customer`)
      .toPromise();
    console.log(this.ordersPackage);

    for (let orders of this.ordersPackage) {
      for (let order of orders.order.orders) {
        console.log(order);
        for (let orderItem of order.orderItems) {
        }
      }
    }
  }

  async getSellerOrderHistory(id, cat) {
    this.ordersPackage = await this.http
      .post(`${environment.backend_uri}/orderhistory/seller`, {
        id: id,
        cat: cat,
      })
      .toPromise();
    console.log(this.ordersPackage);
  }

  cancelItem(item) {}

  async storeName(storeId, type) {
    var storeData = await this.http
      .post(`${environment.backend_uri}/orderhistory/storename`, {
        id: storeId,
        type: type,
      })
      .toPromise();
    // this.store_name = storeData.name
  }
}
