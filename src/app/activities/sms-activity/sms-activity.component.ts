import { DatePipe } from '@angular/common';
import { Component, Injector, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { UserTypes } from '@shared/AppConsts';
import { DateHelper } from '@shared/helpers/DateHelper';
import { ActivityDto, ActivityServiceProxy, CreateActivityDto, CreateERPTicketDto, CustomerDto, GroupDto, GroupServiceProxy, NoteActivityInputDto, NoteListDto, NoteListDtoListResultDto, TicketServiceProxy, UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';

@Component({
  selector: 'app-sms-activity',
  templateUrl: './sms-activity.component.html',
  styleUrls: ['./sms-activity.component.css'],
  animations: [appModuleAnimation()]
})
export class SmsActivityComponent extends AppComponentBase implements OnInit {
  showInput: boolean = true; // Default to Group

  groupInput: string = '';
  employeeInput: string = '';
  @Input() selectedCustomer: CustomerDto = new CustomerDto();
  noteActivityInput = new NoteActivityInputDto();
  NoteListDtoList: NoteListDto[] = [];
  saving = false;
  activity = new ActivityDto();
  activityDate;
  followUpDate;
  activityTypes: any;
  FollowTypes: any;
  activityKinds: any;
  id: number;
  employees: UserDto[] = [];
  activityId: any;
  groups: GroupDto[] = [];
  groupModel: GroupDto = new GroupDto();
  groupId: number ;
  createTicketDto: CreateERPTicketDto = new CreateERPTicketDto();

  constructor(
    injector: Injector,
    private _activityService: ActivityServiceProxy,
    private _appSessionService: AppSessionService,
    private _groupService: GroupServiceProxy,
    private _userService: UserServiceProxy,
    private rout: ActivatedRoute,
    private _ticketService: TicketServiceProxy,
    private _datePipe: DatePipe,
  ) {
    super(injector);

  }

  async ngOnInit(): Promise<void> {



    this.rout.queryParams.subscribe(params => {

      if (params.ActivityId) {
        this.activityId = params.ActivityId;
        if (this.activityId > 0) {
          this.selectedCustomer.fullName = params.customerName;
          this.getActivityById();
        }
      } else {
        this.getSMSNoteDefaultActivity();
      }

    });
    await this.GetActivityTypes();
    await this.getActivityArts();
    this.getEmployees();
    this.getAllGroups();
    this.setFollowupType(false);
  }

  async GetCustomerNotesAsync() {
    this._activityService.getCustomerSmsNotes(this.selectedCustomer.id).subscribe((result) => {
      this.NoteListDtoList = result.items;
    });
  }
  //#region Save Note Activity
  async saveNoteActivityInput() {
    this.setNoteActivityInput();

    if(this.noteActivityInput.groupId < 1 && !this.showInput){
      this.notify.info(this.l("Select Group"));
      return true;
    }


    if(this.noteActivityInput.employeeId < 1 && this.showInput){
      this.notify.info(this.l("Select Employee"));
      return true;
    }

    this._activityService.createSmsNoteActivityAndAddNote(this.noteActivityInput).subscribe(result => {
      this.notify.info(this.l('You don’t have a license, but a ticket has been created.'));
      this.GetCustomerNotesAsync();
      this._appSessionService.onUpdateActivityInfo.emit(true);

    });

    // this._activityService.sendMessage(this.noteActivityInput.description,this.selectedCustomer.telephoneFax).subscribe(
    //   res =>{
    //     this.noteActivityInput.description = '';
    //   }
    // );


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
    this.noteActivityInput.name=this.activity.name;


    if(this.showInput){
     // this.noteActivityInput.groupId = 0;
     }
     else{
     // this.noteActivityInput.employeeId = 0;
     }
  }
  //#endregion
  isAdminUser(): boolean {
    return this.appSession.isAdminUser();
  }


  async createTicket() {

    this.createTicketDto.groupId = 0;
    this.createTicketDto.employeeId = 0;
    this.createTicketDto.customerUserId = this.selectedCustomer.userId;
    this.createTicketDto.customerId = this.selectedCustomer.id;
    this.createTicketDto.comment =  "Subject: SMS Note \nBody: " + this.noteActivityInput.description;
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

   sendSms = async (): Promise<void> => {
    const url = 'https://api.cpsms.dk/v2/send';

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Basic YmVja2l0OmIxYTIwYWM2LWQ2NzEtNDkzYi04NzRiLTI2Y2Y1YzUzNjk1Mg==');

    const data = {
      to: '4521299040',
      message: this.noteActivityInput.description,
      from: 'Beck IT',
    };

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(url, requestOptions);
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error('Error:', error);
    }
  };





  private async GetActivityTypes() {

    this._activityService.getAllActivityTypes().subscribe((result) => {
      this.activityTypes = result.items;
      this.FollowTypes = result.items;
    });
  }

  private async getActivityArts() {
    this._activityService.getAllActivityArts().subscribe((result) => {
      this.activityKinds = result.items;
      console.log(this.activityKinds);
    });
  }

  private async getEmployees() {
    this.employees = await (await this._userService.getFilteredUsers(UserTypes.Employee).toPromise()).items;
  }
  private  getAllGroups(){

    this.groups = [];
     this._groupService.getAll().subscribe((result) => {

       this.groups=result.items;
       if(this.groups.length > 0){
        this.noteActivityInput.groupId= this.groups[0].id;
      }
     });
     }
  setFollowupType(val){
    this.showInput =val
  }

  private async getSMSNoteDefaultActivity() {
    this._activityService.getSMSNoteDefaultActivity().subscribe((result) => {
      this.activity = result;
      this.activityDate = this._datePipe.transform(DateHelper.toLocalDate(this.activity.date), 'yyyy-MM-dd');
      this.followUpDate = this._datePipe.transform(DateHelper.toLocalDate(this.activity.followUpDate), 'yyyy-MM-dd');
    });
  }

  private async getActivityById() {
    this._activityService.get(this.activityId).subscribe((result) => {
      this.noteActivityInput.description = result.note;
      this.activity = result;
      this.activityDate = this._datePipe.transform(DateHelper.toLocalDate(result.date), 'yyyy-MM-dd');
      this.followUpDate = this._datePipe.transform(DateHelper.toLocalDate(result.followUpDate), 'yyyy-MM-dd');
    });
  }

}
