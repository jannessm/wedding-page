import { Component, ViewChild } from '@angular/core';
import { Category, CostCenter } from 'src/models/budget';
import { BudgetService } from 'src/app/services/budget/budget.service';

import { v4 as uuid } from 'uuid';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { GuestService } from 'src/app/services/guest/guest.service';

@Component({
  selector: 'app-costs',
  templateUrl: './cost.component.html',
  styleUrls: ['./cost.component.scss']
})
export class CostComponent {
  guests = 0;
  spent_total = 0;
  budget_total = 0;

  categories: Category[] = [];

  cost_centers = new MatTableDataSource<CostCenter>();

  category_total = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(
    private budgetService: BudgetService,
    private guestService: GuestService
  ) { }

  ngOnInit(): void {
    this.budgetService.getCategories().subscribe(data => this.handleCategories(data));
    this.budgetService.getCostCenters().subscribe(data => this.handleCostCenters(data));
    this.guestService.guests.subscribe(data => {
      this.guests = Object.values(data).reduce((guests, guest) => 
        guest.isComing != false ? guests + 1 : 0, 0);
    });
  }

  handleCostCenters(data: CostCenter[] | undefined) {
    if (data) {
      this.cost_centers.data = data.map(v => Object.assign({editMode: false}, v));
      this.category_total = this.categories.reduce((sum, c) => sum + c.budget, 0.0);
      this.updateSpent();
    }
  }

  handleCategories(data: Category[] | undefined) {
    if (data) {
      this.budget_total = data[0].budget;

      this.categories = data.slice(1).map(v => Object.assign({}, v));
      this.category_total = this.categories.reduce((sum, c) => sum + c.budget, 0.0);
      this.updateSpent();
    }
  }

  changeBudget(new_budget: number) {
  //   this.budgetService.updateBudget(new_budget).subscribe(success => {
  //     if (success) {
  //       this.data.budget = new_budget;
  //     }
  //   });
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
    // const old_category = this.categories.find(c => c.id === category.id);
    // const value_changed = !!old_category && (old_category.label !== category.label || old_category.budget !==  category.budget);
    
    // if (value_changed && !!old_category) {
    //   old_category.label = category.label;
    //   old_category.budget = category.budget;
      
    //   this.budgetService.updateCategories(this.categories).subscribe(success => {
    //     if (success && this.data) {
    //       this.data.categories = this.categories.map(v => Object.assign({}, v));
    //     } else if (this.data) {
    //       this.categories = this.data.categories.map(v => Object.assign({}, v));
    //     }
    //   });
    // }
  }

  deleteCategory(category: Category) {
      // const old_category_id = this.categories.findIndex(c => c.id === category.id);
      // if (old_category_id >= 0) {
      //   this.budgetService.deleteCategory(category).subscribe(success => {
      //     if (success && this.data) {
      //       this.categories.splice(old_category_id, 1);
      //       this.data.categories = this.categories.map(v => Object.assign({}, v));
      //     } else if (this.data) {
      //       this.categories = this.data.categories.map(v => Object.assign({}, v));
      //     }
      //   });
      // }
  }

  updateSpent() {
    this.spent_total = this.getTotalCosts();
    this.updateSpentPerCategory();
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

  updateSpentPerCategory() {
    this.categories.forEach(category => {
      category.spent = this.cost_centers.data.filter(cc => cc.category == category.id)
                                             .reduce((spent, cc) => !cc.per_person ? cc.amount + spent : cc.amount * this.guests + spent, 0.0);
    });
  }

}
