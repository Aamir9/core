import { Component, Injector, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { inviteReponse } from '@shared/AppConsts';
import { ActivityServiceProxy, CustomerDto, InviteDto, InviteServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { AbpSessionService } from 'abp-ng2-module';

@Component({
  selector: 'app-customer-invites',
  templateUrl: './customer-invites.component.html',
  styleUrls: ['./customer-invites.component.css']
})
export class CustomerInvitesComponent  extends AppComponentBase implements OnInit {
  @Input() selectedCustomer : CustomerDto = new CustomerDto();
  inviteDto:InviteDto[] =  [];
  activityTypes: any;

  constructor(
    injector: Injector,
    private router: Router,
    private _activityService: ActivityServiceProxy,
    private _inviteService: InviteServiceProxy,
    private _sessionService: AbpSessionService
   
  ) {
    super(injector);
    
  }

  ngOnInit(): void {

    this._inviteService.getCustomerInvites(this.selectedCustomer.id).subscribe(result => {

      this.inviteDto = result.items;
      console.log("invite DTo ====>", this.inviteDto);
    });

    this.GetActivityTypes();
  }

  getUserInviteResponse(data: InviteDto) {
    let userId = this._sessionService.userId;
    let customerResponses = data.responses;
    for (let i = 0; i < customerResponses.length; i++) {
      if (customerResponses[i].id === userId)
        return customerResponses[i].response
    }
    return inviteReponse.pending;
  }

  getActivityTypeName(id:number){
    if(this.activityTypes){
      for(let i=0;i<this.activityTypes.length;i++){
        if(this.activityTypes[i].id == id)
          return this.activityTypes[i].name;
      }
    }
    return "";
  }


  private GetActivityTypes() {
    this._activityService.getAllActivityTypes().subscribe((result) => {
      this.activityTypes = result.items;
      
    });
  }

  goToInvitedActivityDetails(inviteDto:InviteDto): void {
    this.router.navigate(['app/customer-invites-details'], { queryParams: { activityId: inviteDto.activityId, userId: this.selectedCustomer.id } });
  }


}
