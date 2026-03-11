import { Component, Injector, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppComponentBase } from "@shared/app-component-base";
import { FaultStatuses } from "@shared/AppConsts";
import {
  ActivityDto,
  ActivityServiceProxy,
  CommentDto,
  CommentServiceProxy,
  CreateCommentDto,
  CustomerResponseDto,
  FaultDto,
  FaultServiceProxy,
  IFaultFile,
  InviteDto,
  UpdateFaultStatusDto,
  UpdateSolutionNote,
} from "@shared/service-proxies/service-proxies";
import { AppSessionService } from "@shared/session/app-session.service";
import { AbpSessionService } from "abp-ng2-module";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { UploadFilesComponent } from "../upload-files/upload-files.component";

@Component({
  selector: "app-fault-detail",
  templateUrl: "./fault-detail.component.html",
  styleUrls: ["./fault-detail.component.css"],
})
export class FaultDetailComponent extends AppComponentBase implements OnInit {
  faultId: number;
  inviteInfo: InviteDto = new InviteDto();
  activityDto: ActivityDto = new ActivityDto();
  customersReponses: CustomerResponseDto[] = [];
  activityTypes: any;
  comments: CommentDto[];
  commentDto = new CreateCommentDto();
  userId: number;
  faultDto = new FaultDto();
  solutionNote: string;
  imageAndVideos: IFaultFile[] = [];
  files: IFaultFile[] = [];
  previewModalRef: BsModalRef;
  selectedFileForPreview: IFaultFile;

  constructor(
    public injector: Injector,
    private route: ActivatedRoute,
    private _sessionService: AbpSessionService,
    private _appSessionService: AppSessionService,
    private _commentService: CommentServiceProxy,
    private _faultService: FaultServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  async ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.userId = this._sessionService.userId;
      this.faultId = Number.parseInt(params["faultId"]);
      this.getFaultDetail();
      if (this.userId > 0 && this.faultId > 0) {
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
    this.commentDto.activityId = this.faultDto.activityId;
    this._commentService.create(this.commentDto).subscribe((result) => {
      this.notify.info(this.l("SavedSuccessfully"));
      this.commentDto = new CreateCommentDto();
      this.getComments();
    });
  }

  getComments() {
    this._commentService
      .getAll(this.faultDto.activityId)
      .subscribe((result) => {
        this.comments = result.items;
      });
  }

  getFaultDetail() {
    this._faultService.getById(this.faultId).subscribe((result) => {
      this.faultDto = result;
      this.imageAndVideos = [];
      this.files = [];
      this.faultDto.files.forEach((file) => {
        if (file.type.includes("image") || file.type.includes("video"))
          this.imageAndVideos.push(file);
        else this.files.push(file);
      });
      console.log(this.imageAndVideos, this.files);
      this.getComments();
    });
  }

  updateFaultStatus(response: number) {
    let updateFault = new UpdateFaultStatusDto();
    updateFault.id = this.faultId;
    updateFault.faultStatus = FaultStatuses.Resolved;
    this._faultService.updateFaultStatus(updateFault).subscribe((result) => {
      this.notify.info(this.l("SavedSuccessfully"));
      this.getFaultDetail();
    });
  }

  isAdminUser(): boolean {
    return this._appSessionService.isAdminUser();
  }

  isFaultResolved() {
    return this.faultDto.status === "Resolved";
  }
  addSolutionNote() {
    let solutionNote = new UpdateSolutionNote();
    solutionNote.id = this.faultDto.id;
    solutionNote.solutionNote = this.faultDto.solutionNote;
    this._faultService.saveFaultSolution(solutionNote).subscribe((res) => {
      this.notify.info(this.l("SavedSuccessfully"));
    });
  }

  // isLink(text: string): boolean {
  //   const urlRegex = /(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?/i;
  //   return urlRegex.test(text);
  // }

  containsLink(text: string): boolean {
    const urlRegex = /(http:\/\/|https:\/\/)\S+/;
    return urlRegex.test(text);
  }

  extractLink(text: string): string {
    const matches = text.match(/(http:\/\/|https:\/\/)\S+/);
    return matches ? matches[0] : "";
  }

  uploadDialog(): void {
    let createFaultDialog: BsModalRef;
    createFaultDialog = this._modalService.show(UploadFilesComponent, {
      class: "modal-lg",
      initialState: {
        faultId: this.faultId,
      },
    });
    createFaultDialog.content.onSave.subscribe(() => {
      this.getFaultDetail();
    });
  }

  // replace extension with .png
  generateVideoThumbnail(videoSrc: string): string {
    return videoSrc.replace(/\.[^/.]+$/, ".png");
  }

  // preview file inside a modal using modal service in the template passed in the params of this function
  previewFile(file: IFaultFile, content: any): void {
    this.selectedFileForPreview = file
    this.previewModalRef = this._modalService.show(content, {
      class: "modal-lg",
    });
  }
}
