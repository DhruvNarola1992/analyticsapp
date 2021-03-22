import { Component, OnInit } from '@angular/core';

class NavLink {
  constructor(public path: string, public label: string) {}
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  navLinks: NavLink[] = [];
  constructor() {}
  ngOnInit() {
    this.navLinks = [
      new NavLink('table', 'Day'),
      // new NavLink('datepicker', 'Datepicker'),
      new NavLink('add', 'Week'),
      new NavLink('slider', 'Month'),
      new NavLink('checkbox', 'Custom'),
    ];
  }
}
