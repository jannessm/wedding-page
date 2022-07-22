import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataResponse, ApiResponse } from 'src/models/api';
import { Category, CostCenter } from 'src/models/budget';

@Injectable({
  providedIn: 'root'
})
export class BudgetApiService {

  BASE_API = environment.api_base + 'admin/?'

  constructor(private http: HttpClient) {}

  getBudgetCategories(): Observable<DataResponse> {
    return this.http.get<DataResponse>(this.BASE_API + 'categories');
  }

  getBudgetCostCenters(): Observable<DataResponse> {
    return this.http.get<DataResponse>(this.BASE_API + 'cost_centers');
  }

  updateBudget(budget: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.BASE_API + 'update-budget', {
      budget
    });
  }

  addCategory(category: Category): Observable<DataResponse> {
    return this.http.post<DataResponse>(this.BASE_API + 'add-category', {
      category
    });
  }

  updateCategory(category: Category): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.BASE_API + 'update-category', {
      category
    });
  }

  deleteCategory(category: Category): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(this.BASE_API + 'delete-category&id=' + category.id);
  }

  addCostCenter(costCenter: CostCenter): Observable<DataResponse> {
    return this.http.post<DataResponse>(this.BASE_API + 'add-cost-center', {
      cost_center: costCenter
    });
  }

  updateCostCenter(costCenter: CostCenter): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.BASE_API + 'update-cost-center', {
      cost_center: costCenter
    });
  }

  deleteCostCenter(costCenter: CostCenter): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(this.BASE_API + 'delete-cost-center&id=' + costCenter.id);
  }
}
