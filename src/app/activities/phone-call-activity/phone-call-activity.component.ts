import { DatePipe } from "@angular/common";
import { Component, Injector, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UserTypes } from "@shared/AppConsts";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from "@shared/app-component-base";
import { DateHelper } from "@shared/helpers/DateHelper";
import * as serviceProxies from "@shared/service-proxies/service-proxies";
import { AppSessionService } from "@shared/session/app-session.service";

@Component({
  selector: "app-phone-call-activity",
  templateUrl: "./phone-call-activity.component.html",
  styleUrls: ["./phone-call-activity.component.css"],
  animations: [appModuleAnimation()],
})
export class PhoneCallActivityComponent
  extends AppComponentBase
  implements OnInit
{
  showInput: boolean = true; // Default to Group

  groupInput: string = "";
  employeeInput: string = "";

  @Input() selectedCustomer: serviceProxies.CustomerDto =
    new serviceProxies.CustomerDto();
  noteActivityInput = new serviceProxies.NoteActivityInputDto();
  NoteListDtoList: serviceProxies.NoteListDto[] = [];
  saving = false;
  activity = new serviceProxies.ActivityDto();
  activityDate;
  followUpDate;
  activityTypes: any;
  FollowTypes: any;
  activityKinds: any;
  activityId: number;
  employees: serviceProxies.UserDto[] = [];
  groups: serviceProxies.GroupDto[] = [];
  groupModel: serviceProxies.GroupDto = new serviceProxies.GroupDto();
  groupId: number ;
  createTicketDto = new serviceProxies.CreateERPTicketDto();
  constructor(
    injector: Injector,
    private _activityService: serviceProxies.ActivityServiceProxy,
    private _appSessionService: AppSessionService,
    private _userService: serviceProxies.UserServiceProxy,
    private _groupService: serviceProxies.GroupServiceProxy,
    private rout: ActivatedRoute,
    private _datePipe: DatePipe,
    private _ticketService: serviceProxies.TicketServiceProxy,
  ) {
    super(injector);
    // this.getPhoneCallNoteDefaultActivity();
  }

  async ngOnInit(): Promise<void> {
    this.rout.queryParams.subscribe((params) => {
      if (params.ActivityId) {
        this.activityId = params.ActivityId;
        if (this.activityId > 0) {
          this.selectedCustomer.fullName = params.customerName;
          this.getActivityById();
        }
      } else {
        this.getPhoneCallNoteDefaultActivity();
      }
    });

    this.GetActivityTypes();
    this.getActivityArts();
    this.getEmployees();
    this.getAllGroups();

    this.setFollowupType(false);
  }

  async GetCustomerNotesAsync() {
    this._activityService
      .getCustomerPhoneCallNotes(this.selectedCustomer.id)
      .subscribe((result) => {
        this.NoteListDtoList = result.items;
      });
  }

  //#region Save Activity
  async saveNoteActivityInput() {
    this.setNoteActivityInput();

    if (this.noteActivityInput.groupId < 1 && !this.showInput) {
      this.notify.info(this.l("Select Group"));
      return true;
    }

    if (this.noteActivityInput.employeeId < 1 && this.showInput) {
      this.notify.info(this.l("Select Employee"));
      return true;
    }

    this._activityService
      .createPhoneCallNoteActivityAndAddNote(this.noteActivityInput)
      .subscribe((result) => {
        this.notify.info(this.l("CreateSuccessfully"));
        this.GetCustomerNotesAsync();
        this.noteActivityInput.description = "";
        this._appSessionService.onUpdateActivityInfo.emit(true);
      });

      this._activityService.sendMail(this.selectedCustomer.emailAddress,"Phone Call Note",this.noteActivityInput.description).subscribe();
      this.noteActivityInput.description = "";
  }

  async createTicket() {

    this.createTicketDto.groupId = 0;
    this.createTicketDto.employeeId = 0;
    this.createTicketDto.customerUserId = this.selectedCustomer.userId;
    this.createTicketDto.customerId = this.selectedCustomer.id;
    this.createTicketDto.comment =  "Subject: Phone Call Note \nBody: " + this.noteActivityInput.description;
    this.createTicketDto.email =  this.selectedCustomer.emailAddress;
    this.createTicketDto.date =  new Date().toISOString().slice(0, 16);
    this.createTicketDto.date = this._datePipe.transform(DateHelper.toLocalDate(new Date(this.createTicketDto.date)), 'yyyy-MM-dd');

    try {
      await this._ticketService.createFromERP(this.createTicketDto).subscribe();
    } catch (error) {
      console.log(error);
    }
    finally {

    }
  }
  private setNoteActivityInput() {

    this.noteActivityInput.customerTableId = this.selectedCustomer.userId;
    this.noteActivityInput.customerId = this.selectedCustomer.userId;
    this.noteActivityInput.followUpTypeId = this.activity.followUpTypeId;
    this.noteActivityInput.followUpDate = this.followUpDate;
    this.noteActivityInput.date = this.activityDate;
    // this.noteActivityInput.employeeId = this.activity.employeeId;
    this.noteActivityInput.activityTypeId = this.activity.activityTypeId;
    this.noteActivityInput.activityArtId = this.activity.activityArtId;
    this.noteActivityInput.name = this.activity.name;

    if (this.showInput) {
     // this.noteActivityInput.groupId = this.activity.followUpTypeId || 0;  // Set groupId if available
     // this.noteActivityInput.employeeId = null;  // Reset employeeId
    } else {
    //  this.noteActivityInput.employeeId = this.activity.followUpByEmployeeId ;  // Set employeeId if available
     // this.noteActivityInput.groupId = null;  // Reset groupId
    }
  }
  //#endregion
  isAdminUser(): boolean {
    return this.appSession.isAdminUser();
  }
  showHide() {}

  setFollowupType(val) {
    this.showInput = val;
  }

  private async GetActivityTypes() {
    this._activityService.getAllActivityTypes().subscribe((result) => {
      this.activityTypes = result.items;
      this.FollowTypes = result.items;
    });
  }

  private async getActivityArts() {
    this._activityService.getAllActivityArts().subscribe((result) => {
      this.activityKinds = result.items;
    });
  }

  private async getEmployees() {
    this.employees = await (
      await this._userService.getFilteredUsers(UserTypes.Employee).toPromise()
    ).items;
  }
  private getAllGroups() {
    this.groups = [];
    this._groupService.getAll().subscribe((result) => {
      this.groups = result.items;
      if (this.groups.length > 0) {
        this.noteActivityInput.groupId = this.groups[0].id;
      }
    });
  }

  private async getPhoneCallNoteDefaultActivity() {
    this._activityService
      .getPhoneCallNoteDefaultActivity()
      .subscribe((result) => {
        this.activity = result;
        const CurrentDate = new Date();
        CurrentDate.setDate(CurrentDate.getDate() + 8);

        this.activityDate = this._datePipe.transform(
          DateHelper.toLocalDate(this.activity.date),
          "yyyy-MM-dd"
        );
        this.followUpDate = this._datePipe.transform(
          DateHelper.toLocalDate(CurrentDate),
          "yyyy-MM-dd"
        );
      });
  }

  private async getActivityById() {
    this._activityService.get(this.activityId).subscribe((result) => {
      debugger
      this.noteActivityInput.description = result.note;
      this.activity = result;
      this.activityDate = this._datePipe.transform(
        DateHelper.toLocalDate(result.date),
        "yyyy-MM-dd"
      );
      this.followUpDate = this._datePipe.transform(
        DateHelper.toLocalDate(result.followUpDate),
        "yyyy-MM-dd"
      );
    });
  }
}
