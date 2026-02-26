import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from 'src/app/Models/category';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
    private apiUrl = environment.apiUrl;
  constructor(private http:HttpClient) { }


  getCategoryById(id:any):Observable<Category>{
    return this.http.get<Category>(`${this.apiUrl}/category/${id}`)
  }

  
  getAllCategories(): Observable<Array<Category>>{
    return this.http.get<Array<Category>>(
      `${this.apiUrl}/category`
    )
  }

}
