import { Component, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'app-activities-calendar',
  templateUrl: './activities-calendar.component.html',
  styleUrls: ['./activities-calendar.component.css'],
  animations: [appModuleAnimation()]
})
export class ActivitiesCalendarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
