import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { inviteReponse } from '@shared/AppConsts';
import { ActivityDto, ActivityServiceProxy, ActivityTaskDto, ActivityTaskServiceProxy, AssignToUserInputDto, CommentDto, CommentServiceProxy, CreateCommentDto, CustomerResponseDto, InviteDto, InviteServiceProxy, UpdateInviteResponseInputDto, UserLoginInfoDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { AbpSessionService } from 'abp-ng2-module';

@Component({
  selector: 'app-customer-invite-details',
  templateUrl: './customer-invite-details.component.html',
  styleUrls: ['./customer-invite-details.component.css'],
  animations: [accountModuleAnimation()]
})
export class CustomerInviteDetailsComponent extends AppComponentBase implements OnInit {

  activityId: number;
  //groupId: number;
  inviteInfo: InviteDto = new InviteDto();
  loginInfouser : UserLoginInfoDto = new UserLoginInfoDto();
  activityDto : ActivityDto = new ActivityDto();
  customersReponses: CustomerResponseDto[] = [];
  activityTypes: any;
  acceptedInvites: CustomerResponseDto[] = [];
  declinedInvites: CustomerResponseDto[] = [];
  pendingInvites: CustomerResponseDto[] = [];
  activitytasks: CustomerResponseDto[] = [];
  comments: CommentDto[];
  commentDto = new CreateCommentDto();
  assignTask:AssignToUserInputDto = new AssignToUserInputDto();
  taskList:ActivityTaskDto[] = [];
  userId: number;

  
  constructor(
    public injector: Injector,
    private route: ActivatedRoute,
    private _inviteService: InviteServiceProxy,
    private _activityService: ActivityServiceProxy,
    private _sessionService: AbpSessionService,
    private _appSessionService: AppSessionService,
    private _commentService: CommentServiceProxy,
    private _taskService: ActivityTaskServiceProxy,
  ) {
    super(injector);

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
     
      this.userId = Number.parseInt(params['userId']);
      this.activityId = Number.parseInt(params['activityId']);
      if (this.userId > 0 && this.activityId > 0) {
        this.getActivityInvites();
      }
 
    });
  }
  getActivityInvites() {
    this._inviteService.getCustomerInvite(0, this.activityId,this.userId).subscribe(
      (result: InviteDto) => {

        console.log("result",result)
        this.inviteInfo = result;
        this.activityDto = this.inviteInfo.activity
        if (this.inviteInfo.id > 0) {
          this.getComments();
        }
        this.customersReponses = result.responses;
        if (this.customersReponses) {
          this.GetActivityTypes();
          this.getAcceptedInviteResponses();
          this.getPendingInviteResponses();
          this.getDeclinedInviteResponses();
        }
      },
      (result) => {
        console.log(result.error);
      }
    );
  }

  getActivityTypeName(id: number) {
    if (this.activityTypes) {
      for (let i = 0; i < this.activityTypes.length; i++) {
        if (this.activityTypes[i].id == id)
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

  getAcceptedInviteResponses() {
    this.acceptedInvites = []
    for (let i = 0; i < this.customersReponses.length; i++) {
      if (this.customersReponses[i].response === inviteReponse.accepted)
        this.acceptedInvites.push(this.customersReponses[i]);
    }

  }

  getPendingInviteResponses() {

    this.pendingInvites = [];
    for (let i = 0; i < this.customersReponses.length; i++) {
      if (this.customersReponses[i].response === inviteReponse.pending)
        this.pendingInvites.push(this.customersReponses[i]);
    }
  }

  getDeclinedInviteResponses() {
    this.declinedInvites = [];
    for (let i = 0; i < this.customersReponses.length; i++) {
      if (this.customersReponses[i].response === inviteReponse.declined)
        this.declinedInvites.push(this.customersReponses[i]);
    }
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

  addComment() {
    this.commentDto.commentText = this.commentDto.commentText;
    this.commentDto.activityId = this.inviteInfo.activityId;
    this._commentService.create(this.commentDto).subscribe((result) => {
      this.notify.info(this.l('SavedSuccessfully'));
      this.commentDto = new CreateCommentDto();
      this.getComments();
    });
  }

  getComments() {
    this._commentService.getAll(this.inviteInfo.activity.id).subscribe((result) => {
      this.comments = result.items;
    });
  }

  updateInviteResponse(response: number) {
    let inviteModel = new UpdateInviteResponseInputDto();
    inviteModel.id = this.inviteInfo.id;
    inviteModel.response = response;
    this._inviteService.updateInviteResponse(inviteModel).subscribe((result) => {
      this.notify.info(this.l('SavedSuccessfully'));
      this.getActivityInvites();
    }
    );  
  }



isAdminUser(): boolean {

 return this._appSessionService.isAdminUser();
}

}

