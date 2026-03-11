import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateProductItemActivityDialogComponent } from '@app/activities/create-product-item-activity-dialog/create-product-item-activity-dialog.component';
import { ActivityDailogComponentComponent } from '@app/activity-dailog-component/activity-dailog-component.component';
import { ReminderCustomerSupplierDailogComponentComponent } from '@app/reminder-customer-supplier-dailog-component/reminder-customer-supplier-dailog-component.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { activityTypes, PageMode, UserTypes } from '@shared/AppConsts';
import { LayoutStoreService } from '@shared/layout/layout-store.service';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { ActivityListDto, ActivityServiceProxy, EntityDto, Int32LookUpDto, UserTypeDto, UserTypeServiceProxy } from '@shared/service-proxies/service-proxies';
import { debug } from 'console';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';


class PagedActivitiesRequestDto extends PagedRequestDto {
  customerId: number;
  keyword: string;
  isFollowUp: boolean;
  isClose: boolean;
  isFromRememberReport: boolean;
  isOnlyMe: boolean;
  followUpActivityTypeId: number;
}
@Component({
  selector: 'app-remember-reports',
  templateUrl: './remember-reports.component.html',
  styleUrls: ['./remember-reports.component.css'],
  animations: [appModuleAnimation()]
})
export class RememberReportsComponent extends PagedListingComponentBase<ActivityListDto> implements OnInit {
  bsModalRef: BsModalRef;
  keyword = '';
  activities: ActivityListDto[] = [];
  isActive: boolean | null;
  advancedFiltersVisible = true;
  isFromCustomer = false;
  isFromRemenberReport = true;
  isOnlyMe = false;
  followUpActivityTypeId: number;
  isFollowUp: boolean = false;
  activityTypes: Int32LookUpDto[] = [];
  constructor(
    injector: Injector,
    private _activityService: ActivityServiceProxy,
    private _modalService: BsModalService,
    private _router: Router,
    private readonly _layoutService: LayoutStoreService,
  ) {
    super(injector);
  }
  ngOnInit(): void {
    this.refresh();
    //this.getDataPage(1);
    this._activityService.getAllActivityTypes().subscribe(res => {
      this.activityTypes = res.items;
      this._layoutService.updateHeaderTitle("Employee Remember Report");
    })
  }

  refresh(): void {
    this.getDataPage(this.pageNumber);
  }

  protected list(
    request: PagedActivitiesRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.customerId = undefined;
    request.keyword = this.keyword;
    request.isFollowUp = this.isFollowUp;
    request.isClose = false;
    request.isFromRememberReport = this.isFromRemenberReport;
    request.isOnlyMe = this.isOnlyMe;
    request.followUpActivityTypeId = this.followUpActivityTypeId;
    this._activityService
      .getPagedResult(
        request.keyword,
        request.customerId,
        request.isFollowUp,
        request.isClose,
        request.followUpActivityTypeId,
        request.isFromRememberReport,
        request.isOnlyMe,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result) => {
        this.activities = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  protected delete(activity: ActivityListDto): void {
    abp.message.confirm(
      this.l('UserDeleteWarningMessage', activity.name),
      undefined,
      (result: boolean) => {
        if (result) {
          this._activityService.delete(activity.id).subscribe(() => {
            abp.notify.success(this.l('Successfully'));
            this.refresh();
          });
        }
      }
    );
  }

  async followUpActivity(activity: ActivityListDto) {
    var input = new EntityDto();
    input.id = activity.id;
    await this._activityService.markActivityAsFollowUp(input).toPromise();
    abp.notify.success(this.l('Successfully Fullow Up Activity'));
    this.refresh();
  }

  clear() {
    this.isOnlyMe = false;
    this.isFollowUp = undefined;
    this.followUpActivityTypeId = undefined;
  }

  onCustomerClick(activity: any,event: MouseEvent) {
    //event.stopPropagation();
    const modalRef = this._modalService.show(ReminderCustomerSupplierDailogComponentComponent, { 
      class: 'modal-lg',
      initialState: {
        activity: activity
      }
    });
    this.bsModalRef.hide();
  }

  openActivity(activity: ActivityListDto): void {
    if (activity.activityTypeName === activityTypes.eyeTool) {
      this._router.navigate(['/app/eye-tool/' + activity.id]);
    }

    else if (activity.activityTypeName === activityTypes.sale) {
      this._router.navigate(['app/sales'], { queryParams: { customerId: activity.customerId } })
    }

    else if (activity.activityTypeName === activityTypes.PhoneCallActivityType) {
      this._router.navigate(['app/phoneCallActivity'], { queryParams: { ActivityId: activity.id, customerName: activity.customerName } })
    }

    else if (activity.activityTypeName === activityTypes.SmsNoteActivityType) {
      this._router.navigate(['app/smsActivity'], { queryParams: { ActivityId: activity.id, customerName: activity.customerName } })
    }

    else if (activity.activityTypeName === activityTypes.EmailNoteActivityType) {
      this._router.navigate(['app/emailActivity'], { queryParams: { ActivityId: activity.id, customerName: activity.customerName } })
    }
    else if (activity.activityTypeName === activityTypes.Ticket) {
      this._router.navigate(['/app/ticket-detail'], { queryParams: { ticketId: activity.ticketId } })
    }
    else if (activity.activityTypeName === activityTypes.ReceivePackage) {
      //this._router.navigate(['/app/package-detail'], { queryParams: {packageId: activity.packageId } })
    }
    else if (activity.activityTypeName === activityTypes.EilepsySale) {
      this.openProductItemActivityDialog(activity);
    }
    else {
      this.notify.warn(this.l('Can not open this activity from here'));
    }
  }
  openProductItemActivityDialog(activity: ActivityListDto) {

    let createOrEditUserDialog: BsModalRef;
    createOrEditUserDialog = this._modalService.show(
      CreateProductItemActivityDialogComponent,
      {
        class: 'modal-lg',
        initialState: {
          pageMode: PageMode.View,
          activityId:activity.id
        },
      },
    )
    createOrEditUserDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }
  openActivityDialog(activity: any,event: MouseEvent) {
    if ((event.target as HTMLElement).tagName !== 'TD' || !(event.target as HTMLElement).classList.contains('clickable')) {
      const modalRef = this._modalService.show(ActivityDailogComponentComponent, { 
        class: 'modal-lg',
        initialState: {
          activity: activity
        }
      });
    }
    
  }
}
