import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { CacheService } from 'src/app/services/cache/cache.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { ExcelService } from 'src/app/services/excel/excel.service';
import { UserService } from 'src/app/services/user/user.service';
import { UserTable } from 'src/models/guest-table';

import { saveAs } from 'file-saver';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnDestroy, AfterViewInit {

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

  userSubscription: Subscription;

  constructor(private userService: UserService, private dialogService: DialogService, private excelService: ExcelService, private cacheService: CacheService) {

    this.dataSource = new MatTableDataSource<UserTable>([]);
    this.userSubscription = this.userService.users.subscribe( users => {
      this.dataSource.data = users;
    });

    if (this.userService._lastDataObject) {
      this.dataSource.data = this.userService._lastDataObject;
    }
  }

  ngAfterViewInit() {
    const interval = setInterval(() => {
      if (this.paginator && this.sort && this.dataSource) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        clearInterval(interval);
      }
    }, 10);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
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

  generateExcel() {
    if (this.cacheService._lastDataObject) {
      const user = Object.entries(this.cacheService._lastDataObject).map((entry) => {
        return Object.assign(entry[1], {
          name: entry[0],
        });
      })
      this.excelService.createUserFile(user).then(data => {
        const blob = new Blob([data], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          });
        saveAs(blob, "Benutzer.xlsx");
      });
    }
  }

}
