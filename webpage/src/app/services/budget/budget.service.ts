import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_STATUS, DataResponse } from 'src/models/api';
import { Category, CostCenter } from 'src/models/budget';
import { BudgetApiService } from '../api/budget-api/budget-api.service';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  constructor(
    private apiService: BudgetApiService,
    private snackbar: MatSnackBar
  ) {}

  getCategories(): Observable<Category[] | undefined> {
    return this.apiService.getBudgetCategories().pipe(map(resp => {
      if (resp && resp.status == API_STATUS.SUCCESS) {
        return <Category[]> resp.payload;
      }
      return;
    }));
  }

  getCostCenters(): Observable<CostCenter[] | undefined> {
    return this.apiService.getBudgetCostCenters().pipe(map(resp => {
      if (resp && resp.status == API_STATUS.SUCCESS) {
        return <CostCenter[]> resp.payload;
      }
      return;
    }));
  }

  updateBudget(budget: number): Observable<boolean> {
    return this.apiService.updateBudget(budget).pipe(map(resp => {
      if (resp && resp.status === API_STATUS.SUCCESS) {        
        return true;
      } else {
        this.snackbar.open("Budget konnte nicht aktualisiert werden.", "Ok");
        return false;
      }
    }));
  }

  addCategory(category: Category): Observable<Category | undefined> {
    return this.apiService.addCategory(category).pipe(map(resp => {
      if (resp && resp.status === API_STATUS.SUCCESS) {
        return <Category> resp.payload;
      } else {
        this.snackbar.open("Kategory konnte nicht hinzugefügt werden.", "Ok");
        return;
      }
    }))
  }

  updateCategory(category: Category): Observable<boolean> {
    return this.apiService.updateCategory(category).pipe(map(resp => {
      if (resp && resp.status === API_STATUS.SUCCESS) {        
        return true;
      } else {
        this.snackbar.open("Kategorien konnten nicht gespeichert werden.", "Ok");
        return false;
      }
    }));
  }

  deleteCategory(category: Category): Observable<boolean> {
    return this.apiService.deleteCategory(category).pipe(map(resp => {
      if (resp && resp.status === API_STATUS.SUCCESS) {        
        return true;
      } else {
        this.snackbar.open("Kategorie konnte nicht gelöscht werden.", "Ok");
        return false;
      }
    }));
  }
}
