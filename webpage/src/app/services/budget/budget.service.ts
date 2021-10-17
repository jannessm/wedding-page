import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_STATUS, DataResponse } from 'src/models/api';
import { BudgetData, Category } from 'src/models/budget';
import { BudgetApiService } from '../api/budget-api/budget-api.service';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  constructor(
    private apiService: BudgetApiService,
    private snackbar: MatSnackBar
  ) {}

  getData(): Observable<BudgetData | undefined> {
    return this.apiService.getBudgetData().pipe(map(resp => {
      if (resp && resp.status == API_STATUS.SUCCESS) {
        return <BudgetData> (<DataResponse>resp).payload;
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

  updateCategories(categories: Category[]): Observable<boolean> {
    return this.apiService.updateCategories(categories).pipe(map(resp => {
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