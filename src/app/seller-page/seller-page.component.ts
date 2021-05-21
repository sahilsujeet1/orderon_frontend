import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth.service';

import firebase from 'firebase/app';

@Component({
  selector: 'app-seller-page',
  templateUrl: './seller-page.component.html',
  styleUrls: ['./seller-page.component.css'],
})
export class SellerPageComponent implements OnInit {
  id: string;
  cat: string;
  ordersPackage: any;
  newOrders = [];
  inProcess = [];
  outForDelivery = [];
  storeName: string;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    public activatedRoute: ActivatedRoute
  ) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.activatedRoute.params.subscribe((routeParams) => {
          this.id = routeParams.id;
          this.cat = routeParams.cat;

          this.auth.getInfo(user.uid).then((res) => {
            for (let x of res.userData.data.stores) {
              if (x.storeId == this.id) {
                this.storeName = x.name;
              }
            }
          });

          this.getSellerOrderHistory(routeParams.id, routeParams.cat);

        });
      }
    });
  }

  ngOnInit(): void {}

  async getSellerOrderHistory(id, cat) {
    this.ordersPackage = [];
    this.newOrders = [];
    this.inProcess = [];
    this.outForDelivery = [];

    this.ordersPackage = await this.http
      .post(`${environment.backend_uri}/orderhistory/seller`, {
        id: id,
        cat: cat,
      })
      .toPromise();

    for (let orders of this.ordersPackage) {
      if (orders.order.status == 'new') {
        this.newOrders.push(orders);
      }

      if (orders.order.status == 'process') {
        this.inProcess.push(orders);
      }

      if (orders.order.status == 'out') {
        this.outForDelivery.push(orders);
      }
    }

    this.newOrders = this.sortAsLatest(this.newOrders);
    this.inProcess = this.sortAsLatest(this.inProcess);
    this.outForDelivery = this.sortAsLatest(this.outForDelivery);
  }

  sortAsLatest(orders) {
    orders.sort((a, b) => {
      return b.order.orderedAt - a.order.orderedAt;
    });
    return orders;
  }

  async pushToProcessing(order) {
    order.order.status = 'process';
    this.updateStatus(order);
    let index = this.newOrders.indexOf(order);
    this.inProcess.push(order);
    this.newOrders.splice(index, 1);
    this.inProcess = this.sortAsLatest(this.inProcess);
  }

  async pushToOut(order) {
    order.order.status = 'out';
    this.updateStatus(order);
    let index = this.inProcess.indexOf(order);
    this.outForDelivery.push(order);
    this.inProcess.splice(index, 1);
    this.outForDelivery = this.sortAsLatest(this.outForDelivery);
  }

  async updateStatus(order) {
    let options = {
      cat: this.cat,
      id: this.id,
      item: order,
    };
    await this.http
      .post(`${environment.backend_uri}/orderhistory/status-update`, options)
      .toPromise();
  }
}
