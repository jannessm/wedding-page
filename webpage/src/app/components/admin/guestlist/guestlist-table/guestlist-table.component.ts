import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { GuestService } from 'src/app/services/guest/guest.service';
import { GuestTable } from 'src/models/guest-table';
import { AllergiesVector, RegisteredVector } from 'src/models/vector';
import { AGE_CATEGORIES, AGE_CATEGORY_ICONS, AGE_CATEGORY_LABELS, DIETS, DIET_ICONS, DIET_LABELS } from 'src/models/user';
import { ALLERGIES, ALLERGIES_ICONS, ALLERGIES_LABELS } from 'src/models/allergies';

@Component({
  selector: 'app-guestlist-table',
  templateUrl: './guestlist-table.component.html',
  styleUrls: ['./guestlist-table.component.scss']
})
export class GuestlistTableComponent implements AfterViewInit {
  displayedColumns: string[] = ['user', 'name', 'lastname', 'age', 'diet', 'isRegistered', 'edit', 'delete'];
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

  adults = new RegisteredVector();
  children = new RegisteredVector();
  infants = new RegisteredVector();

  vegan = 0;
  vegetarian = 0;
  normal = 0;

  allergiesCounter = new AllergiesVector(Object.values(ALLERGIES).length);
  otherAllergies: string[] = [];

  constructor(private guestService: GuestService, private dialogService: DialogService) {

    this.dataSource = new MatTableDataSource<GuestTable>([]);
    this.guestService.guests.subscribe( guests => {
      this.dataSource.data = guests;
      this.countData(guests);
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

  saveChanges(row: GuestTable) {
    this.guestService.updateGuest(row.user, {
      uuid: row.uuid,
      name: row.name,
      lastname: row.lastname,
      age: row.age,
      isComing: row.isComing,
      diet: row.diet,
      allergies: row.allergies,
      otherAllergies: row.otherAllergies,
      song: row.song
    }).subscribe(oldGuest => {
      this.countData(this.dataSource.data);
      if(!!oldGuest) {
        // TODO: handle failed changes
      }
    });
  }

  deleteGuest(row: GuestTable) {
    return this.dialogService.openConfirmDialog(`Soll der Gast ${row.name} gelöscht werden?`).afterClosed()
      .subscribe(result => {
        if (result === 'ok') {
          this.guestService.deleteGuest(row.user, row.uuid).subscribe();
        }
      });
  }

  countData(guests: GuestTable[]) {
    this.adults.reset();
    this.children.reset();
    this.infants.reset();

    this.vegan = 0;
    this.vegetarian = 0;
    this.normal = 0;

    this.allergiesCounter.reset();

    this.otherAllergies = [];

    guests.forEach((guest: GuestTable) => {
      const registered = guest.isComing ? 1 : 0;

      switch(guest.age) {
        case AGE_CATEGORIES.ADULT:
          this.adults.count(guest.isComing);
          break;
        case AGE_CATEGORIES.CHILD:
          this.children.count(guest.isComing);
          break;
        case AGE_CATEGORIES.INFANT:
          this.infants.count(guest.isComing);
          break;
      }

      if (guest.isComing) {
        switch(guest.diet) {
          case DIETS.VEGAN:
            this.vegan++;
            break;
          case DIETS.VEGETARIAN:
            this.vegetarian++;
            break;
          case DIETS.NORMAL:
            this.normal++;
        }
      }

      if (guest.isComing) {
        const allergyVec = this.allergies.map(allergy => guest.allergies.includes(allergy) ? 1 : 0);
        this.allergiesCounter.add(new AllergiesVector().from(allergyVec));
      }

      if (guest.isComing && guest.otherAllergies.trim() !== '') {
        this.otherAllergies.push(guest.otherAllergies);
      }
    });
  }

}