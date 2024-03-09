import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'src/app/Models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor( private http: HttpClient) { }

  addProduct(data:any, vendorId:any):Observable<Product>{
    return this.http.post<Product>("http://localhost:9090/product/venodrProduct/"+vendorId,data)
  }

  getProduct(){
    return this.http.get<Product[]>("http://localhost:9090/product/")
  }

  putProduct(id: any, data: FormData): Observable<Product> {
    return this.http.put<Product>(`http://localhost:9090/product/${id}`, data);
  }


  deleteProduct(id:any):Observable<Product>{
    return this.http.delete<Product>("http://localhost:9090/product/"+id)

  }

  getAllProducts(): Observable<Array<Product>>{
    return this.http.get<Array<Product>>('http://localhost:9090/product')
  }
  fetchannonce():Observable<Product[]>{
    return this.http.get<Product[]>('http://fakestoreapi.com/products')
  }
  getProductsById(id:any) {
    return this.http.get('http://localhost:9090/product/'+id)
  }
  getProductsByvendor(id: string): Observable<Product[]> {
    return this.http.get<Product[]>('http://localhost:9090/product/venodrProduct/' + id);
  }
  getProductsByCategory(categoryId:any) : Observable<Product[]> {
    return this.http.get<Product[]>('http://localhost:9090/product/categories/' + categoryId)
  }
  addImages(formdata:any) {
    return this.http.post<any>('http://localhost:9090/product/file', formdata)
  }
  getAttributesByCategory(categoryId: any): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:9090/product/${categoryId}/attributes`);
  }
  getProductsByVendorAndStatus(id: any): Observable<Product[]> {
    return this.http.get<Product[]>('http://localhost:9090/product/venodrProduct/status/' + id);
  }
}
