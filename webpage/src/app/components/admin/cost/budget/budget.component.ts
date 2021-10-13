import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss']
})
export class BudgetComponent {

  @Input()
  spent = 0;

  @Input()
  budget = 0;

  @Output()
  change = new EventEmitter<number>();

  editMode = false;

  control: FormControl | undefined;

  toggleEditMode() {
    this.editMode = !this.editMode;

    if (this.editMode) {
      this.control = new FormControl(this.budget, [Validators.min(0), Validators.pattern(/\d+/), Validators.required])
    }
  }

  applyChanges() {
    if (this.control && this.control.valid) {
      const budget = this.control.value;
      this.change.emit(budget);
      this.editMode = false;
    }
  }

}
