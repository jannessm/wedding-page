import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accomondations',
  templateUrl: './accomondations.component.html',
  styleUrls: ['./accomondations.component.scss']
})
export class AccomondationsComponent implements OnInit {

  accomondations = [
    {
      "label": "Luther Hotel Wittenberg",
      "href": "https://www.luther-hotel-wittenberg.de/zimmer/",
      "img": "assets/luther-hotel.jpg",
      "description": "Dopperlzimmer ab 84€"
    },

    {
      "label": "Hotel Cranach-Herberge",
      "href": "http://wp.cranach-herberge.de/",
      "img": "assets/cranach-herberge.jpg",
      "description": "Dopperlzimmer ab 90€"
    },

    {
      "label": "Hotel Alte Canzley",
      "href": "https://www.alte-canzley.com/de/zimmer/",
      "img": "assets/alte-canzley.jpg",
      "description": "Dopperlzimmer ab 125€"
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
