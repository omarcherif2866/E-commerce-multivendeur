import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../shared/material/material.module';
import { AuthModule } from '../auth/auth.module';





@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    AuthModule
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
