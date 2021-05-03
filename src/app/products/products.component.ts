import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormsModule
} from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import firebase from 'firebase/app';
import 'firebase/storage';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import imageCompression from 'browser-image-compression';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  cat: string;
  id: string;
  newProduct: FormGroup;
  updateProduct: FormGroup;
  imgUrl1 = '../../assets/images/default.jpg';
  imgURL1: SafeUrl;
  compressedImage: any;
  item: string = 'hello';

  products: any = [];

  constructor(
    public fb: FormBuilder,
    public activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {

    this.newProduct = this.fb.group({
      item: ['', [Validators.required]],
      price: ['', [Validators.required]],
      available: ['', [Validators.required]],
      description: ['', [Validators.required]],
      compressedImage: [new FormControl(''), [Validators.required]],
    });

      

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.id = params.id;
      this.cat = params.cat;
      this.getProducts()
    });
  }

  reset(event) {
      event.item = null
      event.price = null
      event.available = null
      event.description = null
  }

  async save(form) {
    let options = {
      item: form.value.item,
      price: form.value.price,
      available: form.value.available,
      description: form.value.description,
      quantity: 0,
      storeId: this.id,
      storeType: this.cat,
      rating: 4.5,
      imgURL: this.imgURL1 ? this.imgURL1 : ''
    };

    if (this.newProduct.valid) {
      var response: any = await this.http
        .post(`${environment.backend_uri}/store/new-product`, options)
        .toPromise();
      console.log(response);

      if (response.itemId) {
        if (!response.error) {
          var storage = firebase
            .storage()
            .ref()
            .child(`/${this.cat}/${this.id}/menu` + this.compressedImage.name);

          storage.put(this.compressedImage).then(async (snapshot) => {
            console.log('File uploaded');
            var opt = {
              url: await snapshot.ref.getDownloadURL(),
              storeType: this.cat,
              storeId: this.id,
              itemId: response.itemId,
            };
            console.log(opt.url)
            var urlResponse = await this.http
              .post(`${environment.backend_uri}/store/updateImgURL`, opt)
              .toPromise();
            console.log(urlResponse);
          });
        }
      }
    
      this.products.push(options)
      this.newProduct.reset();
      document.getElementById('newproductform').style.display = 'none';
    document.getElementById('new-product').style.display = 'block';
    } else {
      console.log('Something went wrong');
    }
  }

  async compressImage(file: File) {
    if (!file) return;
    var options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 512,
      useWebWorker: true,
    };
    this.compressedImage = await imageCompression(file, options);
    this.imgURL1 = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.compressedImage))
    this.newProduct.value.compressedImage.value = this.compressedImage;
  }

  upload() {
    document.getElementById('web-worker1').click();
  }

  show() {
    document.getElementById('newproductform').style.display = 'block';
    document.getElementById('new-product').style.display = 'none';
  }

  cancel() {
    this.newProduct.reset();
    document.getElementById('newproductform').style.display = 'none';
    document.getElementById('new-product').style.display = 'block';
  }

  async delete(event) {
    let res = await this.http.post(`${environment.backend_uri}/store/delete-product`, {cat: event.storeType, id: event.storeId, itemId: event.id}).toPromise()
    console.log(res)
    this.products.splice(this.products.indexOf(event),1)
  }


  async update(event) {

    console.log(event)
    let res = await this.http.post(`${environment.backend_uri}/store/update-product`, event).toPromise()
    console.log(res)
  }

  async getProducts() {
    this.products = []
    this.products = await this.http.post(`${environment.backend_uri}/store/get-seller-products`, {cat: this.cat, id: this.id})
    .toPromise();

    console.log(this.products)
  }
}
