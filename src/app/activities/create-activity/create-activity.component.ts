import { DateHelper } from "./../../../shared/helpers/DateHelper";
import {
  UserDto,
  UserServiceProxy,
  CreateActivityDto,
  CustomerServiceProxy,
  CustomerDto,
  RoomDto,
  RoomServiceProxy,
  CustomerListDto,
  TicketServiceProxy,
  TicketDto,
  CreateERPTicketDto,
  ActivityListDto,
  ProductServiceProxy,
  ProductDto,
  ProductItemServiceProxy,
  ProductItemDto,
  GroupServiceProxy,
  GroupDto,
  CreateFaultFileDto,
  CreateERPFaultDto,
  FaultServiceProxy,
  NoteActivityInputDto,
  Int32LookUpDto,
  CreateCommentDto,
  CommentDto,
  UpdateSolutionNote,
  UpdateFaultStatusDto,
  CommentServiceProxy,
  FaultDto,
  FaultFile,
  UpdateTicketStatusDto,
} from "./../../../shared/service-proxies/service-proxies";
import {
  Component,
  EventEmitter,
  Injector,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from "@shared/app-component-base";
import { ActivityServiceProxy } from "@shared/service-proxies/service-proxies";
import { BsModalRef } from "ngx-bootstrap/modal";
import { AppConsts, FaultStatuses, UserTypes } from "@shared/AppConsts";
import { AppSessionService } from "@shared/session/app-session.service";
import { DatePipe, Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { NgForm } from "@angular/forms";
import { activityTypes } from "../../../shared/AppConsts";

export enum ViewMode {
  Create = "create",
  Edit = "edit",
  View = "view",
}

export enum ViewType {
  Ticket = "ticket",
  Fault = "fault",
  Note = "note",
}

@Component({
  selector: "app-create-activity",
  templateUrl: "./create-activity.component.html",
  styleUrls: ["./create-activity.component.css"],
  animations: [appModuleAnimation()],
})
export class CreateActivityComponent
  extends AppComponentBase
  implements OnInit
{
  ViewMode = ViewMode;
  viewMode: ViewMode;
  viewType: ViewType;
  @Output() onSave = new EventEmitter<any>();
  saving = false;
  activity = new CreateActivityDto();
  // activityDate = new Date();
  // followUpDate = new Date();
  activityDate;
  followUpDate;
  FollowTypes: any;
  activityKinds: any;
  id: number;
  faultId: number;
  noteId: number;
  employees: UserDto[] = [];
  rooms: RoomDto[] = [];
  allActivityTypes: Int32LookUpDto[] = [];
  customers: CustomerListDto[] = [];
  subCustomers: CustomerDto[] = [];
  tickets: TicketDto[] = [];
  products: ProductDto[] = [];
  productItems: ProductItemDto[] = [];
  groups: GroupDto[] = [];
  selectedActivity!: ActivityListDto;
  ticketTitle: string;
  ticketDescription: string;
  selectedCustomer: CustomerListDto;
  selectedSubCustomer: CustomerDto;
  selectedTicketId!: number;
  selectedTicketTitle!: string;
  files: CreateFaultFileDto[] = [];
  selectedEmployees: UserDto[] = [];
  selectedGroups: GroupDto[] = [];
  activityTypeList: { id: number; name: string }[] = [
    {
      id: 19,
      name: "Ticket",
    },
    {
      id: 20,
      name: "Fault",
    },
    {
      id: 7,
      name: "Note",
    },
  ];
  activityStatusList: { id: number; name: string }[] = [
    {
      id: 1,
      name: "Open",
    },
    {
      id: 2,
      name: "RMA",
    },
    {
      id: 3,
      name: "Resolved",
    },
  ];
  assignToTicketList: string[] = ["New", "Existing", "None"];
  assignToPeopleList: string[] = ["Employee", "Group"];
  noteTypeList: { id: number; name: string }[] = [
    {
      id: 11,
      name: "SMS Note",
    },
    {
      id: 12,
      name: "Email Note",
    },
    {
      id: 1,
      name: "Phone Call Note",
    },
  ];
  selectedActivityType = this.activityTypeList[0];
  selectedActivityStatus = this.activityStatusList[0];
  selectedAssignToTicket = this.assignToTicketList[0];
  selectedAssignToPeople = this.assignToPeopleList[0];
  selectedNoteType = this.noteTypeList[0];
  selectedFollowUpTypeId: number;
  noteDate: Date;

  // Fault Fields
  faultTitle!: string;
  selectedProduct!: number;
  selectedSerialNo!: number;

  assignedTo: any;
  selectedCustomerId;
  selectedSubCustomerId;

  createFaultDto: CreateERPFaultDto = new CreateERPFaultDto();
  noteActivityInput: NoteActivityInputDto = new NoteActivityInputDto();
  @ViewChild("activityFrm") activityFrm: NgForm;

  public ticketDetail: TicketDto = new TicketDto();
  public productName: string;
  comments: CommentDto[];
  commentDto = new CreateCommentDto();
  currentFaultDto = new FaultDto();
  commentText: string;
  solutionNote: string;
  dbFilesList: FaultFile[] = [];

  constructor(
    public injector: Injector,
    private _activityService: ActivityServiceProxy,
    private _userService: UserServiceProxy,
    private _roomService: RoomServiceProxy,
    public _appSessionService: AppSessionService,
    private _customerService: CustomerServiceProxy,
    private _ticketService: TicketServiceProxy,
    private _productService: ProductServiceProxy,
    private _productItemService: ProductItemServiceProxy,
    private _groupService: GroupServiceProxy,
    private _faultService: FaultServiceProxy,
    private _commentService: CommentServiceProxy,
    private _datePipe: DatePipe,
    private location: Location,
    private route: ActivatedRoute
  ) {
    super(injector);
  }

  async ngOnInit() {
    this.initView();
    this.getCustomers();
    this.getProducts();
    this.getGroups();
    this.getEmployees();
    await this.GetActivityTypes();
    await this.getActivityArts();
    await this.GetRooms();
    await this.loadProductItems();
    if (this.viewMode == ViewMode.Edit) {
      if (this.viewType.toString() == "Ticket") {
        this._ticketService.getById(this.id).subscribe((result) => {
          this.ticketDetail = result;
          console.log("this.ticketDetail", this.ticketDetail);
          this.commentDto.activityId =  this.ticketDetail.activityId;
          this.getComments();
          this.selectedCustomerId = this.ticketDetail.customerId;
          let selectedCustomer = this.customers.find(
            (c) => c.id == this.ticketDetail.customerId
          );
          this.selectedCustomer = selectedCustomer;

          this.ticketTitle = this.ticketDetail.comment;
          this.ticketDescription = this.ticketDetail.description;

          let actStatus = this.activityStatusList.find(
            (a) => a.name == this.ticketDetail.status
          );
          this.selectedActivityStatus = actStatus;

          let actType = this.activityTypeList.find(
            (a) => a.name == this.viewType
          );
          this.selectedActivityType = actType;

          this.solutionNote = this.ticketDetail.solutionNote;
        });
      } else if (this.viewType.toString() == "Fault") {
        this._ticketService.getById(this.id).subscribe((result) => {
          this.ticketDetail = result;
          console.log("this.ticketDetail", this.ticketDetail);

          this.selectedCustomerId = this.ticketDetail.customerId;
          let selectedCustomer = this.customers.find(
            (c) => c.id == this.ticketDetail.customerId
          );
          this.selectedCustomer = selectedCustomer;

          this.ticketTitle = this.ticketDetail.comment;

          let actStatus = this.activityStatusList.find(
            (a) => a.name == this.ticketDetail.status
          );
          // this.selectedActivityStatus = actStatus;

          // let actType = this.activityTypeList.find(
          //   (a) => a.name == this.viewType
          // );
          // this.selectedActivityType = actType;

          //Faults changes
          this._faultService.getById(this.faultId).subscribe((fault) => {
          if (fault) {
            this.currentFaultDto = fault;
            this.getComments();
          }

          this.solutionNote = fault.solutionNote;

          this.productName = fault.productName;
          this.selectedSerialNo = fault.productItemId;
          this.createFaultDto.description = fault.description;
          this.createFaultDto.comment = fault.comment;

          fault.activityResponsibles.forEach((element) => {
            if (element.employeeId) {
              let em = this.employees.find((x) => x.id == element.employeeId);
              this.assignedTo = em.id;
              this.selectedEmployees.push(em);
              this.selectedAssignToPeople = this.assignToPeopleList.find(
                (x) => x == "Employee"
              );
            } else {
              let grp = this.groups.find((x) => x.id == element.groupId);
              this.assignedTo = grp.id;
              this.selectedGroups.push(grp);
              this.selectedAssignToPeople = this.assignToPeopleList.find(
                (x) => x == "Group"
              );
            }
          });

          this.files = [];
          this.dbFilesList = [];
          fault.files.forEach((file) => {
            if (file.type.includes("image") || file.type.includes("video"))
              this.dbFilesList.push(file);
            else this.dbFilesList.push(file);
          });
          });
        });
      } else if (this.viewType.toString() == "Note") {
        this._ticketService.getById(this.id).subscribe((result) => {
          this.ticketDetail = result;
          console.log("this.ticketDetail", this.ticketDetail);

          this.selectedCustomerId = this.ticketDetail.customerId;
          let selectedCustomer = this.customers.find(
            (c) => c.id == this.ticketDetail.customerId
          );
          this.selectedCustomer = selectedCustomer;

          this.ticketTitle = this.ticketDetail.comment;

          let actStatus = this.activityStatusList.find(
            (a) => a.name == this.ticketDetail.status
          );
          this.selectedActivityStatus = actStatus;

          let actType = this.activityTypeList.find(
            (a) => a.name == this.viewType
          );
          this.selectedActivityType = actType;

          //Notes changes
          let notes = (this.ticketDetail as any).notes;
          let note = notes ? notes.find((n) => n.id == this.noteId) : undefined;
          console.log("this.note", note);
          if (note) {
          this.noteActivityInput.title = note.title;
          this.noteActivityInput.description = note.description;

          let activityDetail = note.activityDetail;
          if (activityDetail) {
          this.selectedNoteType = this.noteTypeList.find(
            (x) => x.id == activityDetail.activityTypeId
          );
          this.selectedFollowUpTypeId = activityDetail.followUpTypeId;

          this.activityDate = this._datePipe.transform(
            DateHelper.toLocalDate(activityDetail.date),
            "yyyy-MM-dd"
          );
          this.followUpDate = this._datePipe.transform(
            DateHelper.toLocalDate(activityDetail.followUpDate),
            "yyyy-MM-dd"
          );
          }

          //this.selectedNoteType = note.
          if (note.activityResponsibles) {
          note.activityResponsibles.forEach((element) => {
            if (element.employeeId) {
              let em = this.employees.find((x) => x.id == element.employeeId);
              this.assignedTo = em.id;
              this.selectedEmployees.push(em);
              this.selectedAssignToPeople = this.assignToPeopleList.find(
                (x) => x == "Employee"
              );
            } else {
              let grp = this.groups.find((x) => x.id == element.groupId);
              this.assignedTo = grp.id;
              this.selectedGroups.push(grp);
              this.selectedAssignToPeople = this.assignToPeopleList.find(
                (x) => x == "Group"
              );
            }
          });
          }
          }
        });
      }
    }
  }

  isEditMode() {
    return this.viewMode == ViewMode.Edit;
  }

  addComment() {
    this.commentDto.commentText = this.commentText;
    // if (this.viewType.toString() == "Ticket")
    //   this.commentDto.activityId = this.ticketDetail.activityId;
    // else this.commentDto.activityId = this.currentFaultDto.activityId;
    this._commentService.create(this.commentDto).subscribe((result) => {
      this.notify.info(this.l("SavedSuccessfully"));
      this.commentDto = new CreateCommentDto();
      this.commentText = "";
      this.getComments();
    });
  }

  getComments() {
    // this._commentService
    //   .getAll(this.currentFaultDto.activityId)
    //   .subscribe((result) => {
    //     this.comments = result.items;
    //     debugger;
    //   });

    this._commentService
    .getAll(this.commentDto.activityId )
    .subscribe((result) => {
      this.comments = result.items;
    });
  }

  addSolutionNoteForFault() {
    let solutionNote = new UpdateSolutionNote();
    solutionNote.id = this.faultId;
    solutionNote.solutionNote = this.solutionNote;
    this._faultService.saveFaultSolution(solutionNote).subscribe((res) => {
      //this.notify.info(this.l("SavedSuccessfully"));
    });
  }

  addSolutionNoteForTicket() {
    let solutionNote = new UpdateSolutionNote();
    solutionNote.id = this.id;
    solutionNote.solutionNote = this.solutionNote;
    this._ticketService.saveTicketSolution(solutionNote).subscribe((res) => {
      //this.notify.info(this.l("SavedSuccessfully"));
    });
  }

  updateFaultStatus(status: any) {
    let updateFault = new UpdateTicketStatusDto();
    updateFault.id = this.id;
    updateFault.ticketStatus = status;
    this._ticketService.updateTicketStatus(updateFault).subscribe((result) => {
      this.notify.info(this.l("SavedSuccessfully"));
      this.getTicketDetailById();
    });
  }

  private getTicketDetailById() {
    this._ticketService.getById(this.id).subscribe((result) => {
      this.ticketDetail = result;
    });
  }

  private initView() {
    if (this.route.snapshot.queryParamMap.get("customerId")) {
      this.selectedCustomerId = parseInt(
        this.route.snapshot.queryParamMap.get("customerId")
      );
    }
    // this.selectedSubCustomerId = parseInt(
    //   this.route.snapshot.queryParamMap.get("subCustomerId")
    // );
    this.id = parseInt(this.route.snapshot.queryParamMap.get("id"));
    this.faultId = parseInt(this.route.snapshot.queryParamMap.get("faultId"));
    this.noteId = parseInt(this.route.snapshot.queryParamMap.get("noteId"));
    this.viewMode = this.route.snapshot.paramMap.get("mode") as ViewMode;

    if (this.viewMode != ViewMode.Create) {
      this.viewType = this.route.snapshot.queryParamMap.get("type") as ViewType;
      switch (this.viewType) {
        case ViewType.Ticket:
          this.selectedActivityType = this.activityTypeList[0];
          break;
        case ViewType.Fault:
          this.selectedActivityType = this.activityTypeList[1];
          break;
        case ViewType.Note:
          this.selectedActivityType = this.activityTypeList[2];
          break;
        default:
          break;
      }
    }
  }

  private getTickets() {
    if (this.selectedSubCustomer) {
      this._ticketService
        .getPagedResult(
          undefined,
          undefined,
          0,
          999
        )
        .subscribe((result) => {
          this.tickets = result.items;
        });
    } else {
      this._ticketService
        .getPagedResult(
          undefined,
          undefined,
          0,
          999
        )
        .subscribe((result) => {
          this.tickets = result.items;
        });
    }
  }

  private getCustomers() {
    // todo: get parent customers only
    this._customerService.getAll().subscribe((result) => {
      this.customers = result.items;
      if (this.selectedCustomerId)
        this.selectedCustomer = this.customers.find(
          (c) => c.id == this.selectedCustomerId
        );
    });
  }

  private getProducts() {
    this._productService.getAll().subscribe((result) => {
      this.products = result.items;
    });
  }

  private getGroups() {
    this._groupService.getAll().subscribe((result) => {
      this.groups = result.items;
    });
  }

  private async GetRooms() {
    this.rooms = (await this._roomService.getAll().toPromise()).items;
  }

  private async GetActivityTypes() {
    this._activityService.getAllActivityTypes().subscribe((result) => {
      this.allActivityTypes = result.items;
      this.FollowTypes = result.items;
    });
  }

  private async getActivityArts() {
    this._activityService.getAllActivityArts().subscribe((result) => {
      this.activityKinds = result.items;
      console.log(this.activityKinds);
    });
  }

  private getEmployees() {
    this._userService
      .getFilteredUsers(UserTypes.Employee)
      .subscribe((result) => {
        this.employees = result.items;
      });
  }

  onCustomerChange(customerId: number) {
    const customer = this.customers.find((c) => c.id == customerId);
    this.selectedCustomer = customer;
    this.selectedCustomerId = customerId;
    this.subCustomers = [];
    this.selectedSubCustomer = null;
    this._customerService
      .getSubCustomers(undefined, customerId)
      .subscribe((result) => {
        this.subCustomers = result.items;
      });
    this.getTickets();
  }

  onSubCustomerChange(customerId: number) {
    this.selectedSubCustomer = this.subCustomers.find(
      (c) => c.id == customerId
    );
    this.getTickets();
  }

  onTicketChange(ticketId: number) {
    const selectedTicket = this.tickets.find((t) => t.id == ticketId);
    this.ticketTitle = selectedTicket.comment;
  }

  // onProductChange(productId: number) {
  //   if(productId){
  //     this._productItemService.getProductItemsOfProduct(productId).subscribe(
  //       (result) => {
  //         this.productItems = result.items;
  //       },
  //       (error) => {
  //         console.error(error);
  //       }
  //     );
  //   }
  // }

  private async loadProductItems() {
    this.productItems = (
      await this._productItemService.getAll().toPromise()
    ).items;
  }

  onProductItemChange(productItemId: number) {
    console.log("product item id", productItemId);
    console.log("productitems", this.productItems);
    let productItem = this.productItems.find((p) => p.id == productItemId);
    if (productItem) {
      this.productName = productItem.productName;
    }
  }

  onEmployeeChange(employeeId: number) {
    const alreadyExists = this.selectedEmployees.find(
      (e) => e.id == employeeId
    );
    if (alreadyExists) return;
    this.selectedEmployees.push(this.employees.find((e) => e.id == employeeId));
  }

  removeEmployee(employeeId: number) {
    this.selectedEmployees = this.selectedEmployees.filter(
      (e) => e.id != employeeId
    );
  }

  onGroupChange(groupId: number) {
    const alreadyExists = this.selectedGroups.find((g) => g.id == groupId);
    if (alreadyExists) return;
    this.selectedGroups.push(this.groups.find((g) => g.id == groupId));
  }

  removeGroup(groupId: number) {
    this.selectedGroups = this.selectedGroups.filter((g) => g.id != groupId);
  }

  onFileSelect($event) {
    const file = $event.target.files[0];
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
  }

  removeFile(i): void {
    this.files.splice(i, 1);
  }
  preview(url: string) {
    window.open(url, "_blank");
  }
  save(): void {
    this.saving = true;
    this.activity.date = DateHelper.convertDateTimeToString(
      this.activityDate,
      AppConsts.dateFormate
    );
    this.activity.followUpDate = DateHelper.convertDateTimeToString(
      this.followUpDate,
      AppConsts.dateFormate
    );
    // this.activity.customerId = this.selectedSubCustomer.userId;
    // this.activity.customerTableId = this.selectedSubCustomer.id;
    this._activityService.create(this.activity).subscribe(
      () => {
        this.notify.info(this.l("SavedSuccessfully"));
        this._appSessionService.onUpdateActivityInfo.emit(true);
        this.onSave.emit();
      },
      () => {
        this.saving = false;
      }
    );
  }

  async onSaveClick() {
    if (this.viewMode == ViewMode.Edit) {
      if (this.viewType.toString() == "Ticket") {
        this.addSolutionNoteForTicket();
        this.updateFaultStatus(this.selectedActivityStatus.id);
      } else if (this.viewType.toString() == "Fault") {
        this.addSolutionNoteForFault();
        this.updateFaultStatus(this.selectedActivityStatus.id);
      } else if (this.viewType.toString() == "Note") {
      }
      return;
    }
    console.log("this.activityFrm", this.activityFrm);
    if (!this.activityFrm.valid) {
      this.notify.error("Please add missing fields.");
      return;
    }

    if (this.selectedActivityType.name == "Ticket") {
      this.saveTicketActivity();
    } else {
      if (!!this.createFaultDto.comment && this.selectedSerialNo) {
        await this.saveFaultActivity();
      }
      if (
        !!this.noteActivityInput.title &&
        this.followUpDate &&
        this.selectedFollowUpTypeId
      ) {
        await this.saveNoteActivity(false);
      }
    }
  }

  async saveTicketActivity(goBcak: boolean = true) {
    this.saving = true;
    var createTicketDto = new CreateERPTicketDto();
    createTicketDto.comment = this.ticketTitle;
    createTicketDto.description = this.ticketDescription;
    createTicketDto.status = this.selectedActivityStatus.id;
    createTicketDto.email = this.appSession.user.emailAddress;
    createTicketDto.date = new Date().toISOString().slice(0, 16);
    createTicketDto.groupId = 0;
    createTicketDto.employeeId = 0;
    createTicketDto.customerUserId = this.selectedSubCustomer
      ? this.selectedSubCustomer.userId
      : this.selectedCustomer.customerUserId;
    createTicketDto.customerId = this.selectedSubCustomer
      ? this.selectedSubCustomer.id
      : this.selectedCustomer.id;
    createTicketDto.date = this._datePipe.transform(
      DateHelper.toLocalDate(new Date(createTicketDto.date)),
      "yyyy-MM-dd"
    );
    try {
      this.selectedTicketId = await this._ticketService
        .createFromERP(createTicketDto)
        .toPromise();
      this.notify.success(this.l("SavedSuccessfully"));
    } catch (error) {
      this.notify.error(this.l("Error in creating fault"));
      console.log(error);
    } finally {
      this.saving = false;
      this.onSave.emit(true);
      if (goBcak) this.location.back();
    }
  }

  async saveFaultActivity() {
    switch (this.selectedAssignToTicket) {
      case "New":
        await this.saveTicketActivity(false);
        this.createFaultDto.ticketId = this.selectedTicketId;
        await this.createFault();
        break;
      case "Existing":
        this.createFaultDto.ticketId = this.selectedTicketId;
        await this.createFault();
        break;
      case "None":
        this.createFaultDto.ticketId = null;
        await this.createFault();
        break;
    }
  }

  private async createFault() {
    this.saving = true;
    this.createFaultDto.email = this.selectedSubCustomer
      ? this.selectedSubCustomer.emailAddress
      : this.selectedCustomer.emailAddress;
    this.createFaultDto.resposibleEmployeeId = null;
    this.createFaultDto.files = this.files;
    this.createFaultDto.productItemId = this.selectedSerialNo;
    this.createFaultDto.customerUserId = this.selectedSubCustomer
      ? this.selectedSubCustomer.userId
      : this.selectedCustomer.customerUserId;
    this.createFaultDto.supplierId = null;
    this.createFaultDto.date = this._datePipe.transform(
      Date.now(),
      "yyyy-MM-dd"
    );
    if (this.selectedAssignToPeople == "Employee") {
      this.createFaultDto.employeeIds = this.selectedEmployees.map((e) => e.id);
    } else {
      this.createFaultDto.groupIds = this.selectedGroups.map((g) => g.id);
    }
    try {
      await this._faultService.createFromERP(this.createFaultDto).toPromise();
      this.notify.success(this.l("SavedSuccessfully"));
    } catch (error) {
      this.notify.error(this.l("Error in creating fault"));
      console.log(error);
    } finally {
      this.saving = false;
      this.onSave.emit(true);
      this.location.back();
    }
  }

  async saveNoteActivity(createTicket = true) {
    switch (this.selectedAssignToTicket) {
      case "New":
        if (createTicket) await this.saveTicketActivity(false);
        this.noteActivityInput.ticketId = this.selectedTicketId;
        await this.createNote();
        break;
      case "Existing":
        this.noteActivityInput.ticketId = this.selectedTicketId;
        this.createNote();
        break;
      case "None":
        this.noteActivityInput.ticketId = null;
        this.createNote();
        break;
    }
  }

  private async createNote() {
    this.saving = true;
    // this.noteActivityInput.customerTableId = this.selectedSubCustomer
    //   ? this.selectedSubCustomer.id
    //   : this.selectedCustomer.id;

       this.noteActivityInput.customerTableId = this.selectedSubCustomer
      ? this.selectedSubCustomer.userId
      : this.selectedCustomer.customerUserId;

      this.noteActivityInput.customerTableId = this.selectedSubCustomer
      ? this.selectedSubCustomer.id
      : this.selectedCustomer.id;
    this.noteActivityInput.customerId = this.selectedSubCustomer
      ? this.selectedSubCustomer.userId
      : this.selectedCustomer.customerUserId;
    this.noteActivityInput.followUpTypeId = this.selectedFollowUpTypeId;
    this.noteActivityInput.followUpDate = this._datePipe.transform(
      DateHelper.toLocalDate(this.followUpDate),
      "yyyy-MM-dd"
    );
    this.noteActivityInput.date = this._datePipe.transform(
      this.activityDate,
      "yyyy-MM-dd"
    );
    this.noteActivityInput.employeeId = this.activity.employeeId;
    this.noteActivityInput.activityTypeId = this.selectedNoteType.id;
    this.noteActivityInput.activityArtId = 2; // Activity
    this.noteActivityInput.name = this.noteActivityInput.title;

    if (this.selectedAssignToPeople == "Employee") {
      this.noteActivityInput.employeeIds = this.selectedEmployees.map(
        (e) => e.id
      );
    } else {
      this.noteActivityInput.groupIds = this.selectedGroups.map((g) => g.id);
    }

    if (this.selectedNoteType.name == "SMS Note") {
      try {
        await this._activityService
          .createSmsNoteActivityAndAddNote(this.noteActivityInput)
          .toPromise();
        this.notify.success(this.l("SavedSuccessfully"));
      } catch (error) {
        this.notify.error(this.l("Error in creating fault"));
        console.log(error);
      } finally {
        this.saving = false;
        this.onSave.emit(true);
        this.location.back();
      }
    } else if (this.selectedNoteType.name == "Email Note") {
      try {
        await this._activityService
          .createEmailNoteActivityAndAddNote(this.noteActivityInput)
          .toPromise();
        this.notify.success(this.l("SavedSuccessfully"));
      } catch (error) {
        this.notify.error(this.l("Error in creating fault"));
        console.log(error);
      } finally {
        this.saving = false;
        this.onSave.emit(true);
        this.location.back();
      }
    } else if (this.selectedNoteType.name == "Phone Call Note") {
      try {
        await this._activityService
          .createPhoneCallNoteActivityAndAddNote(this.noteActivityInput)
          .toPromise();
        this.notify.success(this.l("SavedSuccessfully"));
      } catch (error) {
        this.notify.error(this.l("Error in creating fault"));
        console.log(error);
      } finally {
        this.saving = false;
        this.onSave.emit(true);
        this.location.back();
      }
    }
  }

  goBack() {
    this.location.back();
  }
}
