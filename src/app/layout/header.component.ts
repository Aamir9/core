import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import { LayoutStoreService } from "@shared/layout/layout-store.service";
import {
  ActivityServiceProxy,
  CompanyLoginInfoDto,
  CreateInvoiceDto,
  InvoiceLineDto,
  InvoiceServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { AppSessionService } from "@shared/session/app-session.service";
import { BsModalService } from "ngx-bootstrap/modal";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent extends AppComponentBase implements OnInit {
  @ViewChild("checkInModalTemplate")
  checkInTemplate: TemplateRef<HTMLDivElement>;
  @ViewChild("checkOutModalTemplate")
  checkOutTemplate: TemplateRef<HTMLDivElement>;

  title = "";
  companyInfo = new CompanyLoginInfoDto();
  invoice = new CreateInvoiceDto();
  invoiceLines: InvoiceLineDto[] = [];
  counter: number;
  saving: boolean = false;
  checkInNote = "";
  checkOutNote = "";
  currentCheckInState: "CheckedIn" | "CheckedOut" | null = null;

  constructor(
    injector: Injector,
    private appSessionService: AppSessionService,
    private renderer: Renderer2,
    private _invoiceServie: InvoiceServiceProxy,
    private _activityService: ActivityServiceProxy,
    public _modalService: BsModalService,
    private cdr: ChangeDetectorRef,
    private readonly _layoutService: LayoutStoreService,
     public _appSessionService: AppSessionService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getInvoiceLines();
    this.getLastCheckInCheckOutActivity();
    this.appSessionService.onAddItemToCart.subscribe((res) => {
      this.getInvoiceLines();
    });
    this._layoutService.$headerTitle.subscribe((title) => {
      this.title = title;
      this.cdr.detectChanges();
    });
  }

  getInvoiceLines() {
    this._invoiceServie.getAdminDraftInvoice().subscribe((res) => {
      console.log(res);
      if (res != null && res.id > 0) {
        this.invoice = res;
        this.invoiceLines = res.invoiceLines;
        if (this.invoiceLines) {
          this.counter = this.invoiceLines.length;
          document.getElementById("lblCartCount").innerText =
            this.invoiceLines.length.toString();
        }
      } else document.getElementById("lblCartCount").innerText = "0";
    });
  }

  getLastCheckInCheckOutActivity(): void {
    const userId = this.appSession.userId;
    this._activityService
      .getLastCheckInCheckOutNotes(userId)
      .subscribe((res) => {
        if (res) {
          if (res.activityName == "Check In") {
            this.currentCheckInState = "CheckedIn";
          } else {
            this.currentCheckInState = "CheckedOut";
          }
        } else {
          this.currentCheckInState = "CheckedIn";
        }
        this.cdr.detectChanges();
        console.log(this.currentCheckInState == "CheckedIn");
      });
  }

  onCheckInClick(): void {
    this._modalService.show(this.checkInTemplate);
  }

  onCheckOutClick(): void {
    this._modalService.show(this.checkOutTemplate);
  }

  // createCheckIn(): void {
  //   const payload: NoteActivityInputDto = new NoteActivityInputDto({
  //     name: "Check In",
  //     date: DateHelper.convertDateTimeToString(
  //       new Date(),
  //       AppConsts.dateFormate
  //     ),
  //     followUpDate: DateHelper.convertDateTimeToString(
  //       new Date(),
  //       AppConsts.dateFormate
  //     ),
  //     followUpTypeId: 1,
  //     activityArtId: 1,
  //     activityTypeId: 13, //Activity Type "check in" ID, will be replaced in the backend to correct ID
  //     employeeId: this.appSessionService.userId,
  //     customerId: null,
  //     roomId: null,
  //     isInvited: false,
  //     description: this.checkInNote,
  //     customerTableId: null,
  //   });
  //   this._activityService
  //     .createCheckInActivityAndAddNote(payload)
  //     .subscribe((res: any) => {
  //       this.notify.info(this.l("Checked In Successfully!"));
  //       this._modalService.hide(1);
  //       this.checkInNote = "";
  //       this.currentCheckInState = "CheckedIn";
  //       this.cdr.detectChanges();
  //     });
  // }

  // createCheckOut(): void {
  //   const payload: NoteActivityInputDto = new NoteActivityInputDto({
  //     name: "Check Out",
  //     date: DateHelper.convertDateTimeToString(
  //       new Date(),
  //       AppConsts.dateFormate
  //     ),
  //     followUpDate: DateHelper.convertDateTimeToString(
  //       new Date(),
  //       AppConsts.dateFormate
  //     ),
  //     followUpTypeId: 1,
  //     activityArtId: 1,
  //     activityTypeId: 14, //Activity Type "check Out" ID, will be replaced in the backend to correct ID
  //     employeeId: this.appSessionService.userId,
  //     customerId: null,
  //     roomId: null,
  //     isInvited: false,
  //     description: this.checkInNote,
  //     customerTableId: null,
  //   });
  //   this._activityService
  //     .createCheckOutActivityAndAddNote(payload)
  //     .subscribe((res: any) => {
  //       this.notify.info(this.l("Checked Out Successfully!"));
  //       this._modalService.hide(1);
  //       this.checkOutNote = "";
  //       this.currentCheckInState = "CheckedOut";
  //       this.cdr.detectChanges();
  //     });
  // }
}
