import { Component, ViewChild } from '@angular/core';
import { BudgetData, Category, CostCenter } from 'src/models/budget';
import { BudgetService } from 'src/app/services/budget/budget.service';

import { v4 as uuid } from 'uuid';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CacheService } from 'src/app/services/cache/cache.service';

@Component({
  selector: 'app-costs',
  templateUrl: './cost.component.html',
  styleUrls: ['./cost.component.scss']
})
export class CostComponent {
  data: BudgetData | undefined;

  guests = 0;
  spent_total = 0;

  categories: Category[] = [];

  cost_centers = new MatTableDataSource<CostCenter>();

  category_total = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(
    private budgetService: BudgetService,
    private cacheService: CacheService
  ) { }

  ngOnInit(): void {
    this.budgetService.getData().subscribe(data => this.handleData(data));
    this.cacheService.data.subscribe(data => {
      // this.guests = Object.values(data).reduce((guests, user) => 
      //   user.guests.reduce((comingGuests, g) => g.isComing != false ? comingGuests + 1 : 0,0) + guests
      // , 0);
      this.guests = 0;
    });
  }

  handleData(data: BudgetData | undefined) {
    if (data) {
      this.data = data;
      
      if (!this.data.cost_centers.map) {
        this.data.cost_centers = Object.values(this.data.cost_centers);
      }

      this.categories = this.data.categories.map(v => Object.assign({}, v));
      this.cost_centers.data = this.data.cost_centers.map(v => Object.assign({editMode: false}, v));
      this.category_total = this.categories.reduce((sum, c) => sum + c.budget, 0.0);
      this.updateSpent();
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

  updateSpent() {
    if (this.data) {
      this.spent_total = this.getTotalCosts();
    }
  }

  getTotalCosts(): number {
    return this.cost_centers.data.reduce((spent, cc) => {
      if (cc.per_person) {
          return spent + cc.amount * this.guests;
      
      } else {
          return spent + cc.amount;
      }
    }, 0.0);
  }

}
