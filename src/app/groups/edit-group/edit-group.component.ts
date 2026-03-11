import {
  Component,
  EventEmitter,
  Injector,
  OnInit,
  Output,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from "@shared/paged-listing-component-base";
import {
  GroupServiceProxy,
  UpdateGroupDto,
} from "@shared/service-proxies/service-proxies";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { finalize } from "rxjs/operators";
import { DetailsGroupComponent } from "../details-group/details-group.component";
import {
  UserDto,
  UserListDto,
  UserListDtoPagedResultDto,
  UserServiceProxy,
} from "./../../../shared/service-proxies/service-proxies";
import { AppSessionService } from "./../../../shared/session/app-session.service";

class PagedUsersRequestDto extends PagedRequestDto {
  keyword: string;
  userTypeId: number;
  isActive: boolean | null;
}

@Component({
  selector: "app-edit-group",
  templateUrl: "./edit-group.component.html",
  styleUrls: ["./edit-group.component.css"],
  animations: [appModuleAnimation()],
})
export class EditGroupComponent
  extends PagedListingComponentBase<UserListDto>
  implements OnInit
{
  saving = false;
  @Output() onSave = new EventEmitter<any>();

  groupModel = new UpdateGroupDto();
  keyword = "";
  isActive: boolean | null;
  userTypeId: number;
  title = "Users";
  id: number;
  userIds: any[] = [];
  groupUsers: UserListDto[];
  users: UserListDto[];

  constructor(
    injector: Injector,
    private _groupService: GroupServiceProxy,
    private _userService: UserServiceProxy,
    private _group: GroupServiceProxy,
    public bsModalRef: BsModalRef,
    private route: ActivatedRoute,
    private _sessionService: AppSessionService,
    private _modalService: BsModalService
  ) {
    super(injector);
    this.getDataPage(1);
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params["id"];
    this.refresh();

    if (this.id != null) {
      setTimeout(async () => {
        this.selectedUsers();
      });
    }
  }

  public detailsGroupDialog(): void {
    let detialUserDialog: BsModalRef;
    detialUserDialog = this._modalService.show(DetailsGroupComponent, {
      class: "modal-lg",
      initialState: {
        id: this.id,
      },
    });
  }

  private selectedUsers() {
    const context = this;
    this._group.getGroupUsers(this.id).subscribe((result: any) => {
      context.groupUsers = result.items;

      context.userIds = context.groupUsers.map((u) => u.id);
      console.log("data user info ===>", this.userIds);
    });
  }

  save(): void {
    this.saving = true;
    this.groupModel.userIds = [];
    this.groupModel.userIds = this.userIds;
    this.groupModel.id = this.id;
    console.log(this.groupModel);
    this._groupService.update(this.groupModel).subscribe(
      () => {
        this.notify.info(this.l("SavedSuccessfully"));
        this.bsModalRef.hide();
        this.onSave.emit();
      },
      () => {
        this.saving = false;
      }
    );
  }

  protected list(
    request: PagedUsersRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    this._userService
      .getPagedResult(
        request.keyword,
        1,
        request.isActive,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: UserListDtoPagedResultDto) => {
        this.users = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  protected delete(user: UserDto): void {
    abp.message.confirm(
      this.l("UserDeleteWarningMessage", user.fullName),
      undefined,
      (result: boolean) => {
        if (result) {
          this._userService.delete(user.id).subscribe(() => {
            abp.notify.success(this.l("SuccessfullyDeleted"));
            this.refresh();
          });
        }
      }
    );
  }

  addUserId(userId: number): void {
    if (this.userIds.indexOf(userId) === -1) {
      this.userIds.push(userId);
    } else {
      this.userIds.splice(this.userIds.indexOf(userId), 1);
    }
    this.save();
  }

  isUserIdExist(userId: number): boolean {
    return this.userIds.indexOf(userId) !== -1;
  }
}
