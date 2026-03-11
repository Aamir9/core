import { DatePipe } from "@angular/common";
import {
  Component,
  EventEmitter,
  Injector,
  OnInit,
  Output,
} from "@angular/core";
import { UserTypes } from "@shared/AppConsts";
import { AppComponentBase } from "@shared/app-component-base";
import { DateHelper } from "@shared/helpers/DateHelper";
import { Base64Image } from "@shared/modals/base64image";
import {
  CreateERPTicketDto,
  GroupDto,
  GroupServiceProxy,
  TicketDto,
  TicketServiceProxy,
  UpdateTicketFollowUpDto,
  UserDto,
  UserServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: "app-edit-ticket",
  templateUrl: "./edit-ticket.component.html",
  styleUrls: ["./edit-ticket.component.css"],
})
export class EditTicketComponent extends AppComponentBase implements OnInit {
  ticket: TicketDto;
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
  assigningToEmployee = false;
  customerId: number;
  isGroupRadioActive = true;

  constructor(
    injector: Injector,
    public bsModalRef: BsModalRef,
    private _ticketService: TicketServiceProxy,
    private _userService: UserServiceProxy,
    private _groupService: GroupServiceProxy,
    private _datePipe: DatePipe
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.mapData();
  }

  private mapData(): void {
    this.createTicketDto.customerUserId;
    this.createTicketDto.date = DateHelper.toLocalDate(
      new Date(this.ticket.date)
    )
      .toISOString()
      .slice(0, 16);
    this.createTicketDto.email = this.ticket.email;
    this.createTicketDto.groupId = this.ticket.groupId;
    this.createTicketDto.employeeId =
      this.ticket.users.length == 1 ? this.ticket.users[0].userId : null;
    this.createTicketDto.comment = this.ticket.comment;
    this.isGroupRadioActive = this.createTicketDto.groupId > 0 ? true : false;

    this.getEmployees();
    this.getAllGroups();
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
    });
  }

  setGroupRadioActive(value: boolean): void {
    this.isGroupRadioActive = value;
  }

  async editTicket() {
    var inputModel = new UpdateTicketFollowUpDto();
    inputModel.id = this.ticket.id;
    if (this.createTicketDto.groupId < 1 && this.isGroupRadioActive) {
      this.notify.error(this.l("Select Group"));
      return true;
    }

    if (this.createTicketDto.employeeId < 1 && !this.isGroupRadioActive) {
      this.notify.error(this.l("Select Employee"));
      return true;
    }

    this.saving = true;
    inputModel.groupId = this.createTicketDto.groupId;
    inputModel.employeeId = this.createTicketDto.employeeId;

    if (!this.isGroupRadioActive) {
      inputModel.groupId = 0;
    } else {
      inputModel.employeeId = 0;
    }

    try {
      await this._ticketService.updateTicketFollowType(inputModel).toPromise();
      this.notify.success(this.l("SavedSuccessfully"));
    } catch (error) {
      this.notify.error(this.l("Error in creating fault"));
      console.log(error);
    } finally {
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
