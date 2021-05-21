import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddressPaymentComponent } from './address-payment/address-payment.component';
import { AuthService } from './auth.service';
import { CartComponent } from './cart/cart.component';
import { HomeComponent } from './home/home.component';
import { LoginSellerComponent } from './login-seller/login-seller.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { OrderhistoryComponent } from './orderhistory/orderhistory.component';
import { ProductsComponent } from './products/products.component';
import { ProfileComponent } from './profile/profile.component';
import { SellerPageComponent } from './seller-page/seller-page.component';
import { StoresComponent } from './stores/stores.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'home/seller/:cat/:id', component: SellerPageComponent},
  {path: 'auth', component: LoginComponent},
  {path: 'auth/seller', component: LoginSellerComponent},
  {path: 'stores', component: StoresComponent},
  {path: 'cart',component: CartComponent},
  {path: 'menu',component: MenuComponent },
  {path: 'payment',component: AddressPaymentComponent},
  {path: 'orders',component: OrderhistoryComponent},
  {path: 'orders/:cat/:id',component: OrderhistoryComponent},
  {path: 'profile',component: ProfileComponent},
  {path: 'products/:cat/:id',component: ProductsComponent},
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

  constructor(private auth: AuthService) {
    
  }


}
