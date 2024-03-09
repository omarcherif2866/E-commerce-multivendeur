import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from 'src/app/Models/category';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  public url= 'api/categories/';
  public url2= '/api/auth/changer';
  constructor(private http:HttpClient) { }


  getCategoryById(id:any):Observable<Category>{
    return this.http.get<Category>('http://localhost:9090/category/'+id)
  }

  
  getAllCategories(): Observable<Array<Category>>{
    return this.http.get<Array<Category>>(
      'http://localhost:9090/category'
    )
  }

}
