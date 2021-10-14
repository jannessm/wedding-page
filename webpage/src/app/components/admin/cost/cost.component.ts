import { Component, ViewChild } from '@angular/core';
import { BudgetData, Category, CostCenter } from 'src/models/budget';
import { BudgetService } from 'src/app/services/budget/budget.service';

import { v4 as uuid } from 'uuid';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-costs',
  templateUrl: './cost.component.html',
  styleUrls: ['./cost.component.scss']
})
export class CostComponent {
  data: BudgetData | undefined;

  categories: Category[] = [];

  cost_centers = new MatTableDataSource<CostCenter>();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(
    private budgetService: BudgetService,
  ) { }

  ngOnInit(): void {
    this.budgetService.getData().subscribe(data => this.handleData(data));
  }

  handleData(data: BudgetData | undefined) {
    if (data) {
      this.data = data;
      this.categories = this.data.categories.map(v => Object.assign({}, v));
      this.cost_centers.data = this.data.cost_centers;
    }
  }

  changeBudget(new_budget: number) {
    this.budgetService.updateBudget(new_budget).subscribe(success => {
      if (success && this.data) {
        this.data.budget = new_budget;
      }
    });
  }

  addCategory() {
    const new_id = uuid();
    this.categories.push({
      id: new_id,
      label: "Neue Kategorie",
      budget: 100,
      spent: 0,
      cost_center_ids: []
    });

    this.updateCategory(this.categories[this.categories.length - 1]);
  }

  updateCategory(category: Category) {
    const old_category = this.categories.find(c => c.id === category.id);
    const value_changed = !!old_category && (old_category.label !== category.label || old_category.budget !==  category.budget);
    
    if (value_changed && !!old_category) {
      old_category.label = category.label;
      old_category.budget = category.budget;
      
      this.budgetService.updateCategories(this.categories).subscribe(success => {
        if (success && this.data) {
          this.data.categories = this.categories.map(v => Object.assign({}, v));
        } else if (this.data) {
          this.categories = this.data.categories.map(v => Object.assign({}, v));
        }
      });
    }
  }

  deleteCategory(category: Category) {
      const old_category_id = this.categories.findIndex(c => c.id === category.id);
      if (old_category_id >= 0) {
        this.budgetService.deleteCategory(category).subscribe(success => {
          if (success && this.data) {
            this.categories.splice(old_category_id, 1);
            this.data.categories = this.categories.map(v => Object.assign({}, v));
          } else if (this.data) {
            this.categories = this.data.categories.map(v => Object.assign({}, v));
          }
        });
      }
  }

}
