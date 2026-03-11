import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { UserTypes } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/app-component-base';
import { DateHelper } from '@shared/helpers/DateHelper';
import { Base64Image } from '@shared/modals/base64image';
import { CreateERPTicketDto, CreateTicketDto, GroupDto, GroupServiceProxy, TicketServiceProxy, UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.css']
})
export class CreateTicketComponent extends AppComponentBase implements OnInit {

  saving = false;
  description: string;
  emailAddress: string;
  isPhotoUploaded = true;
  createTicketDto: CreateERPTicketDto = new CreateERPTicketDto();
  employees: UserDto[] = [];
  groups: GroupDto[] = [];
  groupModel: GroupDto = new GroupDto();
  groupId: number = 0;
  @Output() onSave = new EventEmitter<boolean>();
  showInput = true;
  customerId:number;
  customerUserId:number;

  constructor(
    injector: Injector,
    public bsModalRef: BsModalRef,
    private _ticketService: TicketServiceProxy,
    private _userService: UserServiceProxy,
    private _groupService: GroupServiceProxy,
    private _datePipe: DatePipe,
    ) {
    super(injector);
  }

  ngOnInit(): void {
    this.createTicketDto.email=this.appSession.user.emailAddress;
    this.createTicketDto.date =  new Date().toISOString().slice(0, 16);

    this.getEmployees();
    this.getAllGroups();
    this.setFollowupType(false);
  }

  private async getEmployees() {
    this.employees = await (
      await this._userService.getFilteredUsers(UserTypes.Employee).toPromise()
    ).items;
  }
  private  getAllGroups(){

   this.groups = [];
  //  this._groupService.getAll().subscribe((result) => {

  //     this.groups = result.items;
  //     if (this.groups.length > 0) {
  //       this.createTicketDto.groupId = this.groups[0].id;
  //     }

  //   });
    }

    setFollowupType(val){
      this.showInput =val;
    }
  //#region Create Fault
  async createTicket() {
    // if(this.createTicketDto.groupId < 1 && !this.showInput){
    //   this.notify.info(this.l("Select Group"));
    //   return true;
    // }

    // if(this.createTicketDto.employeeId < 1 && this.showInput){
    //   this.notify.info(this.l("Select Employee"));
    //   return true;
    // }
    this.createTicketDto.groupId = 0;
    this.createTicketDto.employeeId = 0;
    this.saving = true;
    this.createTicketDto.customerUserId = this.customerUserId;
    this.createTicketDto.customerId = this.customerId;
    this.createTicketDto.date = this._datePipe.transform(DateHelper.toLocalDate(new Date(this.createTicketDto.date)), 'yyyy-MM-dd');

    try {
      await this._ticketService.createFromERP(this.createTicketDto).toPromise();
      this.notify.success(this.l('SavedSuccessfully'));
    } catch (error) {
      this.notify.error(this.l('Error in creating fault'));
      console.log(error);
    }
    finally {
      this.saving = false;
      this.bsModalRef.hide();
      this.onSave.emit(true);
    }
  }

  onFileUploadHandler(image: Base64Image) {
    this.createTicketDto.base64ImageString = image.ImageBase64String;
  }
  //#endregion

}
