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
  accountType: string = 'customer';

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
      .post(`${environment.backend_uri}/orderhistory/customer`, {
        uid: this.uid,
      })
      .toPromise();
  }

  async getSellerOrderHistory(id, cat) {
    this.ordersPackage = await this.http
      .post(`${environment.backend_uri}/orderhistory/seller`, {
        id: id,
        cat: cat,
      })
      .toPromise();
  }

  cancelItem(item) {}

  async storeName(storeId, type) {
    await this.http
      .post(`${environment.backend_uri}/orderhistory/storename`, {
        id: storeId,
        type: type,
      })
      .toPromise();
  }
}
