import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import { concatAll, map } from 'rxjs/operators';
import { GuestService } from 'src/app/services/guest/guest.service';
import { ConfirmDialogData } from 'src/models/dialog';
import { UserTable } from 'src/models/guest-table';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent {

  displayedColumns: string[] = ['user', 'guests', 'isAdmin', 'resetPwd', 'edit', 'delete'];
  dataSource: MatTableDataSource<UserTable>;

  @Input()
  expanded: boolean = false;

  @Output()
  opened = new EventEmitter();
  @Output()
  closed = new EventEmitter();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;


  constructor(private guestService: GuestService, private iconRegistry: MatIconRegistry, public dialog: MatDialog) {

    this.dataSource = new MatTableDataSource<UserTable>([]);
    this.guestService.getData();
    this.guestService.users.subscribe( users => {
      this.dataSource.data = users;
    });
  }

  ngAfterViewInit() {
    const interval = setInterval(() => {
      if (this.paginator && this.sort && this.dataSource) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        clearInterval(interval);
      }
    }, 100);
  }

  applyFilter(event: Event) {
    if (this.dataSource) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  saveChanges(row: UserTable) {
    this.guestService.updateUser(row);
  }

  deleteUser(row: UserTable) {
    return this.openDialog(`Soll der Benutzer ${row.name} gelöscht werden?`).afterClosed()
      .subscribe(result => {
        if (result === 'ok') {     
          this.guestService.deleteUser(row);
        }
      });
  }

  resetPwd(row: UserTable) {
    this.openDialog(`Soll das Passwort von Benutzer ${row.name} zurückgesetzt werden?`).afterClosed().subscribe(result => {
      if (result === 'ok') {     
        this.guestService.resetPwd(row.name);
      }
    });
  }

  openDialog(question: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: <ConfirmDialogData>{
        question
      }
    })
  }

}
