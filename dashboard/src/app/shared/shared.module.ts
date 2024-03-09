import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http'
import { MaterialModule } from './material/material.module';
import { DialogComponent } from './dialog/dialog.component';
import { ProductModule } from '../product/product.module';





@NgModule({
  declarations: [
    NavbarComponent,
    DialogComponent
  ],
  imports:[
    CommonModule,
    BrowserModule ,
    FormsModule,
    RouterModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    ProductModule,


  ],
  exports : [
    BrowserModule ,
    RouterModule,
    FormsModule,
    NavbarComponent,
    DialogComponent,
    ReactiveFormsModule,
    MaterialModule

  ]
})
export class SharedModule { }
