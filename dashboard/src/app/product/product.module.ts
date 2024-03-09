import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableProductComponent } from './table-product/table-product.component';
import { MaterialModule } from '../shared/material/material.module';
import { StockComponent } from './stock/stock.component';
import { OrdersComponent } from './orders/orders.component';



@NgModule({
  declarations: [
    TableProductComponent,
    StockComponent,
    OrdersComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    TableProductComponent
  ]
})
export class ProductModule { }
