import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {ForgetpasswordComponent} from "./forgetpassword/forgetpassword.component";
// import { GuardloginGuard } from './guard/guardlogin.guard';
import { DashboardComponent } from '../admin/dashboard/dashboard.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent , data: {title: 'accueil'} ,  },
  { path: 'register', component: RegisterComponent , data: {title: 'accueil'}   },
  { path: 'dashboardVendeur/:vendorId', component: DashboardComponent },
  { path: 'forgetPassword', component: ForgetpasswordComponent , data: {title: 'accueil'}},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
