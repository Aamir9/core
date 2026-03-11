import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CompanyLoginInfoDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';

@Component({
  selector: 'sidebar-logo',
  templateUrl: './sidebar-logo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarLogoComponent  implements OnInit  {

  companyInfo  = new CompanyLoginInfoDto(); 

  constructor(private appSessionService: AppSessionService) {
  }
  
  ngOnInit() {
    this.companyInfo = this.appSessionService.company;
  }
}
