import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BudgetApiService } from 'src/app/services/api/budget-api/budget-api.service';
import { Category, CostCenter } from 'src/models/budget';

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
  filteredCategories = new Map<string, Category[]>();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  filter = "";

  guests = 100;

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
      d.unshift({
        id: uuid(),
        amount: 0.0,
        category: '',
        paid: false,
        per_person: false,
        title: "Neue Kostenstelle",
        editMode: true,
        isNew: true,
      });
      this.costCenters.data = d;
    }
  }


  saveChanges(row: CostCenter) {
    this.filteredCategories.delete(row.id);
    this.oldCostCenteres.delete(row.id);
  }

  deleteCostCenter(row: CostCenter) {}

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

  filterCategories(event: Event, row: CostCenter) {
    const target = (<HTMLInputElement>event.target);
    
    if (this.categories && !!target.value) {
      const filteredCategories = this.categories.filter(c => c.label.trim().toLocaleLowerCase().includes(target.value.trim().toLocaleLowerCase()));
      this.filteredCategories.set(row.id, filteredCategories);
    } else if (this.categories) {
      this.filteredCategories.set(row.id, this.categories);
    }
  }

  getFilteredCategories(id: string): Category[] {
    if (this.filteredCategories.has(id)) {
      return this.filteredCategories.get(id) || [];
    } else if (this.categories) {
      this.filteredCategories.set(id, this.categories);
      return this.categories;
    } else {
      return [];
    }
  }

  getCategoryLabel(id: string): string {
    if (this.categories) {
      const c = this.categories.find(c => c.id === id);
      return !!c ? c.label : '';
    }
    return '';
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

}
