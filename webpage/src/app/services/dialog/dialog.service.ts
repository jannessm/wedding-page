import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/dialogs/confirm-dialog/confirm-dialog.component';
import { InfoDialogComponent } from 'src/app/components/dialogs/info-dialog/info-dialog.component';
import { ConfirmDialogData, InfoDialogData } from 'src/models/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(public dialog: MatDialog) { }

  openConfirmDialog(question: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: <ConfirmDialogData>{
        question
      }
    })
  }

  openInfoDialog(question: string) {
    return this.dialog.open(InfoDialogComponent, {
      width: '250px',
      data: <InfoDialogData>{
        question
      }
    })
  }
}
