import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/models/api';
import { Category } from 'src/models/budget';

@Injectable({
  providedIn: 'root'
})
export class BudgetApiService {

  BASE_API = 'http://localhost:8080/api/admin/?'

  constructor(private http: HttpClient) {}

  getBudgetData(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.BASE_API + 'get-budget-data');
  }

  updateBudget(budget: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.BASE_API + 'update-budget', {
      budget
    });
  }

  updateCategories(categories: Category[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.BASE_API + 'update-categories', {
      categories
    });
  }

  deleteCategory(category: Category): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(this.BASE_API + 'delete-category&id=' + category.id);
  }
}
