import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { UserService } from 'src/app/services/user/user.service';
import { UserTable } from 'src/models/guest-table';

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


  constructor(private userService: UserService, private dialogService: DialogService) {

    this.dataSource = new MatTableDataSource<UserTable>([]);
    this.userService.users.subscribe( users => {
      console.log('user');
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
    this.userService.updateUser(row).subscribe();
  }

  deleteUser(row: UserTable) {
    return this.dialogService.openConfirmDialog(`Soll der Benutzer ${row.name} gelöscht werden?`).afterClosed()
      .subscribe(result => {
        if (result === 'ok') {
          this.userService.deleteUser(row).subscribe();
        }
      });
  }

  resetPwd(row: UserTable) {
    this.dialogService.openConfirmDialog(`Soll das Passwort von Benutzer ${row.name} zurückgesetzt werden?`).afterClosed().subscribe(result => {
      if (result === 'ok') {     
        this.userService.resetPwd(row.name);
      }
    });
  }

}
