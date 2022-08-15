import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { GuestService } from 'src/app/services/guest/guest.service';
import { GuestTable } from 'src/models/guest-table';
import { AGE_CATEGORIES, AGE_CATEGORY_ICONS, AGE_CATEGORY_LABELS, DIETS, DIET_ICONS, DIET_LABELS } from 'src/models/user';
import { ALLERGIES, ALLERGIES_ICONS, ALLERGIES_LABELS } from 'src/models/allergies';
import { Subscription } from 'rxjs';
import { ExcelService } from 'src/app/services/excel/excel.service';
import { UserService } from 'src/app/services/user/user.service';

import { saveAs } from 'file-saver-es';

@Component({
  selector: 'app-guestlist-table',
  templateUrl: './guestlist-table.component.html',
  styleUrls: ['./guestlist-table.component.scss']
})
export class GuestlistTableComponent implements AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['user', 'name', 'lastname', 'age', 'diet', 'isComing', 'edit', 'delete'];
  dataSource: MatTableDataSource<GuestTable>;

  @Input()
  expanded: boolean = false;

  @Output()
  opened = new EventEmitter();
  @Output()
  closed = new EventEmitter();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  ages = Object.values(AGE_CATEGORIES);
  agesLabels = AGE_CATEGORY_LABELS;
  agesIcons = AGE_CATEGORY_ICONS;
  diets = Object.values(DIETS);
  dietsLabels = DIET_LABELS;
  dietIcons = DIET_ICONS;
  allergies = Object.values(ALLERGIES);
  allergiesLabels = ALLERGIES_LABELS;
  allergiesIcons = ALLERGIES_ICONS;

  guestSubscription: Subscription;

  constructor(
    public guestService: GuestService,
    private userService: UserService,
    private dialogService: DialogService,
    private excelService: ExcelService) {

    this.dataSource = new MatTableDataSource<GuestTable>([]);
    this.guestSubscription = this.guestService.guests.subscribe( guests => {
      this.dataSource.data = guests;
    });

    if (this.guestService._lastDataObject) {
      this.dataSource.data = this.guestService._lastDataObject;
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
    this.guestSubscription.unsubscribe();
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

  saveChanges(row: GuestTable) {
    this.guestService.updateGuest({
      uuid: row.uuid,
      name: row.name,
      lastname: row.lastname,
      age: row.age,
      isComing: row.isComing,
      diet: row.diet,
      allergies: row.allergies,
      otherAllergies: row.otherAllergies,
      song: row.song,
    }).subscribe();
  }

  deleteGuest(row: GuestTable) {
    return this.dialogService.openConfirmDialog(`Soll der Gast ${row.name} gelöscht werden?`).afterClosed()
      .subscribe(result => {
        if (result === 'ok') {
          this.guestService.deleteGuest(row.uuid).subscribe(success => {
            if (success) {
              this.userService.updateData();
            }
          });
        }
      });
  }

  generateExcel(event: any) {
    event.stopPropagation();
    
    if (this.dataSource.data) {
      this.excelService.createGuestFile(this.dataSource.data).then(data => {
        const blob = new Blob([data], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          });
        saveAs(blob, "Gästeliste.xlsx");
      });
    }
  }

}