import { Component, Injector, Input, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { LayoutStoreService } from '@shared/layout/layout-store.service';
import { finalize } from 'rxjs/operators';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { UserPoliciesDto, UserPoliciesServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { NgZone } from '@angular/core';

class PagedUserPoliciesRequestDto extends PagedRequestDto {
  keyword: string;
  userId: number;
  sort :"";
  IsActive: boolean | null;
}

@Component({
  selector: 'app-user-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.css'],
   animations: [appModuleAnimation()]
})
export class UserPoliciesComponent extends PagedListingComponentBase<UserPoliciesDto> implements OnInit  {
keyword: string = '';
  policies: UserPoliciesDto[] = [];
  isActiveFilter: boolean | null = null;

  constructor(
    injector: Injector,
    private _userPolicyService: UserPoliciesServiceProxy,
    private _appSessionService : AppSessionService,
    private readonly _layoutService: LayoutStoreService,
    private zone: NgZone,
  ) {
    super(injector);
   
  }

  ngOnInit(): void {
        this._layoutService.updateHeaderTitle('<i class="fas fa-scroll mr-2"></i>Policies');
        this.getDataPage(1); 
  }

  protected list(
    request: PagedUserPoliciesRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    request.userId = this._appSessionService.userId || undefined;
     request.IsActive = this.isActiveFilter;
    this._userPolicyService
      .getPagedResult(
      request.userId,
      request.keyword || undefined, 
      request.IsActive === null ? undefined : request.IsActive,
      request.skipCount || 0,
      request.maxResultCount || 10,
      request.sort || undefined 
      )
      .pipe(finalize(() => finishedCallback()))
      .subscribe((result: any) => {
     
        this.policies = result.items;
        this.showPaging(result, pageNumber);
      },
          (error) => {
        console.error("LOAD ERROR:", error);
        finishedCallback(); // ensure spinner hides
      }
    );
  }

  refresh(): void {
    this.getDataPage(this.pageNumber || 1);
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


  viewDetails(id: number): void {
// this.router.navigate(['/app/Detail-user-policy'], { queryParams: { id: id } }); 
  }
}
