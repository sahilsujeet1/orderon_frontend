import { Component } from '@angular/core';
import { CartService } from './cart.service';
import firebase from 'firebase/app';
import 'firebase/auth';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'orderonFrontend';
  loggedIn: boolean = false;
  length: number;
  accountType: string;


  constructor(private crt: CartService, private auth: AuthService) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.loggedIn = true;
        this.crt.getCart(user.uid);
        this.crt.obs.subscribe((x) => (this.length = x.length));
        this.auth.getInfo(user.uid).then((res) => {
          this.accountType = res.accountType;
        });
      } else {
        this.loggedIn = false;
      }
    });
  }

  ngOnInit() {}
}
