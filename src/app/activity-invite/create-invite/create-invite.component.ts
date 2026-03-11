import { Component, Injector, Input, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { CreateInviteDto, GroupDto, GroupServiceProxy, InviteServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';



@Component({
  selector: 'app-create-invite',
  templateUrl: './create-invite.component.html',
  styleUrls: ['./create-invite.component.css'],
  animations: [appModuleAnimation()]
})
export class CreateInviteComponent extends AppComponentBase implements OnInit {
 
  inviteModel = new CreateInviteDto();
  @Input() activityId : number;
  keyword = '';
  groups: GroupDto[] = [];
  groupModel: GroupDto = new GroupDto();
  groupId: number = 0;
  
  constructor(
    public injector: Injector,
    public bsModalRef: BsModalRef,
    private _groupService: GroupServiceProxy,
    private _inviteService :InviteServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {

    this.getAllGroups();
  }

 getAllGroups(){
  this._groupService.getAll().subscribe((result) => {
    this.groups = result.items;
  });
  }


  addInvite(){

  
   if(this.groupId > 0 ){

    this.inviteModel.groupId = this.groupId;
    this.inviteModel.activityId = this.activityId;
    this._inviteService.create(this.inviteModel).subscribe(
      () => {
        this.notify.success(this.l('SavedSuccessfully'));
      },
    );
  }
  else{

    this.notify.error(this.l('Group Not Selected'));
  }
  }

  // getInviteByActivityId(groupId:number): boolean{
  //   let isExists = false;
  //   this._inviteService.getGroupInvites(groupId).subscribe(
  //     (result) => {
  //       if(result.items.length > 0){
  //         isExists = true;
  //       }
  //       else{
  //         isExists =  false;
  //       }
  //     },
  //   );
  //   return isExists;
  // }

}
