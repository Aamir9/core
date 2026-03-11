import { UserTypes } from './../../shared/AppConsts';
import { UserTypeDto, UserTypeServiceProxy, UserListDto, UserListDtoPagedResultDto } from './../../shared/service-proxies/service-proxies';
import { Component, Injector, Input, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
  PagedListingComponentBase,
  PagedRequestDto
} from 'shared/paged-listing-component-base';
import {
  UserServiceProxy,
  UserDto,
  UserDtoPagedResultDto
} from '@shared/service-proxies/service-proxies';
import { CreateUserDialogComponent } from './create-user/create-user-dialog.component';
import { EditUserDialogComponent } from './edit-user/edit-user-dialog.component';
import { ResetPasswordDialogComponent } from './reset-password/reset-password.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSessionService } from '@shared/session/app-session.service';

class PagedUsersRequestDto extends PagedRequestDto {
  keyword: string;
  userTypeId: number;
  isActive: boolean | null;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  animations: [appModuleAnimation()]
})
export class UsersComponent extends PagedListingComponentBase<UserListDto> implements OnInit {
  @Input() userType:string;
  users: UserListDto[] = [];
  userTypes: UserTypeDto[] = [];
  keyword = '';
  isActive: boolean | null;
  userTypeId: number;
  advancedFiltersVisible = false;
  isCustomer = false;
  title = 'Users';
  constructor(
    injector: Injector,
    private rout: ActivatedRoute,
    private _userService: UserServiceProxy,
    private _userTypeService: UserTypeServiceProxy,
    private _modalService: BsModalService,
    private router: Router,
    private _appSessionService: AppSessionService,
  ) {
    super(injector);
    this.getDataPage(1);
  }

  private setIsCustomer() {
    if(this.userType === UserTypes.Customer) {
      this.isCustomer = true;
    }
  }

  private setTitle() {
    if (this.isCustomer) {
      this.title = 'Customers';
    }
  }

  async ngOnInit() {
    this.setIsCustomer();
    this.setTitle();
    await this.getUserTypes();

    this.ifIsCustomerThenSetCustomerUserTypeFilter();
    this.refresh();
  }
  private ifIsCustomerThenSetCustomerUserTypeFilter() {
    if (this.isCustomer) {
      this.userTypeId = this.userTypes.find(u => u.name === UserTypes.Customer).id;
    }
  }

  async getUserTypes() {
    this.userTypes = (await this._userTypeService.getAll().toPromise()).items;
  }

  createUser(): void {
    this.showCreateOrEditUserDialog();
  }

  editUser(user: UserListDto): void {
    this.showCreateOrEditUserDialog(user.id);
  }

  viewActivities(user: UserListDto): void {
    this.router.navigate(['app/customer/activities', user.id]);
  }

  public resetPassword(user: UserListDto): void {
    this.showResetPasswordUserDialog(user.id);
  }

  clearFilters(): void {
    this.keyword = '';
    this.isActive = undefined;
    this.getDataPage(1);
  }

  protected list(
    request: PagedUsersRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    request.isActive = this.isActive;
    request.userTypeId = this.userTypeId;
    this._userService
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
        this.setTitle();
        this.setIsCustomer();
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
  private showResetPasswordUserDialog(id?: number): void {
    this._modalService.show(ResetPasswordDialogComponent, {
      class: 'modal-lg',
      initialState: {
        id: id,
      },
    });
  }
  private showCreateOrEditUserDialog(id?: number): void {
    let createOrEditUserDialog: BsModalRef;
    if (!id) {
      createOrEditUserDialog = this._modalService.show(
        CreateUserDialogComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      createOrEditUserDialog = this._modalService.show(
        EditUserDialogComponent,
        {
          class: 'customer-modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditUserDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }


}
