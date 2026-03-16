
import { Component, Injector, Input, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import {  UserPoliciesDto, UserPoliciesServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { LayoutStoreService } from '@shared/layout/layout-store.service';
import { CreateUserPolicyComponent } from './create-user-policy/create-user-policy.component';
import { EditUserPolicyComponent } from './edit-user-policy/edit-user-policy.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSessionService } from '@shared/session/app-session.service';

class PagedUserPoliciesRequestDto extends PagedRequestDto {
  keyword: string;
  userId: number;
  sort :"";
  IsActive: boolean | null;
}

@Component({
  selector: 'app-user-policies',
  templateUrl: './user-policies.component.html',
  styleUrls: ['./user-policies.component.css'],
  animations: [appModuleAnimation()]
})
export class UserPoliciesComponent extends PagedListingComponentBase<UserPoliciesDto> implements OnInit {
  keyword: string = '';
  policies: UserPoliciesDto[] = [];
  // userIdLogedIn: number = undefined;
  @Input() userIdParent: number;
  isActiveFilter: boolean | null = null;

  constructor(
    injector: Injector,
    private _userPolicyService: UserPoliciesServiceProxy,
    private _modalService: BsModalService,
    private readonly _layoutService: LayoutStoreService,
    private router: Router,
   public _appSessionService: AppSessionService,
   public route: ActivatedRoute
  ) {
    super(injector);
  }

  ngOnInit(): void {

    // var userparentCustomer = this._appSessionService.userparentCustomer;
    // console.log('userparentCustomer',userparentCustomer);
    // debugger;
    // this.userIdLogedIn = this._appSessionService.userId;

    this.getDataPage(1);
    this._layoutService.updateHeaderTitle('Bruger politikker');
  }

  protected list(
    request: PagedUserPoliciesRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    request.userId = this.userIdParent;
    request.IsActive = this.isActiveFilter;
    this._userPolicyService
      .getPagedResult(
        request.userId,
    request.keyword || undefined,  // optional keyword
  request.IsActive === null ? undefined : request.IsActive, // fix here
    request.skipCount,
    request.maxResultCount,
    request.sort || undefined // optional sorting
      )
      .pipe(finalize(() => finishedCallback()))
      .subscribe((result: any) => {
        this.policies = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  refresh(): void {
    this.getDataPage(this.pageNumber);
  }

  protected delete(policy: UserPoliciesDto): void {
    abp.message.confirm(
      this.l('UserDeleteWarningMessage', policy.company),
      undefined,
      (result: boolean) => {
        if (result) {
          this._userPolicyService.delete(policy.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }

  public showCreateOrEditDialog(id?: number): void {
    let createOrEditDialog: BsModalRef;
    if (!id) {
      createOrEditDialog = this._modalService.show(CreateUserPolicyComponent, {
        class: 'modal-lg',
        initialState: { userId: this.userIdParent }
      });
    } else {
      createOrEditDialog = this._modalService.show(EditUserPolicyComponent, {
        class: 'modal-lg',
        initialState: { id: id, userId: this.userIdParent }
      });
    }

    createOrEditDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }
  viewDetails(id: number): void {
this.router.navigate(['/app/Detail-user-policy'], { queryParams: { id: id } }); 
  }
}
