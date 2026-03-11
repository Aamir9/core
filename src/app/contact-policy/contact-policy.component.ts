import { Component, Injector, Input, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { LayoutStoreService } from '@shared/layout/layout-store.service';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { CustomerDto, UserPoliciesDto, UserPoliciesServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CreateContactPolicyComponent } from './create-contact-policy/create-contact-policy.component';
import { EditContactPolicyComponent } from './edit-contact-policy/edit-contact-policy.component';
import { finalize } from 'rxjs/operators';

class PagedUserPoliciesRequestDto extends PagedRequestDto {
  keyword: string;
  userId: number;
  sort: "";
  IsActive: boolean | null;
}

@Component({
  selector: 'app-contact-policy',
  templateUrl: './contact-policy.component.html',
  styleUrls: ['./contact-policy.component.css'],
  animations: [appModuleAnimation()]
})
export class ContactPolicyComponent extends PagedListingComponentBase<UserPoliciesDto> implements OnInit {
  keyword: string = '';
  policies: UserPoliciesDto[] = [];
  @Input() userIdLogedIn: number;
  @Input() userIdParent: number;
  isActiveFilter: boolean | null = null;
  userparentCustomer: CustomerDto;

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
    this.userparentCustomer = this._appSessionService.userparentCustomer;
    if (this.userparentCustomer && this.userparentCustomer.userId) {
      this.userIdLogedIn = this.userparentCustomer.userId;
    }
    this.getDataPage(1);
    this._layoutService.updateHeaderTitle('Policies');
  }
  protected list(
    request: PagedUserPoliciesRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    request.userId = this.userIdLogedIn;
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
      createOrEditDialog = this._modalService.show(CreateContactPolicyComponent, {
        class: 'modal-lg',
        initialState: { userId: this.userIdParent }
      });
    } else {
      createOrEditDialog = this._modalService.show(EditContactPolicyComponent, {
        class: 'modal-lg',
        initialState: { id: id, userId: this.userIdParent }
      });
    }

    createOrEditDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }
  viewDetails(id: number): void {
    this.router.navigate(['/app/detail-contact-policy'], { queryParams: { id: id } });
  }

}
