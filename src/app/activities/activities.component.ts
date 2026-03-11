import { activityTypes, PageMode, UserTypes } from "./../../shared/AppConsts";
import { EditActivityComponent } from "./edit-activity/edit-activity.component";
import { CreateActivityComponent } from "./create-activity/create-activity.component";
import {
  ActivityListDto,
  ActivityServiceProxy,
  Int32LookUpDto,
  ProductItemServiceProxy,
  UserDto,
  UserServiceProxy,
} from "./../../shared/service-proxies/service-proxies";
import {
  Component,
  Injector,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from "@shared/paged-listing-component-base";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { finalize } from "rxjs/operators";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { ActivatedRoute, Router } from "@angular/router";
import { AppSessionService } from "@shared/session/app-session.service";
import { CreateFaultComponent } from "@app/faults/create-fault/create-fault.component";
import { CreateProductItemActivityDialogComponent } from "./create-product-item-activity-dialog/create-product-item-activity-dialog.component";
import { LayoutStoreService } from "@shared/layout/layout-store.service";

class PagedActivitiesRequestDto extends PagedRequestDto {
  customerId: number;
  keyword: string;
  isFollowUp: boolean;
  followUpActivityTypeId: number;
}

@Component({
  selector: "app-activities",
  templateUrl: "./activities.component.html",
  styleUrls: ["./activities.component.css"],
  animations: [appModuleAnimation()],
})
export class ActivitiesComponent
  extends PagedListingComponentBase<ActivityListDto>
  implements OnInit
{
  @Input() customerId: number;
  activities: ActivityListDto[] = [];
  customers: UserDto[] = [];
  keyword = "";
  isActive: boolean | null;
  advancedFiltersVisible = true;
  isFromCustomer = false;
  isCalendarView = false;
  isFollowUp = false;
  followUpActivityTypeId: number;
  activityTypes: Int32LookUpDto[] = [];
  activityId = "";
  groupId = "";

  constructor(
    injector: Injector,
    private _activityService: ActivityServiceProxy,
    private _userService: UserServiceProxy,
    private _modalService: BsModalService,
    private router: Router,
    private route: ActivatedRoute,
    private _appSessionService: AppSessionService,
    private _productItemService: ProductItemServiceProxy,
    private readonly _layoutService: LayoutStoreService
  ) {
    super(injector);
  }

  async ngOnInit() {
    this._layoutService.updateHeaderTitle("Activities - All");
    if (!this.customerId) {
      this.customerId = this.route.snapshot.queryParams["customerId"];
    }
    await this.getActivityTypes();
  //  this.getCustomers();
    this._appSessionService.onUpdateActivityInfo.subscribe((res) => {
      this.refresh();
    });
    this.refresh();
  }
  // getCustomers() {
  //   this._userService
  //     .getFilteredUsers(UserTypes.Customer)
  //     .subscribe((result) => {
  //       this.customers = result.items;
  //     });
  // }
  async getActivityTypes() {
    this.activityTypes = await (
      await this._activityService.getAllActivityTypes().toPromise()
    ).items;
  }
  createActivity(): void {
    this.showCreateOrEditActivityDialog();
  }

  editActivity(activity: ActivityListDto): void {
    this.showCreateOrEditActivityDialog(activity.id);
  }

  clearFilters(): void {
    this.keyword = "";
    this.isActive = undefined;
    this.isFollowUp = undefined;
    this.followUpActivityTypeId = undefined;
    this.getDataPage(1);
  }

  openActivity(activity: ActivityListDto): void {
    if (activity.activityTypeName === activityTypes.eyeTool) {
      this.router.navigate(["/app/eye-tool/" + activity.id]);
    } else if (activity.activityTypeName === activityTypes.sale) {
      this.router.navigate(["app/sales"], {
        queryParams: { customerId: activity.customerId },
      });
    } else if (
      activity.activityTypeName === activityTypes.PhoneCallActivityType
    ) {
      this.router.navigate(["app/phoneCallActivity"], {
        queryParams: {
          ActivityId: activity.id,
          customerName: activity.customerName,
        },
      });
    } else if (
      activity.activityTypeName === activityTypes.SmsNoteActivityType
    ) {
      this.router.navigate(["app/smsActivity"], {
        queryParams: {
          ActivityId: activity.id,
          customerName: activity.customerName,
        },
      });
    } else if (
      activity.activityTypeName === activityTypes.EmailNoteActivityType
    ) {
      this.router.navigate(["app/emailActivity"], {
        queryParams: {
          ActivityId: activity.id,
          customerName: activity.customerName,
        },
      });
    } else if (activity.activityTypeName === activityTypes.EilepsySale) {
      this.openProductItemActivityDialog(activity);
    }
    else if (activity.activityTypeName === activityTypes.Ticket) {
      this.router.navigate(["/app/ticket-detail"], {
        queryParams: { ticketId: activity.ticketId },
      });
    }


    else if ( activity.activityTypeName === activityTypes.ReceivePackage ) {
      this.router.navigate(["app/phoneCallActivity"], {
        queryParams: {
          ActivityId: activity.id,
          customerName: activity.customerName,
        },
      });

    }

    // else if (activity.activityTypeName === activityTypes.Ticket) {

    //   this.router.navigate(['app/ticket-detail?ticketId='])
    // }
    else {
      this.notify.warn(this.l("Can not open this activity from here"), "", {});
    }
  }
  openProductItemActivityDialog(activity: ActivityListDto) {
    let createOrEditUserDialog: BsModalRef;
    createOrEditUserDialog = this._modalService.show(
      CreateProductItemActivityDialogComponent,
      {
        class: "modal-lg",
        initialState: {
          pageMode: PageMode.View,
          activityId: activity.id,
        },
      }
    );
    createOrEditUserDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }
  openProductItemActivityForEditDialog(activity: ActivityListDto) {
    let createOrEditUserDialog: BsModalRef;
    createOrEditUserDialog = this._modalService.show(
      CreateProductItemActivityDialogComponent,
      {
        class: "modal-lg",
        initialState: {
          pageMode: PageMode.Edit,
          activityId: activity.id,
        },
      }
    );
    createOrEditUserDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }

  protected list(
    request: PagedActivitiesRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.customerId = this.customerId;
    request.keyword = this.keyword;
    request.isFollowUp = this.isFollowUp;
    request.followUpActivityTypeId = this.followUpActivityTypeId;
    this._activityService
      .getPagedResult(
        request.keyword,
        request.customerId,
        request.isFollowUp,
        undefined,
        request.followUpActivityTypeId,
        undefined,
        undefined,
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
      this.l("UserDeleteWarningMessage", activity.name),
      undefined,
      (result: boolean) => {
        if (result) {
          this._activityService.delete(activity.id).subscribe(() => {
            abp.notify.success(this.l("SuccessfullyDeleted"));
            this.refresh();
          });
        }
      }
    );
  }

  onCustomerClick(item: ActivityListDto) {
    console.log(item);
    this.router.navigate(["app/customer-details", item.customerId], {
      queryParams: { userId: item.customerUserId },
    });
  }

  private showCreateOrEditActivityDialog(id?: number): void {
    let createOrEditUserDialog: BsModalRef;
    if (!id) {
      createOrEditUserDialog = this._modalService.show(
        CreateActivityComponent,
        {
          class: "modal-lg",
        }
      );
    } else {
      createOrEditUserDialog = this._modalService.show(EditActivityComponent, {
        class: "modal-lg",
        initialState: {
          id: id,
        },
      });
    }

    createOrEditUserDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }

  ToggleCalenderView() {
    if (this.isCalendarView) this.isCalendarView = false;
    else this.isCalendarView = true;
  }

  isAdminUser(): boolean {
    return this._appSessionService.isAdminUser();
  }

  addFault(activity: ActivityListDto) {
    let createFaultDialog: BsModalRef;
    createFaultDialog = this._modalService.show(CreateFaultComponent, {
      class: "modal-lg",
      initialState: {
        activity: activity,
      },
    });
    createFaultDialog.content.onSave.subscribe(() => {
      this.notify.success(this.l("SavedSuccessfully"));
      this.refresh();
    });
  }

  isProductItemActivity(activity: ActivityListDto) {
    return activity.activityTypeName == activityTypes.EilepsySale;
  }
}
