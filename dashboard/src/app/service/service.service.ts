import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { User } from '../models/user';
import { Category } from '../models/category';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ServiceService {
      private apiUrl = environment.apiUrl;



  constructor(private http: HttpClient) { }

  addProduct(data:any, vendorId:any):Observable<Product>{
    return this.http.post<Product>(`${this.apiUrl}/product/venodrProduct/${vendorId}`,data)
  }

  getProduct(){
    return this.http.get<Product[]>(`${this.apiUrl}/product/`)
  }

  putProduct(id: any, data: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/product/${id}`, data);
  }


  deleteProduct(id:any):Observable<Product>{
    return this.http.delete<Product>(`${this.apiUrl}/product/${id}`)

  }

  createAcount(data:any){
    return this.http.post<User>(`${this.apiUrl}/api/signup`,data)
  }


  signIn(credentials:any): Observable<User>{
    return this.http.post<User>(`${this.apiUrl}/api/signin`,credentials)
  }

  updateProfile(data:any,id:any){
    return  this.http.put(`${this.apiUrl}/users/${id}`,data)
  }

  getUserById(id: any): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/api/user/${id}`);
  }


  // getAllProducts(limit='12'): Observable<Array<Product>>{
  //   return this.http.get<Array<Product>>(`http://fakestoreapi.com/products?limits=${limit}`)
  // }

  getAllProducts(): Observable<Array<Product>>{
    return this.http.get<Array<Product>>(`${this.apiUrl}/product`)
  }

  getAllCategories(): Observable<Array<Category>>{
    return this.http.get<Array<Category>>(
      `${this.apiUrl}/category`
    )
  }

  fetchannonce():Observable<Product[]>{
    return this.http.get<Product[]>('http://fakestoreapi.com/products')
  }

  getProductsById(id:any) {
    return this.http.get(`${this.apiUrl}/product/${id}`)
  }

  getProductsByvendor(id: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/product/venodrProduct/${id}`);
  }

  getProductsByCategory(categoryId:any) : Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/product/categories/${categoryId}`)
  }

  addImages(formdata:any) {
    return this.http.post<any>(`${this.apiUrl}/product/file`, formdata)
  }

  getAttributesByCategory(categoryId: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/product/${categoryId}/attributes`);
  }

  getProductsByVendorAndStatus(id: any): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/product/venodrProduct/status/${id}`);
  }

}
