import { Component, Injector, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TicketStatuses } from "@shared/AppConsts";
import { AppComponentBase } from "@shared/app-component-base";
import {
  ActivityDto,
  CommentDto,
  CommentServiceProxy,
  CreateCommentDto,
  CustomerResponseDto,
  GroupServiceProxy,
  TicketDto,
  TicketServiceProxy,
  UpdateTicketSolutionNote,
  UpdateTicketStatusDto,
  UserListDto,
} from "@shared/service-proxies/service-proxies";
import { AppSessionService } from "@shared/session/app-session.service";
import { AbpSessionService } from "abp-ng2-module";

@Component({
  selector: "app-detail-ticket",
  templateUrl: "./detail-ticket.component.html",
  styleUrls: ["./detail-ticket.component.css"],
})
export class DetailTicketComponent extends AppComponentBase implements OnInit {
  ticketId: number;
  activityDto: ActivityDto = new ActivityDto();
  customersReponses: CustomerResponseDto[] = [];
  activityTypes: any;
  comments: CommentDto[];
  commentDto = new CreateCommentDto();
  userId: number;
  ticketDto = new TicketDto();
  ticketAssignee: any;

  constructor(
    public injector: Injector,
    private route: ActivatedRoute,
    private _sessionService: AbpSessionService,
    private _appSessionService: AppSessionService,
    private _commentService: CommentServiceProxy,
    private _ticketService: TicketServiceProxy,
    private _group: GroupServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.userId = this._sessionService.userId; //Number.parseInt(params['userId']);
      this.ticketId = Number.parseInt(params["ticketId"]);
      this.getTicketDetail();
      if (this.userId > 0 && this.ticketId > 0) {
        this.getComments();
      }
    });
  }

  getActivityTypeName(id: number) {
    if (this.activityTypes) {
      for (let i = 0; i < this.activityTypes.length; i++) {
        if (this.activityTypes[i].id == id) return this.activityTypes[i].name;
      }
    }
    return "";
  }
  addComment() {
    this.commentDto.commentText = this.commentDto.commentText;
    this.commentDto.activityId = this.ticketDto.activityId;
    this._commentService.create(this.commentDto).subscribe((result) => {
      this.notify.info(this.l("SavedSuccessfully"));
      this.commentDto = new CreateCommentDto();
      this.getComments();
    });
  }

  getComments() {
    this._commentService
      .getAll(this.ticketDto.activityId)
      .subscribe((result) => {
        this.comments = result.items;
        console.log("this.comments", this.comments, result.items);
      });
  }

  getTicketDetail() {
    this._ticketService.getById(this.ticketId).subscribe((result) => {
      this.ticketDto = result;
      this.ticketAssignee = (this.ticketDto as any).users?.find(
        (u) => u.userId == this._sessionService.userId
      );
      this.getComments();
    });
  }

  ticketUserStatus(ticketUser: any): string {
    let userStatus;
    switch (ticketUser.status) {
      case 0:
        userStatus = "Pending";
        break;
      case 1:
        userStatus = "Accepted";
        break;
      case 2:
        userStatus = "Rejected";
        break;
      default:
        userStatus = "Pending";
        break;
    }
    return userStatus;
  }

  isAdminUser(): boolean {
    return this._appSessionService.isAdminUser();
  }

  isFaultResolved() {
    return this.ticketAssignee?.status !== 1;
  }

  addSolutionNote() {
    let solutionNote = new UpdateTicketSolutionNote();
    solutionNote.id = this.ticketDto.id;
    solutionNote.solutionNote = this.ticketDto.solutionNote;
    this._ticketService.saveTicketSolution(solutionNote).subscribe((res) => {
      this.notify.info(this.l("SavedSuccessfully"));
      this.getTicketDetail();
    });
  }

  updateTicketUserStatus(statusCode: number) {
    let updateStatus = new UpdateTicketStatusDto();
    updateStatus.id = this.ticketId;
    updateStatus.ticketStatus = statusCode;
    this._ticketService
      .updateTicketUserStatus(updateStatus)
      .subscribe((result) => {
        this.notify.info(this.l("SavedSuccessfully"));
        this.ticketAssignee.status = statusCode;
        this.getTicketDetail();
      });
  }

  updateTicketStatus(statusCode: number) {
    let updateStatus = new UpdateTicketStatusDto();
    updateStatus.id = this.ticketId;
    updateStatus.ticketStatus = statusCode;
    this._ticketService.updateTicketStatus(updateStatus).subscribe((result) => {
      this.notify.info(this.l("SavedSuccessfully"));
      this.ticketDto.status = statusCode.toString();
      this.getTicketDetail();
    });
  }
}
