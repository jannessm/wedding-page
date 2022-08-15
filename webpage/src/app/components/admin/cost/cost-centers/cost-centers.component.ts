import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BudgetApiService } from 'src/app/services/api/budget-api/budget-api.service';
import { API_STATUS } from 'src/models/api';
import { Category, CostCenter, FilterKeywords } from 'src/models/budget';

@Component({
  selector: 'app-cost-centers',
  templateUrl: './cost-centers.component.html',
  styleUrls: ['./cost-centers.component.scss']
})
export class CostCentersComponent implements AfterViewInit {
  @Input()
  costCenters: MatTableDataSource<CostCenter> | undefined;
  oldCostCenteres = new Map<number, CostCenter>();

  @Input()
  categories: Category[] | undefined;

  @Input()
  guests: number = 0;

  @Output()
  change = new EventEmitter<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  filter = "";

  displayedColumns: string[] = ['title', 'category', 'per_person', 'amount', 'paid', 'edit', 'delete'];

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
      const newCC: CostCenter = {
        id: -1, // will get ignored
        amount: 0.0,
        category: null,
        paid: false,
        per_person: false,
        title: "Neue Kostenstelle",
        editMode: true,
        isNew: true,
      };

      d.unshift(newCC);
      this.costCenters.data = d;
      this.oldCostCenteres.set(-1, Object.assign({},newCC));
    }
  }


  saveChanges(row: CostCenter) {
    if (!this.categories || !this.costCenters) {
      this.oldCostCenteres.delete(row.id);
      return;
    }

    row.isNew = false;

    // new cost center
    if (row.id == -1) {
      this.addCostCenterApiCall(row);
    } else {
      this.updateCostCenter(row);
    }

  }

  addCostCenterApiCall(row: CostCenter) {
    this.apiService.addCostCenter(row).subscribe(resp => {
      if (resp && resp.status === API_STATUS.SUCCESS) {
        const newRow = <CostCenter>resp.payload;
        row.id = newRow.id;

        this.change.emit();
      } else if (resp && resp.status === API_STATUS.ERROR && this.categories) {
        const oldCostCenter = this.oldCostCenteres.get(row.id);
        
        if (oldCostCenter) {
          row.amount = oldCostCenter.amount;
          row.category = oldCostCenter.category;
          row.paid = oldCostCenter.paid;
          row.per_person = oldCostCenter.per_person;
          row.title = oldCostCenter.title;
        }
      }

      this.updateCategorySpent();
    });
  }

  updateCostCenter(row: CostCenter) {
    const changed_item = Object.assign({}, row);
    if (changed_item.category && row.category) {
      changed_item.category = row.category + 1;
    }
    this.apiService.updateCostCenter(row).subscribe(resp => {
      if (resp && resp.status === API_STATUS.ERROR && this.categories) {
        const oldCostCenter = this.oldCostCenteres.get(row.id);
        
        if (oldCostCenter) {
          row.amount = oldCostCenter.amount;
          row.category = oldCostCenter.category;
          row.paid = oldCostCenter.paid;
          row.per_person = oldCostCenter.per_person;
          row.title = oldCostCenter.title;
        }

      } else {
        this.change.emit();
      }

      this.updateCategorySpent();
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

  getCategoryLabel(id: number): string {
    if (this.categories) {
      const c = this.categories.find(c => c.id === id);
      return !!c ? c.label : '';
    }
    return '';
  }

  updateCategorySpent() {
    if (this.categories) {
      this.categories.forEach(category => {
        category.spent = this.costCenters?.data.filter(cc => cc.category == category.id)
                                               .reduce((spent, cc) => !cc.per_person ? cc.amount + spent : cc.amount * this.guests + spent, 0.0);
      });
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

  displayCategory(category_id: number | null | undefined): string {
    return this.categories?.find(c => c.id == category_id)?.label || '';
  }

  filterCostCenters(data: CostCenter, filter: string) {
    filter = filter.toLowerCase();
    const searchString = `${data.amount} ${this.displayCategory(data.category)} ${data.title} ${data.paid ? FilterKeywords.PAID : ''} ${data.per_person ? FilterKeywords.PER_PERSON : ''}`.trim().toLowerCase();

    return searchString.includes(filter);
  }

}
