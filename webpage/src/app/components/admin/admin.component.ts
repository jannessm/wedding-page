import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CacheService } from 'src/app/services/cache/cache.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  page = 0;

  pages = ['user', 'guests', 'songs', 'costs'];

  constructor(private activatedRoute: ActivatedRoute, private location: Location, private cacheService: CacheService) {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.has('page')) {
        this.page = this.pages.findIndex(page => page === params.get('page')) | 0;
      }
    });
  }

  setRouteParam(event: number) {
    this.location.go('/user/admin/' + this.pages[event]);
  }

  ngOnInit() {
    this.cacheService.getData().subscribe();
  }

}
