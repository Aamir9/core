import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activity-invite',
  templateUrl: './activity-invite.component.html',
  styleUrls: ['./activity-invite.component.css']
})
export class ActivityInviteComponent implements OnInit {

  constructor( private router: Router) { }

  ngOnInit(): void {
  }

  goToInvitedActivityDetails(): void {
    this.router.navigate(['app/activity-invite-details']);
  }
}
