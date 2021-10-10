import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

interface Item {
  title: string;
  subtitle: string;
  time: string;
  location: string;
  locationName: string;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent {

  items: Item[] = [
    {title: 'Trauung', subtitle: '', time: '14:30', locationName: 'Christuskirche Lutherstadt Wittenberg', location: 'Dessauer Str. 240, 06886 Lutherstadt Wittenberg'},
    {title: 'Empfang', subtitle: 'mit Kaffee und Kuchen', time: 'ab 16:00', locationName: 'Adventgemeinde Lutherstadt Wittenberg', location: 'Gustav-Adolf-Straße 10, 06886 Lutherstadt Wittenberg'},
    {title: 'Feier', subtitle: 'mit Abendprogramm', time: 'ab 19:00', locationName: 'Adventgemeinde Lutherstadt Wittenberg', location: 'Gustav-Adolf-Straße 10, 06886 Lutherstadt Wittenberg'},
  ];

  constructor(private sanitizer: DomSanitizer) { }

  getMap(item: Item) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`
    );
  }

}
