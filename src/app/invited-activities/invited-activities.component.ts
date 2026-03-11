import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { inviteReponse } from '@shared/AppConsts';
import { ActivityServiceProxy, InviteDto, InviteDtoListResultDto, InviteServiceProxy } from '@shared/service-proxies/service-proxies';
import { AbpSessionService } from 'abp-ng2-module';

@Component({
  selector: 'app-invited-activities',
  templateUrl: './invited-activities.component.html',
  styleUrls: ['./invited-activities.component.css'],
  animations: [accountModuleAnimation()]

})
export class InvitedActivitiesComponent implements OnInit {

  groupId:number;
  groupInviteList : InviteDto[] = [];
  activityTypes: any;
  
  constructor(
    private rout: ActivatedRoute,
    private _inviteService :InviteServiceProxy,
    private router: Router,
    private _activityService: ActivityServiceProxy,
    private _sessionService: AbpSessionService
  ) { }

  ngOnInit(): void {
    this.groupId = Number.parseInt(this.rout.snapshot.params['groupId']);
    if(this.groupId)
        this.getGroupInvites();
    this.GetActivityTypes();
    
  }

  getGroupInvites(){
    this._inviteService.getGroupInvites(this.groupId).subscribe((result:InviteDtoListResultDto) => {
      this.groupInviteList = result.items;
     
    });

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

  goToInvitedActivityDetails(inviteDto:InviteDto): void {
    this.router.navigate(['app/activity-invite-details'], { queryParams: { activityId: inviteDto.activityId, groupId: inviteDto.groupId } });
  }
  private GetActivityTypes() {
    this._activityService.getAllActivityTypes().subscribe((result) => {
      this.activityTypes = result.items;
      
    });
  }

  getAcceptedInviteResponsesCount(data:InviteDto){
   
    let customerResponses = data.responses;
    let count = 0;
    for(let i=0;i<customerResponses.length;i++){
      if(customerResponses[i].response === inviteReponse.accepted)
          count++;
    }
    return count.toString();
  }

  getPendingInviteResponsesCount(data:InviteDto){
    let customerResponses = data.responses;
    let count = 0;
    for(let i=0;i<customerResponses.length;i++){
      if(customerResponses[i].response === inviteReponse.pending)
         count++;
    }
    return count.toString();
  }

  getNotCommingInviteResponsesCount(data:InviteDto){
    let customerResponses = data.responses;
    let count = 0;
    for(let i=0;i<customerResponses.length;i++){
      if(customerResponses[i].response === inviteReponse.declined)
         count++;
    }
    return count.toString();
  }
  
  getUserInviteResponse(data:InviteDto){
    let userId = this._sessionService.userId;
    let customerResponses = data.responses;
    for(let i=0;i<customerResponses.length;i++){
      if(customerResponses[i].id === userId)
          return customerResponses[i].response
    }
    return inviteReponse.pending;
  }
  

}
