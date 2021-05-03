import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userRecieved: any;
  userData: any;
  uid: string;
  accountType: string;
  providerData: any;
  createdOn: any;

  constructor(private http: HttpClient, public router: Router) {}

  login(email: string, password: string) {
    return firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        return firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(async (user) => {
            console.log('Logged in');
            this.userRecieved = await this.http
              .post(`${environment.backend_uri}/auth/login`, {
                email,
                password,
              })
              .toPromise();
            let user_data = await this.getInfo(user.user.uid);
            if (user_data.accountType == 'seller') {
              if(user_data.userData.data.stores) {
                this.router.navigate([
                  `home/seller/${user_data.userData.data.stores[0].category}/${user_data.userData.data.stores[0].storeId}`,
                ]);
              } else {
                this.router.navigate(['/profile'])
              }
            } else {
              this.router.navigate(['/']);
            }
          });
      });
  }

  gLogin(accountType) {
    return firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(async () => {
        var provider = new firebase.auth.GoogleAuthProvider();
        let data = firebase.auth().signInWithPopup(provider);
        var user = (await data).user;
        var userInfo = (await data).additionalUserInfo;
        var credential = (await data).credential;

        var photoURL = user.photoURL;
        let URL = photoURL.split('=');
        photoURL = URL[0] + '=s500-c';

        this.userRecieved = await this.http
          .post(`${environment.backend_uri}/auth/login/google`, {
            credential: credential,
            type: accountType,
          })
          .toPromise();

          let user_data = await this.getInfo(user.uid);
          if (user_data.accountType == 'seller') {
            if(user_data.userData.data.stores) {
              this.router.navigate([
                `home/seller/${user_data.userData.data.stores[0].category}/${user_data.userData.data.stores[0].storeId}`,
              ]);
            } else {
              this.router.navigate(['/profile'])
            }
          } else {
            this.router.navigate(['/']);
          }
      });
  }

  fbLogin(accountType) {
    return firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(async () => {
        var provider = new firebase.auth.FacebookAuthProvider();

        let data = firebase.auth().signInWithPopup(provider);
        var user = (await data).user;
        var userInfo = (await data).additionalUserInfo;
        var credential: any = (await data).credential;

        var photoURL = user.photoURL;
        let URL = photoURL.split('=');
        photoURL = URL[0] + '=s500-c';

        this.userRecieved = await this.http
          .post(`${environment.backend_uri}/auth/login/fb`, {
            credential: credential.accessToken,
            type: accountType,
          })
          .toPromise();

          let user_data = await this.getInfo(user.uid);
          if (user_data.accountType == 'seller') {
            if(user_data.userData.data.stores) {
              this.router.navigate([
                `home/seller/${user_data.userData.data.stores[0].category}/${user_data.userData.data.stores[0].storeId}`,
              ]);
            } else {
              this.router.navigate(['/profile'])
            }
          } else {
            this.router.navigate(['/']);
          }
      });
  }

  signup(
    email: string,
    password: string,
    first_name: string,
    last_name: string
  ) {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((response) => {
          response.user
            .updateProfile({
              displayName: first_name + ' ' + last_name,
              photoURL:
                'https://www.tenforums.com/geek/gars/images/2/types/thumb_15951118880user.png',
            })
            .then(() => {
              resolve(response.user);
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  signout() {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        this.http.get(`${environment.backend_uri}/auth/signout`).toPromise();
        this.router.navigate(['/auth']);
      })
      .catch((err) => console.log(err));
  }

  checkProvider() {
    return firebase.auth().currentUser.providerData;
  }

  async getInfo(uid: string) {
    this.userData = await this.http
      .post(`${environment.backend_uri}/auth/getInfo`, { uid: uid })
      .toPromise();
    this.accountType = this.userData.data.accountType;
    this.createdOn = this.userData.data.createdOn;
    return {
      userData: this.userData,
      accountType: this.accountType,
      createdOn: this.createdOn,
      phoneNumber: this.userData.data.phoneNumber,
    };
  }
}
