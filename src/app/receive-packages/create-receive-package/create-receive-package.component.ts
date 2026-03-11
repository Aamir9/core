import { DatePipe } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
  TemplateRef 
} from "@angular/core";
import { Router } from "@angular/router";
import { ViewMode } from "@app/activities/create-activity/create-activity.component";
import { CreatePackageTypeComponent } from "@app/package-types/create-package-type/create-package-type.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from "@shared/app-component-base";
import { UserTypes } from "@shared/AppConsts";
import { Base64Image } from "@shared/modals/base64image";

import {
  ActivityDto,
  ActivityServiceProxy,
  CreatePackageDto,
  CreatePackageTypeDto,
  CreateSubPackageDto,
  CustomerDto,
  CustomerListDto,
  CustomerServiceProxy,
  GroupDto,
  GroupServiceProxy,
  Int32LookUpDto,
  PackageDto,
  PackageServiceProxy,
  PackageTypeDto,
  PackageTypeServiceProxy,
  SupplierDto,
  SupplierListDto,
  SupplierServiceProxy,
  UserDto,
  UserServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LayoutStoreService } from "@shared/layout/layout-store.service";
import { Observable, of, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { DetailUserDialogComponent } from "@app/users/detail-user-dialog/detail-user-dialog.component";

@Component({
  selector: "app-create-receive-package",
  templateUrl: "./create-receive-package.component.html",
  styleUrls: ["./create-receive-package.component.css"],
  animations: [appModuleAnimation()],


})
export class CreateReceivePackageComponent
  extends AppComponentBase
  implements OnInit
{
  subPackages: CreateSubPackageDto[] = [];
  @Output() onSave = new EventEmitter<any>();
  @Input() customerUserId: any;
  saving = false;
  activity = new ActivityDto();
  packageTypeDto: CreatePackageTypeDto = new CreatePackageTypeDto();
  customers: CustomerListDto[] = [];
  createSubPackage: CreateSubPackageDto = new CreateSubPackageDto();
  activityTypes: Int32LookUpDto[] = [];
  suppliers: SupplierListDto[] = [];
  groupModel: GroupDto = new GroupDto();
  groupId: number = 0;
//  selectedCustomer: CustomerDto = new CustomerDto();
  employees: UserDto[] = [];
  createPackageDto: CreatePackageDto = new CreatePackageDto();
  customerId: number;
  onlyShowOpen: boolean = false;
  selectedPackageType: string = "";
  showInput: boolean = false;
  viewMode: ViewMode;
  FollowTypes: any;
  packageTypes: PackageTypeDto[] = [];
  groups: GroupDto[] = [];
  isPhotoUploaded = true;
  senderType = "None";
  showOption: boolean = true;
  receiveDate: Date;
  bsConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'YYYY-MM-DD',
    containerClass: 'theme-dark'
  };
selectedSupplierName: string | null = null;
selectedCustomerName: string | null = null;
activityId: any;
activityDate;
employeeShow:boolean = true;
groupshow : boolean = false;
customerSearchTerm: string = '';
customerPageNumber: number = 1;
customerPageSize: number = 20;
totalCustomerCount: number;
loadingCustomers: boolean = false;
customerSearch$: Subject<string> = new Subject<string>();
customer = new CustomerDto();
supplier = new SupplierDto();
modalRef: BsModalRef;
getSupplierDetail  = "Received-Package";
supplierIdTogetDetail:any;
UserIdGetDetail:any;

  constructor(
    injector: Injector,
    private _packageSrvice: PackageServiceProxy,
    private _groupService: GroupServiceProxy,
    private _userService: UserServiceProxy,
    private _customerService: CustomerServiceProxy,
    private _packageTypesSrvice: PackageTypeServiceProxy,
    private _supplierService: SupplierServiceProxy,
    private _activityService: ActivityServiceProxy,
    public bsModalRef: BsModalRef,
    private _datePipe: DatePipe,
    private _modalService: BsModalService,
    private router: Router,
    private _layoutService : LayoutStoreService
  ) {
    super(injector);
    this.bsConfig = {
      dateInputFormat: 'YYYY-MM-DD', // Format to display only the date
    };
  }

  async ngOnInit() {
   
    this._layoutService.updateHeaderTitle("Create Receive Package");
    await this.loadPackageTypes();
     this.loadEmployees();

    await this.loadSuppliers();
    await this.GetActivityTypes();
     this.loadGroups();
    this.setSender(this.senderType);
    this.setFollowupType(false);
    this.createPackageDto.employeeId = this.appSession.userId;
    this.createPackageDto.fllowUpEmployeeId = this.appSession.userId;
    this.receiveDate = new Date();
    this.createPackageDto.packageReceiveDate = this._datePipe.transform(this.receiveDate, "yyyy-MM-dd");
    this.createPackageDto.followUpDate = this._datePipe.transform(this.receiveDate, "yyyy-MM-dd");
    this.createPackageDto.fllowUpGroupId = null;
    this.createPackageDto.fllowUpEmployeeId = null;
    this.createPackageDto.activityTypeId =  30;

    this.customerSearch$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.searchCustomers(term))
    ).subscribe(customers => {
      if (customers) {
        this.customers = customers.items;   // Update customers with search results
      } else {
        this.loadCustomers();               // Load default list if search term is cleared
      }
      this.customerPageNumber = 1;          // Reset page number
    });

    this.loadCustomers();
  }
  onFocus(): void {
    if (!this.receiveDate) {
      this.receiveDate = new Date();
    }
  }

  onDateChange(date: Date): void {
    this.createPackageDto.followUpDate = this._datePipe.transform(date, "yyyy-MM-dd");
    console.log(event);
    // console.log("Selected date:", date);
    // Additional logic can go here
    // this.receiveDate = date;
    // this.createPackageDto.packageReceiveDate = this._datePipe.transform(date, "yyyy-MM-dd");

  }

  onSenderTypeChange() {
 
    if (this.senderType === 'Supplier') {
      this.createPackageDto.senderId = null; 
      this.selectedCustomerName = null; 
    } else if (this.senderType === 'Customer') {
      this.createPackageDto.senderId = null; 
      this.selectedSupplierName = null; 
    }
    else if (this.senderType === 'None') {
      this.createPackageDto.senderId = null;
      this.selectedSupplierName = null; 
      this.selectedCustomerName = null; 
    }
  }
  onPackageTypeChange(id: number): void {
    const selectedPackage = this.packageTypes.find(
      (pkg) => pkg.id === Number(id)
    );

    if (selectedPackage) {
      this.UserIdGetDetail = selectedPackage.userId;
      this.senderType =
        selectedPackage.userTypeId === 2 ? "Customer" :
        selectedPackage.userTypeId === 3 ? "Supplier" :
        selectedPackage.userTypeId === 0 ? "None" : "";
      this.createPackageDto.senderId = this.senderType == "None" ? null : selectedPackage.userId;
      this.selectedCustomerName = selectedPackage.userTypeId === 2 ? selectedPackage.userFullName : "";
      this.selectedSupplierName = selectedPackage.userTypeId === 3 ? selectedPackage.userFullName : "";
      debugger;
      if(selectedPackage.userTypeId == 3){
        this.supplierIdTogetDetail = selectedPackage.userId;
      }
  
    } else {
      console.warn("Selected package not found for ID:", id);
    }
  }
  isCustomerType(userTypeId: number): boolean {
    return this.customers.some(
      (customer) => customer.customerUserId === userTypeId
    );
  }

  isSupplierType(userTypeId: number): boolean {
    return this.suppliers.some(
      (supplier) => supplier.supplierUserId === userTypeId
    );
  }

  setFollowupType(val) {
    this.showOption = val;
  }
  onFileUploadHandler(image: Base64Image) {
    this.createPackageDto.base64Picture = image.ImageBase64String;
  }
  onFileUpload(image: Base64Image,i) {
    this.subPackages[i].base64Picture = image.ImageBase64String;
  }
  private loadEmployees(): void {
    this._userService.getFilteredUsers(UserTypes.Employee).subscribe({
      next: (response) => {
        this.employees = response.items;
        if (this.employees?.length > 0) {
          this.createPackageDto.fllowUpEmployeeId = this.employees[0].id;
          console.log('Default FollowUpEmployeeId:', this.createPackageDto.fllowUpEmployeeId);
        } else {
          console.warn('Employees array is empty.');
        }
      },
      error: (err) => {
        console.error('Error loading employees:', err);
      },
    });
  }
  
  
   loadGroups(): void {
    this._groupService.getAll().subscribe({
      next: (response) => {
        this.groups = response.items;
      },
      error: (err) => {
        console.error('Error loading groups:', err);
      },
    });
  }
  

  private async loadSuppliers() {
    this.suppliers = (await this._supplierService.getAll().toPromise()).items;
  }
  private async loadCustomers() {
    this.loadingCustomers = true;
    // this.customers = [];
    const response = await this._customerService
      .getAllLazyLoading(this.customerSearchTerm, this.customerPageNumber, this.customerPageSize)
      .toPromise();

    // If first page, replace customers; otherwise, append more results
    if (this.customerPageNumber === 1) {
      this.customers = response.items;
    } else {
      this.customers = [...this.customers, ...response.items];
    }

    this.loadingCustomers = false;
    // this.customers = (await this._customerService.getAll().toPromise()).items;
  }

  // Search customers when user types in the dropdown
  searchCustomers(term: string): Observable<any> {
    this.customerSearchTerm = term;
    this.customerPageNumber = 1;  // Reset to first page

    // If search term is empty, return empty result or reload default list
    if (!term) {
      return of({ items: [] });
    }

    // Call API for search with lazy loading
    return this._customerService.getAllLazyLoading(term, this.customerPageNumber, this.customerPageSize);
  }

  onCustomerSearchChange(event: any): void {
    const term = event.target.value;
    this.customerSearchTerm = term;
    this.customerPageNumber = 1;


    if (term) {
      this.customerSearch$.next(term);
    } else {
      this.loadCustomers();
    }
  }

  onScrollToEnd(): void {
    this.customerPageNumber++;  // Increment page number
    this.loadCustomers();       // Load next page
  }

  private async loadPackageTypes() {
    this.packageTypes = (
      await this._packageTypesSrvice.getAll().toPromise()
    ).items;
  }

  // onFollowUpTypeChange(event: Event): void {
  //   const inputElement = event.target as HTMLInputElement;
  //   this.showOption = inputElement.value === 'true';
  // }

  onFollowUpTypeChange(type: string): void {
    if (type === 'employee') {
      this.employeeShow = true;
      this.groupshow = false;
      this.createPackageDto.fllowUpGroupId = null;
    } else {
      this.groupshow = true;
      this.employeeShow = false;
      this.createPackageDto.fllowUpEmployeeId = null;
    }
  }

  private async GetActivityTypes() {
    this._activityService.getAllActivityTypes().subscribe((result) => {
      this.activityTypes = result.items;
      this.FollowTypes = result.items;
    });
  }

  setSender(val: string) {
    this.showInput = val === "Supplier";
  }

  isEditMode() {
    return this.viewMode == ViewMode.Edit;
  }
  addSubPackage(event: Event) {
    const newSubPackage = new CreateSubPackageDto();
    newSubPackage.contains  ='';
    newSubPackage.base64Picture = '';
    this.subPackages.push(newSubPackage);
    event.preventDefault();
  }

  removeSubPackage(index: number) {
    this.subPackages.splice(index, 1);
  }

  changeDateFormat() {
    if (this.receiveDate == undefined || this.receiveDate == null) {
      this.receiveDate = new Date();
    }
    this.createPackageDto.packageReceiveDate = this._datePipe.transform(
      this.receiveDate,
      "yyyy-MM-dd"
    );

    this.createPackageDto.followUpDate = this.createPackageDto.followUpDate ? this.createPackageDto.followUpDate : this._datePipe.transform(Date.now(),"yyyy-MM-dd");
  }
  save(): void {
    this.saving = true;
    if (this.subPackages && this.subPackages.length > 0) {
      this.createPackageDto.createSubPackageDtos = this.subPackages;
    }

    this.changeDateFormat();

    if (
      this.createPackageDto.fllowUpEmployeeId == undefined ||
      this.createPackageDto.fllowUpEmployeeId == null
    ) {
      this.createPackageDto.fllowUpEmployeeId = null;
    }

    if (
      this.createPackageDto.fllowUpGroupId == undefined ||
      this.createPackageDto.fllowUpGroupId == null
    ) {
      this.createPackageDto.fllowUpGroupId = null;
    }

    if (
      this.createPackageDto.employeeId == undefined ||
      this.createPackageDto.employeeId == null
    ) {
      this.createPackageDto.employeeId = this.appSession.userId;
    }

    if (
      this.createPackageDto.senderId == undefined ||
      this.createPackageDto.senderId == null
    ) {
      this.createPackageDto.senderId = null;
    }

    if (
      this.createPackageDto.followUpTypeId == undefined ||
      this.createPackageDto.followUpTypeId == null
    ) {
      this.createPackageDto.followUpTypeId = null;
    }

    if (
      this.createPackageDto.packageReceiveDate == undefined ||
      this.createPackageDto.packageReceiveDate == null
    ) {
      this.notify.error(this.l("Error during package creation"));
      this.saving = false;
    }

    if (
      this.createPackageDto.packageTypeId == undefined ||
      this.createPackageDto.packageTypeId == null
    ) {
      this.createPackageDto.packageTypeId = 0;
    }
 
  console.log("Save Received this.createPackageDto",this.createPackageDto);
   debugger;
    if (this.save) {
      this._packageSrvice.create(this.createPackageDto).subscribe(
        () => {
          this.notify.info(this.l("SavedSuccessfully"));
          this.router.navigate(['/app/package-receive']);
          // this.bsModalRef.hide();
          // this.onSave.emit();
        },
        () => {
          this.saving = false;
        }
      );
    }
  }

  back(){
    this.router.navigate(['/app/package-receive']);
  }
  public showCreateDialog(): void {
    const createPackageDialog: BsModalRef = this._modalService.show(
      CreatePackageTypeComponent,
      {
        class: 'modal-lg',
      }
    );

  }

   showCustomerSupplierDialog(userId:any): void {
    let UserDetailDialog: BsModalRef;
    UserDetailDialog = this._modalService.show(
      DetailUserDialogComponent,
      {
        class: 'customer-modal-lg',
        initialState: {
          id: userId,
        },
      }
    );
  }

  selectedEmployeeFunction(employeeId){
    this.createPackageDto.employeeId = employeeId;
  }

  selectedSupplierNameFunction(event){
  this.selectedSupplierName = event;
  this.createPackageDto.senderId = event; 
  this.UserIdGetDetail = event;
  }

  selectedCustomerNameFunction(event){
    this.selectedCustomerName = event;
    this.UserIdGetDetail = event;
    this.createPackageDto.senderId = event; 
    }

}
