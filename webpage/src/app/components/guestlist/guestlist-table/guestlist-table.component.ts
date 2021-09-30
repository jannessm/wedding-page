import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GuestService } from 'src/app/services/guest/guest.service';
import { GuestTable } from 'src/models/guest-table';
import { AGE_CATEGORIES, AGE_CATEGORY_ICONS, AGE_CATEGORY_LABELS, DIETS, DIET_ICONS, DIET_LABELS } from 'src/models/user';

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

  // comming | not comming | total 
  adults = [0,0,0];
  children = [0, 0, 0];
  infants = [0, 0, 0];

  vegan = 0;
  vegetarian = 0;
  glutenFree = 0;

  constructor(private guestService: GuestService, private iconRegistry: MatIconRegistry) {

    this.dataSource = new MatTableDataSource<GuestTable>([]);
    this.guestService.getData();
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
    this.guestService.updateData(row);
  }

  deleteUser(row: GuestTable) {
    this.guestService.deleteData(row);
  }

  countData(guests: GuestTable[]) {
    this.adults = [0, 0];
    this.children = [0, 0];
    this.infants = [0, 0];

    this.vegan = 0;
    this.vegetarian = 0;
    this.glutenFree = 0;

    guests.forEach((guest: GuestTable) => {
      const registered = guest.isRegistered ? 1 : 0;

      switch(guest.age) {
        case AGE_CATEGORIES.ADULT:
          this.adults[1]++;
          this.adults[0] += registered;
          break;
        case AGE_CATEGORIES.CHILD:
          this.children[1]++;
          this.children[0] += registered;
          break;
        case AGE_CATEGORIES.INFANT:
          this.infants[1]++;
          this.infants[0] += registered;
          break;
      }

      if (guest.isRegistered) {
        switch(guest.diet) {
          case DIETS.VEGAN:
            this.vegan++;
            break;
          case DIETS.VEGETARIAN:
            this.vegetarian++;
            break;
          case DIETS.GLUTEN_FREE:
            this.glutenFree++;
            break;
        }
      }
    });
  }

}