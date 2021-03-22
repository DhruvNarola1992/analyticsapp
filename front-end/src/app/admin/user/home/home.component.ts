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
      new NavLink('table', 'Active'),
      // new NavLink('datepicker', 'Datepicker'),
      // new NavLink('checkbox', 'Checkbox'),
      // new NavLink('slider', 'Success'),
      // new NavLink('inputs', 'Inputs'),
      new NavLink('cancel', 'Block')
    ];
  }
}
