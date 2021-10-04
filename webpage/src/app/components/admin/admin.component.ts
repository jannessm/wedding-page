import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  page = 0;

  pages = ['user', 'guests', 'songs', 'costs'];

  constructor(private activatedRoute: ActivatedRoute, private location: Location) {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.has('page')) {
        this.page = this.pages.findIndex(page => page === params.get('page')) | 0;
      }
    });
  }

  setRouteParam(event: number) {
    this.location.go('/user/admin/' + this.pages[event]);
  }

}
