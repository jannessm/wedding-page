import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { Category } from 'src/models/budget';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
  @Input()
  category: Category | undefined;

  @Output()
  change = new EventEmitter<Category>();

  @Output()
  delete = new EventEmitter<Category>();

  editMode = false;

  form: FormGroup | undefined;

  constructor(
    private fb: FormBuilder,
    private dialog: DialogService
  ) {}

  toggleEditMode() {
    this.editMode = !this.editMode;

    if (this.editMode) {
      this.form = this.fb.group({
        'label': [this.category?.label, Validators.required],
        'budget': [this.category?.budget, [Validators.min(0), Validators.pattern(/\d+/), Validators.required]]
      });
    }
  }

  applyChanges() {
    if (this.form?.valid && this.category) {
      this.editMode = false;

      this.change.emit({
        id: this.category.id,
        label: this.form.value['label'],
        budget: this.form.value['budget'],
        spent: this.category.spent,
        cost_center_ids: this.category.cost_center_ids
      });
    }
  }

  deleteCategory() {
    this.dialog.openConfirmDialog("Soll Kategorie " + this.category?.label + " gelöscht werden?")
      .afterClosed().subscribe(res => {
        if (res === 'ok') {
          this.delete.emit(this.category);
        }
      })
  }
}
