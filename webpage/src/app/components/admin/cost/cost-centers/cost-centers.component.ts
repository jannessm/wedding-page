import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BudgetApiService } from 'src/app/services/api/budget-api/budget-api.service';
import { API_STATUS } from 'src/models/api';
import { Category, CostCenter, FilterKeywords } from 'src/models/budget';

import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-cost-centers',
  templateUrl: './cost-centers.component.html',
  styleUrls: ['./cost-centers.component.scss']
})
export class CostCentersComponent implements AfterViewInit {
  @Input()
  costCenters: MatTableDataSource<CostCenter> | undefined;
  oldCostCenteres = new Map<string, CostCenter>();

  @Input()
  categories: Category[] | undefined;

  @Input()
  guests: number = 0;

  @Output()
  change = new EventEmitter<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  filter = "";

  displayedColumns: string[] = ['title', 'category', 'per_person', 'costs', 'paid', 'edit', 'delete'];

  constructor(
    private apiService: BudgetApiService
  ) { }

  ngAfterViewInit() {
    const interval = setInterval(() => {
      if (this.paginator && this.sort && this.costCenters) {
        this.costCenters.paginator = this.paginator;
        this.costCenters.sort = this.sort;
        clearInterval(interval);
        this.updateCategorySpent();
        this.costCenters.filterPredicate = this.filterCostCenters.bind(this);
      }
    }, 10);
  }

  addCostCenter() {
    if (this.costCenters) {
      this.filter = "";
      this.costCenters.filter = '';

      if (this.paginator) {
        this.paginator.firstPage();
      }
      
      const d = this.costCenters.data;
      const id = uuid();
      const newCC = {
        id,
        amount: 0.0,
        category: '',
        paid: false,
        per_person: false,
        title: "Neue Kostenstelle",
        editMode: true,
        isNew: true,
      };

      d.unshift(newCC);
      this.costCenters.data = d;
      this.oldCostCenteres.set(id, Object.assign({},newCC));
    }
  }


  saveChanges(row: CostCenter) {
    if (!this.categories || !this.costCenters) {
      this.oldCostCenteres.delete(row.id);
      return;
    }
    
    let oldCategoryId = -1;
    let oldCategory: Category | undefined;
    
    if (!!row.category && this.categories && this.costCenters) {
      oldCategoryId = this.categories.findIndex(c => row.category == c.id);
      oldCategory = Object.assign({}, this.categories[oldCategoryId]);

      if (!this.categories[oldCategoryId].cost_center_ids.includes(row.id)) {
        this.categories[oldCategoryId].cost_center_ids.push(row.id);
      }
    }

    row.isNew = false;

    this.apiService.updateCostCenters(
      this.categories,
      this.costCenters.data.filter(cc => !cc.isNew)
        .map(cc => {
          const ccCopy = Object.assign({}, cc);
          delete ccCopy.isNew;
          delete ccCopy.editMode;
          return ccCopy;
        })
    ).subscribe(resp => {
      if (resp && resp.status === API_STATUS.ERROR && this.categories) {
        const oldCostCenter = this.oldCostCenteres.get(row.id);
        
        if (oldCostCenter) {
          row.amount = oldCostCenter.amount;
          row.category = oldCostCenter.category;
          row.paid = oldCostCenter.paid;
          row.per_person = oldCostCenter.per_person;
          row.title = oldCostCenter.title;
        }

        if (oldCategoryId && oldCategory) {
          this.categories[oldCategoryId].cost_center_ids = oldCategory.cost_center_ids;
          this.categories[oldCategoryId].spent = oldCategory.spent;
        }

      } else {
        this.change.emit();
      }

      this.updateCategorySpent();
      this.oldCostCenteres.delete(row.id);
    });

  }

  deleteCostCenter(row: CostCenter) {
    this.apiService.deleteCostCenter(row).subscribe(resp => {
      if (resp && resp.status == API_STATUS.SUCCESS && this.costCenters) {
        this.costCenters.data = this.costCenters.data.filter(cc => cc.id !== row.id);
        this.updateCategorySpent();
        this.change.emit();
      }
    })
  }

  toggleEditMode(row: CostCenter) {
    row.editMode = !row.editMode;
    if (row.editMode) {
      this.oldCostCenteres.set(row.id, Object.assign({}, row));
    }
  }

  applyFilter(event: Event) {
    if (this.costCenters) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.costCenters.filter = filterValue.trim().toLowerCase();
  
      if (this.costCenters.paginator) {
        this.costCenters.paginator.firstPage();
      }
    }
  }

  getCategoryLabel(id: string): string {
    if (this.categories) {
      const c = this.categories.find(c => c.id === id);
      return !!c ? c.label : '';
    }
    return '';
  }

  updateCategorySpent() {
    if (this.categories) {
      this.categories.forEach(c => {

        if (this.costCenters) {
          c.spent = this.costCenters.data
            .filter(cc => c.cost_center_ids.includes(cc.id))
            .reduce((sum, cc) => {
              if (cc.per_person) {
                return sum + cc.amount * this.guests;
              } else {
                return sum + cc.amount;
              }
            }, 0.0);
        }
      })
    }
  }

  getTotalPaid() {
    return this.costCenters?.data.reduce((sum, r) => {
      let costs = r.amount;
      if (r.per_person) {
        costs *= this.guests;
      } 
      
      return r.paid ? sum + costs : sum;
    }, 0.0) || 0.00;
  }

  getTotalCostPerPerson() {
    return this.costCenters?.data.reduce((sum, r) => r.per_person ? sum + r.amount : sum, 0.0) || 0.00;
  }

  getTotalCost() {
    return this.costCenters?.data.reduce((sum, r) => {
      let costs = r.amount;
      if (r.per_person) {
        costs *= this.guests;
      } 
      
      return sum + costs;
    }, 0.0) || 0.00;
  }

  displayCategory(category_id: string): string {
    return this.categories?.find(c => c.id == category_id)?.label || '';
  }

  filterCostCenters(data: CostCenter, filter: string) {
    filter = filter.toLowerCase();
    const searchString = `${data.amount} ${this.displayCategory(data.category)} ${data.title} ${data.paid ? FilterKeywords.PAID : ''} ${data.per_person ? FilterKeywords.PER_PERSON : ''}`.trim().toLowerCase();

    return searchString.includes(filter);
  }

}
