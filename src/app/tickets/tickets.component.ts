import {
  Component,
  Injector,
  Input,
  OnInit,
  SimpleChange,
  SimpleChanges,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from "@shared/paged-listing-component-base";
import {
  ActivityServiceProxy,
  CustomerDto,
  CustomerListDto,
  CustomerServiceProxy,
  Int32LookUpDto,
  TicketDto,
  TicketDtoPagedResultDto,
  TicketServiceProxy,
  UpdateTicketStatusDto,
} from "@shared/service-proxies/service-proxies";
import { AppSessionService } from "@shared/session/app-session.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { finalize } from "rxjs/operators";
import { CreateTicketComponent } from "./create-ticket/create-ticket.component";
import { EditTicketComponent } from "./edit-ticket/edit-ticket.component";
import { tick } from "@angular/core/testing";
import { LayoutStoreService } from "@shared/layout/layout-store.service";

class PagedTicketRequestDto extends PagedRequestDto {
  customerId: number | undefined;
  keyword: string;
  showOpenOnly:boolean;
  employeeId: number | undefined;
}
@Component({
  selector: "app-tickets",
  templateUrl: "./tickets.component.html",
  styleUrls: ["./tickets.component.css"],
  animations: [appModuleAnimation()],
})
export class TicketsComponent
  extends PagedListingComponentBase<TicketDto>
  implements OnInit
{
  @Input() customerUserId: any;

  @Input() isDisplayCloseFaultButton = true;
  invoiceLineId: number;
  advancedFiltersVisible = false;
  title = "Faults";
  tickets: TicketDto[] = [];

  customers: CustomerListDto[] = [];
  subCustomers: CustomerDto[] = [];
  activityTypes: Int32LookUpDto[] = [];
  keyword: string;
  customerId: number;
  subCustomerId: number;
  activityTypeId: number;
  onlyShowOpen: boolean = false;

  constructor(
    injector: Injector,
    private _ticketService: TicketServiceProxy,
    private _customerService: CustomerServiceProxy,
    private _appSessionService: AppSessionService,
    private _activityService: ActivityServiceProxy,
    private router: Router,
    private route: ActivatedRoute,
    private _modalService: BsModalService,
    private readonly _layoutService: LayoutStoreService
  ) {
    super(injector);
  }

  async ngOnInit() {
    this._layoutService.updateHeaderTitle("Tickets");
    this.customerId = this.route.snapshot.queryParams["customerId"];
    this.subCustomerId = this.route.snapshot.queryParams["subcustomerId"];
    if (this.customerUserId) this.onCustomerChange(this.customerUserId);
    this.getCustomers();
    this.getActivityTypes();
    this.getDataPage(1);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getDataPage(1);
  }

  getCustomers() {
    this._customerService.getAll().subscribe((res) => {
      this.customers = res.items;
    });
  }

  getActivityTypes() {
    this._activityService.getAllActivityTypes().subscribe((res) => {
      this.activityTypes = res.items;
    });
  }

  clearFilters(): void {
    this.keyword = "";
    this.getDataPage(1);
  }

  onCustomerChange(customerId: number) {
    this.subCustomerId = null;
    this._customerService
      .getSubCustomers(undefined, customerId)
      .subscribe((result) => {
        this.subCustomers = result.items;
      });
    this.getDataPage(1);
  }

  protected list(
    request: PagedTicketRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    if (this.customerId > 0 || this.subCustomerId > 0) {
      request.customerId = this.subCustomerId ?? this.customerId ?? undefined;
      request.employeeId = undefined;
    } else {
      request.customerId = undefined;
    }
    request.keyword = this.keyword;
    
    this._ticketService
      .getPagedResult(
        
        undefined,
        request.keyword,
        request.skipCount,
        request.maxResultCount,
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: TicketDtoPagedResultDto) => {
        this.tickets = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  protected delete(fault: TicketDto): void {
    abp.message.confirm(
      this.l("UserDeleteWarningMessage"),
      undefined,
      (result: boolean) => {
        if (result) {
        }
      }
    );
  }

  async closeFault(fault: TicketDto) {
    let updateFaultStatus = this.getUpdateFaultStatusInputDto(fault);
    try {
      await this._ticketService
        .updateTicketStatus(updateFaultStatus)
        .toPromise();
      this.refresh();
    } catch (error) {
      this.notify.error(error);
    }
  }

  private getUpdateFaultStatusInputDto(fault: TicketDto) {
    let updateFaultStatus = new UpdateTicketStatusDto();
    updateFaultStatus.id = fault.id;
    updateFaultStatus.ticketStatus = updateFaultStatus.ticketStatus;
    return updateFaultStatus;
  }

  isAlreadyResolved(ticket: TicketDto) {
    //return ticket.status === FaultStatuses.Close;
  }
  viewDetail(ticket: TicketDto): void {
    this.router.navigate(["app/ticket-detail"], {
      queryParams: { ticketId: ticket.id },
    });
  }

  // ticketUserStatus(ticket: TicketDto): string {
  //   const ticketUser = ticket.users?.find(
  //     (t) => t.userId == this._appSessionService.userId
  //   );
  //   if (!ticketUser) return "";
  //   let userStatus;
  //   switch (ticketUser.status) {
  //     case 0:
  //       userStatus = "Pending";
  //       break;
  //     case 1:
  //       userStatus = "Accepted";
  //       break;
  //     case 2:
  //       userStatus = "Rejected";
  //       break;
  //     default:
  //       userStatus = "Pending";
  //       break;
  //   }
  //   return userStatus;
  // }

  // public EditTicket(): void {
  //   let editTicketDialog: BsModalRef;

  //     editTicketDialog = this._modalService.show(
  //       EditTicketComponent,
  //       {
  //         class: 'modal-lg',
  //         // initialState: {
  //         //   customerId: this.customer.id,
  //         // },
  //       },
  //     )
  //   // this._eventService.emitEvent('RefreshData',null);
  //   this.refresh();
  // }

  public showCreateOrEditTicketDialog(ticket?: TicketDto): void {
    let createOrEditUserDialog: BsModalRef;
    if (!ticket) {
      createOrEditUserDialog = this._modalService.show(CreateTicketComponent, {
        class: "modal-lg",
      });
    } else {
      createOrEditUserDialog = this._modalService.show(EditTicketComponent, {
        class: "modal-lg",
        initialState: {
          ticket: ticket,
        },
      });
    }

    createOrEditUserDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }

  collapseAll() {
    this.tickets.forEach((item) => {
      item.isExpanded = false;
    });
  }

  expandAll() {
    this.tickets.forEach((item) => {
      item.isExpanded = true;
    });
  }
}
