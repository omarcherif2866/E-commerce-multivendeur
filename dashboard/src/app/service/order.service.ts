import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }


  getOrderByVendor(vendorId: any): Observable<Order[]>{
    return this.http.get<Order[]>("http://localhost:9090/order/vendor/"+vendorId)
  }

}
