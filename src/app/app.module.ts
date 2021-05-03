import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { StoresComponent } from './stores/stores.component';
import { MenuComponent } from './menu/menu.component';
import { CartComponent } from './cart/cart.component';
import { FooterComponent } from './footer/footer.component';
import { OrderhistoryComponent } from './orderhistory/orderhistory.component';
import { ProfileComponent } from './profile/profile.component';
import { AddressPaymentComponent } from './address-payment/address-payment.component';
import { AddressComponent } from './address/address.component';
import { SellerPageComponent } from './seller-page/seller-page.component';
import { ProductsComponent } from './products/products.component';
import { LoginSellerComponent } from './login-seller/login-seller.component';
import { TestComponent } from './test/test.component';
import { NewstoreformComponent } from './navbar/newstoreform/newstoreform.component';

const firebaseConfig = {
  apiKey: "AIzaSyCg_9Jrdu_GBP-Qj47qKoWS2HgyzKODdWY",
  authDomain: "order-on-f896e.firebaseapp.com",
  projectId: "order-on-f896e",
  storageBucket: "order-on-f896e.appspot.com",
  messagingSenderId: "701255776387",
  appId: "1:701255776387:web:e09e371498e1709c9203b6",
  measurementId: "G-FXRKEHHTSR"
};


firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    HomeComponent,
    StoresComponent,
    MenuComponent,
    CartComponent,
    FooterComponent,
    OrderhistoryComponent,
    ProfileComponent,
    AddressPaymentComponent,
    AddressComponent,
    SellerPageComponent,
    ProductsComponent,
    LoginSellerComponent,
    TestComponent,
    NewstoreformComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
