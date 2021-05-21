import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginModal: boolean = true;
  loginForm: FormGroup;
  signupForm: FormGroup;

  message: string = '';
  colour: string = '';
  user: any;
  userError: any;
  accountType: string;

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router,
    private http: HttpClient
  ) {

    if(router.url == '/auth/seller'){
      this.accountType = 'seller'
    } else if(router.url == '/auth'){
      this.accountType = 'customer'
    }
    
    this.loginForm = this.fb.group({
      loginEmail: ['', [Validators.email, Validators.required]],
      loginPassword: ['', [Validators.required]],
    });

    this.signupForm = this.fb.group(
      {
        firstName: ['', [Validators.required]],
        lastName: [''],
        email: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: this.checkIfMatchingPasswords('password', 'confirmPassword'),
      }
    );
  }

  ngOnInit(): void {}

  showLogin() {
    this.loginModal = true;
  }

  showSignup() {
    this.loginModal = false;
  }

  checkIfMatchingPasswords(passwordKey: string, confirmPasswowrdKey: string) {
    return (group: FormGroup) => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswowrdKey];

      if (password.value == confirmPassword.value) {
        return;
      } else {
        confirmPassword.setErrors({
          notEqualToPassword: true,
        });
      }
    };
  }

  onLogin(form) {
    let options = {
      email: form.value.loginEmail,
      password: form.value.loginPassword,
    };

    console.log(options);
    this.authService
      .login(form.value.loginEmail, form.value.loginPassword)
      .catch((error) => {
        // this.colour = 'danger';
        // this.message = 'Wrong Password!';
        console.log(error);
      });
  }

  onSignup(signupform) {
    let email: string = signupform.value.email;
    let password: string = signupform.value.password;
    let firstName: string = signupform.value.firstName;
    let lastName: string = signupform.value.lastName;

    this.authService
      .signup(email, password, firstName, lastName)
      .then((user: any) => {
        firebase
          .firestore()
          .collection('users')
          .doc(user.uid)
          .set({
            firstName: firstName,
            lastName: lastName,
            email: email,
            photoURL: user.photoURL,
            accountType: this.accountType,
            phoneNumber: signupform.value.phoneNumber,
            createdOn: firebase.firestore.FieldValue.serverTimestamp()
          })
          .then(() => {
            // this.colour = 'success';
            // this.message =
            //   'You have been signed up successfully. Please login.';
            firebase.auth().signOut();
            this.signupForm.reset();
            this.router.navigate(['/']);
          });
      })
      .catch((error) => {
        console.log(error);
        this.userError = error;
      });
  }

  googleLogin() {
    this.authService
      .gLogin(this.accountType)
      .catch((err) => console.log(err));
  }

  fbLogin() {
    this.authService
      .fbLogin(this.accountType)
      .catch((err) => console.log(err));
  }
}
