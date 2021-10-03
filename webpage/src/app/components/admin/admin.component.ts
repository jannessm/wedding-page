import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  page = 0;

  pages = ['user', 'guests', 'songs', 'costs'];

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.has('page')) {
        this.page = this.pages.findIndex(page => page === params.get('page')) | 0;
      }
    });
  }

  ngOnInit(): void {
  }

}
