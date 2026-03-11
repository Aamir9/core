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
  ActivityListDto,
  CreateERPFaultDto,
  CreateFaultFileDto,
  FaultServiceProxy,
  InvoiceLineDto,
  UserDto,
  UserServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { BsModalRef } from "ngx-bootstrap/modal";
import {
  NgxFileDropEntry,
  FileSystemDirectoryEntry,
  FileSystemFileEntry,
} from "ngx-file-drop";

@Component({
  selector: "app-create-fault",
  templateUrl: "./create-fault.component.html",
  styleUrls: ["./create-fault.component.css"],
})
export class CreateFaultComponent extends AppComponentBase implements OnInit {
  saving = false;

  activity: ActivityListDto = new ActivityListDto();
  description: string;
  emailAddress: string;
  isPhotoUploaded = true;
  createFaultDto: CreateERPFaultDto = new CreateERPFaultDto();
  employees: UserDto[] = [];
  @Output() onSave = new EventEmitter<boolean>();
  files: CreateFaultFileDto[] = [];
  invoiceLine:InvoiceLineDto =new InvoiceLineDto();

  constructor(
    injector: Injector,
    public bsModalRef: BsModalRef,
    private _faultService: FaultServiceProxy,
    private _userService: UserServiceProxy,
    private _datePipe: DatePipe
  ) {
    super(injector);
  }

  async ngOnInit() {

    console.log("invoice", this.activity);
    console.log("invoiceLine ======> ", this.invoiceLine);
    await this.getEmployees();

    this.activity.productName = this.invoiceLine.productName;
    this.activity.productNumber = this.invoiceLine.productNumber;
    this.activity.productSerialNumber = this.invoiceLine.serialNumber;
    this.activity.supplierName = this.invoiceLine.supplierName;

    this.createFaultDto.email = this.activity.customerEmail;
    let currentUser = this.appSession.userId;
    if (currentUser) {
      this.createFaultDto.resposibleEmployeeId = currentUser;
    }
  }

  public dropped(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          const reader = new FileReader();
          reader.onload = () => {
            const fileDto: CreateFaultFileDto = new CreateFaultFileDto();
            fileDto.name = file.name;
            fileDto.size = file.size;
            fileDto.type = file.type;
            fileDto.base64 = reader.result.toString();
            this.files.push(fileDto);
          };
          reader.onerror = (error) => {
            console.log("Error: ", error);
          };
          reader.readAsDataURL(file);
        });
      }
    }
  }

  removeFile(i): void {
    this.files.splice(i, 1);
  }

  //#region Create Fault
  async createFault() {
    this.saving = true;
    this.createFaultDto.files = this.files;
    this.createFaultDto.productItemId = this.activity.productItemId;
    this.createFaultDto.customerUserId = this.activity.customerUserId;
    this.createFaultDto.supplierId = this.activity.supplierId;
    this.createFaultDto.date = this._datePipe.transform(
      DateHelper.toLocalDate(new Date(this.createFaultDto.date)),
      "yyyy-MM-dd"
    );
    try {
      await this._faultService.createFromERP(this.createFaultDto).toPromise();
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

  private async getEmployees() {
    this.employees = await (
      await this._userService.getFilteredUsers(UserTypes.Employee).toPromise()
    ).items;
  }
  //#endregion
}
