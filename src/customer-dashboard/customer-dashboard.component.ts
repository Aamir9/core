import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit, Renderer2 } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { LayoutStoreService } from '@shared/layout/layout-store.service';
import { ChatService } from '@shared/service-custom/chat.service';
import { SignalRAspNetCoreHelper } from '@shared/helpers/SignalRAspNetCoreHelper';
import { AppSessionService } from '@shared/session/app-session.service';
@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css'],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerDashboardComponent    {
   currentYear: number;
  versionText: string;
  constructor(
     injector: Injector,
     public appSession: AppSessionService
    
   ) {
      this.currentYear = new Date().getFullYear();
    this.versionText =
      this.appSession.application.version +
      ' [' +
      this.appSession.application.releaseDate.toDateString() +
      ']';
   }
    
       
 
}
