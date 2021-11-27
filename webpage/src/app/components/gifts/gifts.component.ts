import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gifts',
  templateUrl: './gifts.component.html',
  styleUrls: ['./gifts.component.scss']
})
export class GiftsComponent implements OnInit {

  gifts = ['Gutes Wetter', 'Liebe', 'Gute Laune und Spaß mit euch', 'Segen', 'Eine kleine Finanzspritze für unsere gemeinsame Zukunft']

  constructor() { }

  ngOnInit(): void {
  }

}
