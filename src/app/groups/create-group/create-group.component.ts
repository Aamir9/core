import { AppSessionService } from './../../../shared/session/app-session.service';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { CreateGroupDto, CustomerDto, CustomerDtoPagedResultDto, CustomerServiceProxy, GroupServiceProxy, UserDto, UserListDto, UserListDtoPagedResultDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/internal/operators/finalize';


class PagedUsersRequestDto extends PagedRequestDto {
  keyword: string;
  userTypeId: number;
  isActive: boolean | null;
}
@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css'],
  animations: [appModuleAnimation()]
})
export class CreateGroupComponent extends PagedListingComponentBase<UserListDto> implements OnInit {

  saving = false;
  @Output() onSave = new EventEmitter<any>();

  groupModel  = new CreateGroupDto();
  users: UserListDto[] = [];
  keyword = '';
  isActive: boolean | null;
  userTypeId: number;
  title = 'Users';
  userIds : number[] = [];

  constructor(
    injector: Injector,
    private _groupService: GroupServiceProxy,
    private _userService: UserServiceProxy,
    private _appSessionService:AppSessionService,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
    this.getDataPage(1);
  }

  ngOnInit(): void {
    this.refresh();
  }

  save(): void {
    this.saving = true;
    this.groupModel.userIds = [];
    this.groupModel.userIds = this.userIds;
    console.log(this.groupModel);
    this._groupService
      .create(this.groupModel)
      .subscribe(
        () => {
          this.notify.info(this.l('SavedSuccessfully'));
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
    request.isActive = this.isActive;
    request.userTypeId = 1;
    this._userService
      // .getPagedResult(
      //   request.keyword,
      //   undefined,undefined,undefined,undefined,undefined,undefined,
      //   request.skipCount,
      //   request.maxResultCount
      // )
      .getPagedResult(
        request.keyword,
       request.userTypeId,
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
      this.l('UserDeleteWarningMessage', user.fullName),
      undefined,
      (result: boolean) => {
        if (result) {
          this._userService.delete(user.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }

  addUserId(userId: number): void {
    if (this.userIds.indexOf(userId) === -1) {
      this.userIds.push(userId);
    }
    else {
      this.userIds.splice(this.userIds.indexOf(userId), 1);
    }
    console.log(this.userIds);
  }


  isUserIdExist(userId: number): boolean {
    return this.userIds.indexOf(userId) !== -1;
  }
}
