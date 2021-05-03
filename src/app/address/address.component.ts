import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CartService } from '../cart.service';

import firebase from 'firebase/app';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

  @Output() addressDetails = new EventEmitter();

  address: FormGroup;
  savedAddress: any;
  available: boolean = false;
  addressSelected: boolean = false;
  selAdd: string;
  shippingAdd: any;
  uid: string;

  constructor(
    public fb: FormBuilder,
    private http: HttpClient,
    private crt: CartService
  ) {

    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.uid = user.uid
        this.getAddress();
      }
    })

    this.address = this.fb.group({
      fullName: ['', [Validators.required]],
      street: ['', [Validators.required]],
      city: ['', [Validators.required, Validators.minLength(8)]],
      state: ['', [Validators.required]],
      pin: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
      mobile: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
    });
  }

  ngOnInit(): void {
    
  }

  async shipAdd(add) {
    this.shippingAdd = add;
    this.addressDetails.emit(add);
  }

  async getAddress() {
    this.savedAddress = await this.http
      .post(`${environment.backend_uri}/address`,{uid: this.uid})
      .toPromise();
    if (this.savedAddress.length != 0) {
      this.available = true;
    } else {
      this.available = false;
    }
  }

  save(form) {
    let data = {
      fullName: form.value.fullName,
      street: form.value.street,
      city: form.value.city,
      state: form.value.state,
      pin: form.value.pin,
      mobile: form.value.mobile,
    };

    this.http.post(`${environment.backend_uri}/address/save`, {data: data, uid: this.uid}).toPromise();
    this.savedAddress = null;
    this.getAddress();
    this.close();
  }

  addNew() {
    document.getElementById('mod').style.display = 'block';
  }

  close() {
    this.address.reset();
    document.getElementById('mod').style.display = 'none';
  }

  async del(add) {
    await this.http
      .post(`${environment.backend_uri}/address/del`, {id: add.id, uid: this.uid})
      .toPromise()
      .then((res) => {
        console.log(res);
        this.savedAddress = null;
        this.getAddress();
      });
  }

}
