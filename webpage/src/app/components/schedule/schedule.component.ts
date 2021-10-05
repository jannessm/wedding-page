import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  items: {title:string,subtitle: string, time:string, location:string, locationName: string}[] = [
    {title: 'Trauung', subtitle: '', time: '14:30', locationName: 'Christuskirche', location: 'Dessauer Str. 240, 06886 Lutherstadt Wittenberg'},
    {title: 'Empfang', subtitle: 'mit Kaffee und Kuchen', time: 'ab 16:00', locationName: 'Adventgemeinde Lutherstadt Wittenberg', location: 'Gustav-Adolf-Straße 10, 06886 Lutherstadt Wittenberg'},
    {title: 'Feier', subtitle: 'mit Abendprogramm', time: 'ab 19:00', locationName: 'Adventgemeinde Lutherstadt Wittenberg', location: 'Gustav-Adolf-Straße 10, 06886 Lutherstadt Wittenberg'},
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
