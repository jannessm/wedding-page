import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GuestService } from 'src/app/services/guest/guest.service';
import { GuestTable } from 'src/models/guest-table';

@Component({
  selector: 'app-guestlist-table',
  templateUrl: './guestlist-table.component.html',
  styleUrls: ['./guestlist-table.component.scss']
})
export class GuestlistTableComponent implements AfterViewInit {
  displayedColumns: string[] = ['user', 'name', 'lastname', 'age', 'diet', 'isRegistered'];
  dataSource: MatTableDataSource<GuestTable>;

  @Input()
  expanded: boolean = false;

  @Output()
  opened = new EventEmitter();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(private guestService: GuestService) {
    this.dataSource = new MatTableDataSource<GuestTable>([]);
    this.guestService.guests.subscribe( guests => this.dataSource = new MatTableDataSource(guests));
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

  emitOpened() {
    this.opened.emit();
  }

  updateData() {

  }

}