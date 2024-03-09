import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { User } from '../models/user';
import { Category } from '../models/category';


@Injectable({
  providedIn: 'root'
})
export class ServiceService {



  constructor(private http: HttpClient) { }

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

  createAcount(data:any){
    return this.http.post<User>("http://localhost:9090/api/signup",data)
  }


  signIn(credentials:any): Observable<User>{
    return this.http.post<User>("http://localhost:9090/api/signin",credentials)
  }

  updateProfile(data:any,id:any){
    return  this.http.put('http://localhost:3000/users/'+id,data)
  }

  getUserById(id: any): Observable<User> {
    return this.http.get<User>('http://localhost:9090/api/user/' + id);
  }


  // getAllProducts(limit='12'): Observable<Array<Product>>{
  //   return this.http.get<Array<Product>>(`http://fakestoreapi.com/products?limits=${limit}`)
  // }

  getAllProducts(): Observable<Array<Product>>{
    return this.http.get<Array<Product>>('http://localhost:9090/product')
  }

  getAllCategories(): Observable<Array<Category>>{
    return this.http.get<Array<Category>>(
      'http://localhost:9090/category'
    )
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
