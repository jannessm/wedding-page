import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { BudgetData } from 'src/models/budget';
import { BudgetService } from 'src/app/services/budget/budget.service';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-costs',
  templateUrl: './cost.component.html',
  styleUrls: ['./cost.component.scss']
})
export class CostComponent {
  data: BudgetData = {
    budget: 10000,
    spent_total: 0,
    categories: [],
    cost_centers: [],
  };

  editBudget = false;
  
  @ViewChild('budgetInput', {static: false, read: MatInput}) budgetInput: MatInput | undefined;
  notANumberError = false;
  greaterThan0Error = false;
  oldBudget: number = 1000;


  constructor(
    private budgetService: BudgetService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.budgetService.getData().subscribe(data => this.handleData(data));
  }

  handleData(data: BudgetData | undefined) {
    if (data) {
      this.data = data;
      this.oldBudget = data.budget;
    }
  }

  toggleEditBudget() {
    this.editBudget = !this.editBudget;
    this.oldBudget = this.data.budget;
    
    this.changeDetector.markForCheck()
    this.changeDetector.detectChanges();
  }

  changeBudget() {
    if (this.budgetInput) {
      this.notANumberError = false;
      this.greaterThan0Error = false;

      const budget = parseInt(this.budgetInput.value);

      if (isNaN(budget)) {
        this.notANumberError = true;
        return;
      }

      if (budget < 0) {
        this.greaterThan0Error = true;
        return;
      }

      if (budget !== this.oldBudget) {
        this.budgetService.updateBudget(budget).subscribe(success => {
          if (!success) {
            this.data.budget = this.oldBudget;
          }
  
          this.editBudget = false;
        });
      } else {
        this.editBudget = false;
      }
    }
  }

}
