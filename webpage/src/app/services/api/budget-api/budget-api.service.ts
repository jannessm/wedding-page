import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/models/api';

@Injectable({
  providedIn: 'root'
})
export class BudgetApiService {

  BASE_API = 'http://localhost:8080/api/admin/?'

  constructor(private http: HttpClient) {}

  getBudgetData(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.BASE_API + 'get-budget-data');
  }

  updateBudget(budget: number): Observable<ApiResponse>{
    return this.http.post<ApiResponse>(this.BASE_API + 'update-budget', {
      budget
    });
  }
}
