import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import imageCompression from 'browser-image-compression';

@Component({
  selector: 'app-newstoreform',
  templateUrl: './newstoreform.component.html',
  styleUrls: ['./newstoreform.component.css'],
})
export class NewstoreformComponent implements OnInit {
  newStore: FormGroup;
  loc: FormArray;
  uid: string;
  location: any;
  lat: number;
  lon: number;
  imgUrl = '../../assets/images/default.jpg';
  imgURL: SafeUrl;
  uploadedURL: string;
  compressedImage: any;
  category: string = 'Category';
  cat: string;

  constructor(
    public fb: FormBuilder,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid;
      }
    });

    this.newStore = this.fb.group({
      name: ['', [Validators.required]],
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      pin: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      category: [new FormControl(''), [Validators.required]],
      location: [new FormControl(), [Validators.required]],
      compressedImage: [new FormControl(), [Validators.required]],
    });
  }

  ngOnInit(): void {}

  getCategory(event: any) {
    this.category = event.target.value;
    this.newStore.value.category.value = this.category;

    this.category = this.category[0].toUpperCase() + this.category.slice(1);
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition((loc) => {
      this.location = loc.coords;
      this.newStore.value.location.value = this.location;
    });
  }

  async save(form) {
    let options = {
      name: form.value.name,
      street: form.value.street,
      city: form.value.city,
      state: form.value.state,
      pin: form.value.pin,
      category: form.value.category.value,
      lat: form.value.location.value.latitude,
      lon: form.value.location.value.longitude,
      ownedBy: this.uid,
    };

    if (this.newStore.valid) {
      var response: any = await this.http
        .post(`${environment.backend_uri}/stores/add`, options)
        .toPromise();

      console.log(response);

      if (response.storeId) {
        if (!response.error) {
          var storage = firebase
            .storage()
            .ref()
            .child(`/${options.category}/` + this.compressedImage.name);

          storage.put(this.compressedImage).then(async (snapshot) => {
            console.log('File uploaded');
            var opt = {
              url: await snapshot.ref.getDownloadURL(),
              category: form.value.category.value,
              storeId: response.storeId,
            };
            var urlResponse = await this.http
              .post(`${environment.backend_uri}/stores/update`, opt)
              .toPromise();
            console.log(urlResponse);
          });
        }
      }
    } else {
      alert('Something went wrong while uploading image');
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
    this.imgURL = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.compressedImage))

    console.log(this.imgURL);
    this.newStore.value.compressedImage.value = this.compressedImage;
  }

  upload() {
    document.getElementById('web-worker2').click();
  }
}
