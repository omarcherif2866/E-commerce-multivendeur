import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
      private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCategoryById(id:any):Observable<Category>{
    return this.http.get<Category>(`${this.apiUrl}/category/${id}`)
  }

}
