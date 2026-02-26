import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
      private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }


  getOrderByVendor(vendorId: any): Observable<Order[]>{
    return this.http.get<Order[]>(`${this.apiUrl}/order/vendor/${vendorId}`)
  }

}
