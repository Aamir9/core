import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-activity-dailog-component',
  templateUrl: './activity-dailog-component.component.html',
  styleUrls: ['./activity-dailog-component.component.css']
})
export class ActivityDailogComponentComponent implements OnInit {
  @Input() activity: any;
  constructor(public bsModalRef: BsModalRef) { 
  }

  ngOnInit(): void {
   console.log('activity', this.activity);
 }

}
