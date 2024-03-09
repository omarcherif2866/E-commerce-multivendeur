import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';

import { HomeComponent } from './home/home/home.component';
import { OrdersComponent } from './product/orders/orders.component';
import { StockComponent } from './product/stock/stock.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AuthGuardService } from './service/auth-guard.service';

const routes: Routes = [

  {path:'home' , component:HomeComponent},
  {path:'' , redirectTo: 'home', pathMatch:'full'},
  { path: 'listproduct/:vendorId', component: NavbarComponent, canActivate: [AuthGuardService] },
  { path: 'stock/:vendorId', component: StockComponent, canActivate: [AuthGuardService] },
  { path: 'orders/:vendorId', component: OrdersComponent, canActivate: [AuthGuardService] },
  {path:'login' , component:LoginComponent},
 {path:"orders/:id", component:OrdersComponent},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
