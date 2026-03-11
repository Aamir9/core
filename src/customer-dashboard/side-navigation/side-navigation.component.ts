import { Component, AfterViewInit } from '@angular/core';
import { AppAuthService } from '@shared/auth/app-auth.service';

// Declare the global bootstrap object
declare var bootstrap: any;

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.css']
})
export class SideNavigationComponent implements AfterViewInit {
    constructor(
      private _authService: AppAuthService
    ) {}

  ngAfterViewInit(): void {
    // Initialize the sidebar collapse manually
    const sidebarEl = document.getElementById('sidebar');
    // if (sidebarEl) {
    //   new bootstrap.Collapse(sidebarEl, { toggle: false });
    // }
  }
   logout(): void {
    this._authService.logout();
  }
}
