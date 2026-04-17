import { DatePipe } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
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
  API_BASE_URL,
  CreateERPTicketDto,
  GroupDto,
  GroupServiceProxy,
  TicketDto,
  TicketServiceProxy,
  UserDto,
  UserServiceProxy,
} from "@shared/service-proxies/service-proxies";

interface UpdateTicketFollowUpDto {
  id: number;
  groupId: number;
  employeeId: number;
}
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

  private _http: HttpClient;
  private _baseUrl: string;

  constructor(
    injector: Injector,
    public bsModalRef: BsModalRef,
    private _ticketService: TicketServiceProxy,
    private _userService: UserServiceProxy,
    private _groupService: GroupServiceProxy,
    private _datePipe: DatePipe
  ) {
    super(injector);
    this._http = injector.get(HttpClient);
    this._baseUrl = injector.get(API_BASE_URL, '');
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
    this.createTicketDto.groupId = (this.ticket as any).groupId;
    const users = (this.ticket as any).users;
    this.createTicketDto.employeeId =
      users?.length == 1 ? users[0].userId : null;
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
    var inputModel: UpdateTicketFollowUpDto = {
      id: this.ticket.id,
      groupId: 0,
      employeeId: 0,
    };
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
      await this._http.put(
        this._baseUrl + '/api/services/app/Ticket/UpdateTicketFollowType',
        inputModel,
        { headers: new HttpHeaders({ 'Content-Type': 'application/json-patch+json' }) }
      ).toPromise();
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
