import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewMode } from '@app/activities/create-activity/create-activity.component';
import { CreatePackageTypeComponent } from '@app/package-types/create-package-type/create-package-type.component';
import { AppComponentBase } from '@shared/app-component-base';
import { UserTypes } from '@shared/AppConsts';
import { LayoutStoreService } from '@shared/layout/layout-store.service';
import { Base64Image } from '@shared/modals/base64image';
import { ActivityDto, ActivityServiceProxy, CreatePackageDto, CreatePackageTypeDto, CreateSubPackageDto, CustomerDto, CustomerListDto, CustomerServiceProxy, GroupDto, GroupServiceProxy, Int32LookUpDto, PackageDto, PackageServiceProxy, PackageTypeDto, PackageTypeServiceProxy, SubPackageDto, SupplierListDto, SupplierServiceProxy, UpdatePackageDto, UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { forEach, uniqueId } from 'lodash-es';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit-receive-package',
  templateUrl: './edit-receive-package.component.html',
  styleUrls: ['./edit-receive-package.component.css']
})
export class EditReceivePackageComponent extends AppComponentBase implements OnInit {
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
  selectedCustomer: CustomerDto = new CustomerDto();
  employees: UserDto[] = [];
  createPackageDto: CreatePackageDto = new CreatePackageDto();
  UpdatePackageDto: UpdatePackageDto = new UpdatePackageDto();
  customerId: number;
  onlyShowOpen: boolean = false;
  selectedPackageType: string = "";
  showInput: boolean = false;
  viewMode: ViewMode;
  FollowTypes: any;
  packageTypes: PackageTypeDto[] = [];
  groups: GroupDto[] = [];
  isPhotoUploaded: boolean = true;
  isImageLoadFramDb : boolean = null
  senderType:any = "";
  // senderType: string; // This will be set dynamically
  customerSearchTerm: string = '';
customerPageNumber: number = 1;
customerPageSize: number = 20;
totalCustomerCount: number;
  loadingCustomers: boolean = false;
  defaultSenderType: string;
  showOption: boolean = true;
  employeeShow:boolean = true;
  groupshow : boolean = false;
  receiveDate: Date;
  bsConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'YYYY-MM-DD',
    containerClass: 'theme-dark'
  };
  selectedSupplierName: string | null = null;
  selectedCustomerName: string | null = null;
  @Input() userTypeId: number;
  id: number;
activityId: any;
  imageUrl: string = '';
  base64Picture: string = '';
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
    public route: ActivatedRoute,
    private _layoutService: LayoutStoreService
  ) {
    super(injector);
    this.bsConfig = {
      dateInputFormat: 'YYYY-MM-DD', // Format to display only the date
    };
  }

  async ngOnInit() {

    this.id = Number.parseInt(this.route.snapshot.queryParams["packageId"]);

    if (this.id > 0) {

      await this.loadPackageTypes();
      this._packageSrvice.getById(this.id).subscribe(
        async (result: PackageDto) => {
          
          // Instantiate CreatePackageDto and initialize properties
          this.createPackageDto = new CreatePackageDto();
          this.senderType = (result.senderUserTypeId == 3)
            ? "Supplier"
            : (result.senderUserTypeId == 2)
              ? "Customer"
            : (result.senderUserTypeId == 0)
                ? "None"
            : result.senderUserTypeId;
            this.createPackageDto.senderId = this.senderType == "None" ? null : result.senderUserTypeId;
            this.selectedCustomerName = result.senderUserTypeId === 2 ? result.senderFullName : "";
            this.selectedSupplierName = result.senderUserTypeId === 3 ? result.senderFullName : "";
          
          this.createPackageDto.outerSenderFirstName = result.outerSenderFirstName;
          this.createPackageDto.outerSenderLastName = result.outerSenderLastName;
          this.createPackageDto.outerSenderEmail = result.outerSenderEmail;
          this.createPackageDto.outerSenderPhoneNumber = result.outerSenderPhoneNumber;
          this.createPackageDto.employeeId = result.employeeId;
          this.createPackageDto.packageTypeId = result.packageTypeId;
          this.createPackageDto.base64Picture = result.imageUrl;
          this.createPackageDto.senderId = result.senderId;
          this.createPackageDto.activityId = result.activityId;
          this.createPackageDto.packageReceiveDate = result.receiveDate  ? result.receiveDate.toISOString()  : null;
          this.createPackageDto.description = result.description;
          this.createPackageDto.activityNote = result.noteDescription;
          this.createPackageDto.activityTypeId = result.activityTypeId;
          this.createPackageDto.followUpTypeId = result.followUpTypeId
          this.createPackageDto.fllowUpEmployeeId = result.fllowUpEmployeeId
          this.createPackageDto.fllowUpGroupId = result.fllowUpGroupId;
          this.createPackageDto.packageReceiveDate = this._datePipe.transform(result.receiveDate, "yyyy-MM-dd") || ''; 
          this.createPackageDto.followUpDate = this._datePipe.transform(result.followUpDate, "yyyy-MM-dd") ? this._datePipe.transform(result.followUpDate, "yyyy-MM-dd") : this._datePipe.transform(Date.now(),"yyyy-MM-dd");
          this.createPackageDto.employeeId = result.employeeId ? result.employeeId : this.appSession.userId;
          this.isImageLoadFramDb = result.imageUrl ? true : false;
          if(this.createPackageDto.fllowUpEmployeeId !=null){
           this.employeeShow = true;
           this.groupshow = null;
          }
          if(this.createPackageDto.fllowUpGroupId !=null){
            this.groupshow = true;
            this.employeeShow = null
           }
          this.subPackages = [];
          result.subPackageDtos.forEach(element => {
            var sb = new CreateSubPackageDto();
            sb.contains = element.contains;
            sb.packageId = element.packageId;
            sb.id = element.id;
            sb.base64Picture = element.imageUrl;
            this.subPackages.push(sb);

          });
          
          this.receiveDate = result.receiveDate ? new Date(result.receiveDate) : new Date();  
        },
        (error) => {
          console.error('Error fetching package details:', error);
        }
      );
    } else {
      console.warn('Invalid package ID');
    }
    this._layoutService.updateHeaderTitle("Edit Receive Package");
    await this.loadSuppliers();
    await this.loadCustomers();
    await this.loadEmployees();
    await this.loadGroups();
    await this.GetActivityTypes();
    this.setFollowupType(false);
    
    this.receiveDate = this.receiveDate != null ? this.receiveDate : new Date();  // Ensure the current date is set on component initialization
    this.createPackageDto.packageReceiveDate = this._datePipe.transform(this.receiveDate, "yyyy-MM-dd"); // Format the date

    // this.createPackageDto.fllowUpGroupId = 0;
    // this.createPackageDto.fllowUpEmployeeId = 0;
  }
  onFocus(): void {
    if (!this.receiveDate) {
      this.receiveDate = new Date(); // Set today’s date if none is selected
    }
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
      this.createPackageDto.senderId = null;
    }
  }



  getPackageType(): string {

    return 'Standard'; // Just an example
  }

  // Function to set sender type based on user interaction
  setSenderType(type: string): void {
    // this.senderType = type;
  }

  // Function to check if it's Customer
  isCustomer(): boolean {
    return this.senderType === 'Customer';
  }

  isSupplier(): boolean {
    return this.senderType === 'Supplier';
  }

  onDateChange(date: Date): void {
    console.log(event);
  }


  onPackageTypeChange(id: number): void {
    const selectedPackage = this.packageTypes.find(
      (pkg) => pkg.id === Number(id)
    );

    if (selectedPackage) {
      this.senderType =
        selectedPackage.userTypeId === 2 ? "Customer" :
        selectedPackage.userTypeId === 3 ? "Supplier" :
        selectedPackage.userTypeId === 0 ? "None" : "";
      this.createPackageDto.senderId = this.senderType == "None" ? null : selectedPackage.userId;
      this.selectedCustomerName = selectedPackage.userTypeId === 2 ? selectedPackage.userFullName : "";
      this.selectedSupplierName = selectedPackage.userTypeId === 3 ? selectedPackage.userFullName : "";
      
      if(selectedPackage.userTypeId == 3){
       
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

  onFileUploadHandler(image: Base64Image): void {
  this.isImageLoadFramDb = false;
  this.createPackageDto.base64Picture =  image.ImageBase64String;
  }

  onFileUploadFSub(image: any, i: number): void {
    this.subPackages[i].base64Picture = image.ImageBase64String;
  }
  private async loadEmployees() {
    this.employees = (
      await this._userService.getFilteredUsers(UserTypes.Employee).toPromise()
    ).items;
  }
  private async loadGroups() {
    this.groups = (await this._groupService.getAll().toPromise()).items;
  }

  private async loadSuppliers() {
    this.suppliers = (await this._supplierService.getAll().toPromise()).items;
  }
  // private async loadCustomers() {
  //   this.customers = (await this._customerService.getAll().toPromise()).items;
  // }
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
  private async loadPackageTypes() {
    this.packageTypes = (
      await this._packageTypesSrvice.getAll().toPromise()
    ).items;
  }

  // onFollowUpTypeChange(event: Event): void {
  //   debugger;
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
    newSubPackage.contains = '';
    newSubPackage.base64Picture = '';
    newSubPackage.packageId = this.id;
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

   // this.createPackageDto.followUpDate = this._datePipe.transform(Date.now(),"yyyy-MM-dd");
  }

  save(): void {
    if (
      this.createPackageDto.senderId == undefined ||
      this.createPackageDto.senderId == null
    ) {
      this.UpdatePackageDto.senderId = null;
    }else{
      this.UpdatePackageDto.senderId = this.createPackageDto.senderId;
    }

    if (
      this.createPackageDto.fllowUpGroupId == undefined ||
      this.createPackageDto.fllowUpGroupId == null
    ) {
      this.UpdatePackageDto.fllowUpGroupId = null;
    }else{
      this.UpdatePackageDto.fllowUpGroupId = this.createPackageDto.fllowUpGroupId;
    }

    if (
      this.createPackageDto.fllowUpEmployeeId == undefined ||
      this.createPackageDto.fllowUpEmployeeId == null
    ) {
      this.UpdatePackageDto.fllowUpEmployeeId = null;
    }else{
      this.UpdatePackageDto.fllowUpEmployeeId = this.createPackageDto.fllowUpEmployeeId;
    }

    if (
      this.createPackageDto.followUpTypeId == undefined ||
      this.createPackageDto.followUpTypeId == null
    ) {
      this.UpdatePackageDto.followUpTypeId = null;
    }else{
      this.UpdatePackageDto.followUpTypeId = this.createPackageDto.followUpTypeId;
    }

    this.saving = true;
    this.changeDateFormat();
    this.UpdatePackageDto.createSubPackageDtos = [];
    
    this.UpdatePackageDto.createSubPackageDtos = this.subPackages;
    this.UpdatePackageDto.id = this.id;
    this.UpdatePackageDto.packageTypeId = this.createPackageDto.packageTypeId;
    this.UpdatePackageDto.packageReceiveDate = this.createPackageDto.packageReceiveDate;
    this.UpdatePackageDto.employeeId = this.createPackageDto.employeeId;
    this.UpdatePackageDto.base64Picture= this.createPackageDto.base64Picture;
    this.UpdatePackageDto.followUpTypeId = this.createPackageDto.followUpTypeId;
    this.UpdatePackageDto.fllowUpEmployeeId = this.createPackageDto.fllowUpEmployeeId;
    this.UpdatePackageDto.fllowUpGroupId = this.createPackageDto.fllowUpGroupId;
    this.UpdatePackageDto.description = this.createPackageDto.description;
    this.UpdatePackageDto.packageReceiveDate = this.createPackageDto.packageReceiveDate
    this.UpdatePackageDto.activityNote = this.createPackageDto.activityNote
    this.UpdatePackageDto.activityId = this.createPackageDto.activityId
    this.UpdatePackageDto.followUpDate = this.createPackageDto.followUpDate
    this.UpdatePackageDto.activityTypeId = this.createPackageDto.activityTypeId
    this.UpdatePackageDto.outerSenderFirstName = this.createPackageDto.outerSenderFirstName;
    this.UpdatePackageDto.outerSenderLastName = this.createPackageDto.outerSenderLastName;
    this.UpdatePackageDto.outerSenderPhoneNumber = this.createPackageDto.outerSenderPhoneNumber;
    this.UpdatePackageDto.outerSenderEmail = this.createPackageDto.outerSenderEmail;
     
    // Ensure required fields are provided
    if (!this.createPackageDto.packageReceiveDate) {
      this.notify.error(this.l("Package receive date is required"));
      this.saving = false;
      return;
    }

    // Set a default packageTypeId if not provided
    if (!this.createPackageDto.packageTypeId) {
      this.createPackageDto.packageTypeId = 0; // Default packageTypeId
    }

    // Proceed to update the package if validation passes
    if (this.createPackageDto) {
      this._packageSrvice.update(this.UpdatePackageDto).subscribe(
        () => {
          this.notify.info(this.l("Saved successfully"));
          this.router.navigate(['/app/package-receive']); // Redirect after successful save
        },
        (error) => {
          this.saving = false;
          this.notify.error(this.l("Save failed"));
          console.error('Save error:', error);
          if (error.response) {
            console.error('Error Response:', error.response); // Log API response details
          }
        }
      );
    } else {
      this.saving = false;
      this.notify.error(this.l("Invalid package data")); // Handle invalid data case
    }
  }


  selectedCustomerNameFunction(event){
    this.selectedCustomerName = event;
    this.createPackageDto.senderId = event;
    }
    selectedSupplierNameFunction(event){
      this.selectedSupplierName = event;
      this.createPackageDto.senderId = event;
    }

  onScrollToEnd(): void {
    this.customerPageNumber++;  // Increment page number
    this.loadCustomers();       // Load next page
  }



  back() {
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

}
