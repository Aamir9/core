import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { ViewMode } from '@app/activities/create-activity/create-activity.component';
import { ActivatedRoute } from '@node_modules/@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, of, Subject } from '@node_modules/rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from '@node_modules/rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivityDto, ActivityServiceProxy, CreatePackageTypeDto, CustomerDto, CustomerListDto, CustomerServiceProxy, Int32LookUpDto, PackageTypeDto, PackageTypeServiceProxy, SupplierListDto, SupplierServiceProxy, UpdatePackageDto, UpdatePackageTypeDto } from '@shared/service-proxies/service-proxies';
import { th } from 'date-fns/locale';

@Component({
  selector: 'app-update-package-type',
  templateUrl: './update-package-type.component.html',
  styleUrls: ['./update-package-type.component.css']
})
export class UpdatePackageTypeComponent extends  AppComponentBase implements OnInit {
 @Output() onSave = new EventEmitter<any>();
  @Input() customerUserId: any;
  saving = false;
  keyword: string = "";
  activity = new ActivityDto();
  packageTypeDto: CreatePackageTypeDto = new CreatePackageTypeDto();
  updatePackageTypeDto: UpdatePackageTypeDto = new UpdatePackageTypeDto()
  customers: CustomerListDto[] = [];
  subCustomers: CustomerDto[] = [];
  activityTypes: Int32LookUpDto[] = [];
  suppliers: SupplierListDto[] = [];
  selectedCustomer: CustomerDto = new CustomerDto();
  customerId: number;
  activityTypeId: number;
  onlyShowOpen: boolean = false;
  senderType: any | null = null;
  viewMode: ViewMode;
  FollowTypes: any;
  customerSearchTerm: string = '';
  customerPageNumber: number = 1;
  customerPageSize: number = 20;
  totalCustomerCount: number;
  loadingCustomers: boolean = false;
  customerSearch$: Subject<string> = new Subject<string>();
  packageId!: number;
  selectedSupplierName: any | null = null;
  selectedCustomerName: any | null = null;
  constructor(
        injector: Injector,
        private _customerService: CustomerServiceProxy,
        private  _packageTypesSrvice:PackageTypeServiceProxy,
        private _modalService: BsModalService,
        private _supplierService: SupplierServiceProxy,
        private _activityService: ActivityServiceProxy,
        public bsModalRef: BsModalRef,
        private route: ActivatedRoute,
        private _route: ActivatedRoute
  ) {
    super(injector);
   }
 // Trigger loading more customers on scroll to end
    onScrollToEnd(): void {
     this.customerPageNumber++;  // Increment page number
     this.loadCustomers();       // Load next page
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
 // Method to load customers with pagination and lazy loading
 private async loadCustomers(): Promise<void> {
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
 }
 
 onCustomerSearchChange(event: any): void {
 
   const term = event.target.value;
   // Reset term and reload customers
   this.customerSearchTerm = term;
   this.customerPageNumber = 1;
 
   if (term) {
     this.customerSearch$.next(term);   // Trigger search through the observable
   } else {
     this.loadCustomers();  // Load default customer list if search term is cleared
   }
 }
 
 async ngOnInit() {
  if (this.packageId > 0) {
    try {
      // Fetch the package type data
      const result = await this._packageTypesSrvice.get(this.packageId).toPromise();
      if (result) {
        this.senderType = (result.senderTypeId == 3)
        ? "Supplier"
        : (result.senderTypeId == 2)
          ? "Customer"
        : (result.senderTypeId == 0 || null)
            ? "None"
        : result.senderTypeId;
        this.selectedCustomerName = result.senderTypeId === 2 ? result.userId : "";
        this.selectedSupplierName = result.senderTypeId === 3 ? result.userId : "";
        this.packageTypeDto.senderTypeId = result.senderTypeId;
        this.packageTypeDto.name = result.name;
        this.packageTypeDto.followUpTypeId = result.followUpTypeId == 0 ? null : result.followUpTypeId;
        this.packageTypeDto.userId = result.userId;
        
        await this.loadSuppliers();
        await this.GetActivityTypes();

        // Initialize the customer search observable
        this.customerSearch$.pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(term => this.searchCustomers(term))
        ).subscribe(customers => {
          if (customers) {
            this.customers = customers.items; 
          } else {
            this.loadCustomers();
          }
          this.customerPageNumber = 1;
        });

        // Load customers
        await this.loadCustomers();
      } else {
        console.error("Failed to fetch package type data.");
      }
    } catch (error) {
      console.error("Error loading package type data:", error);
    }
  } else {
    console.log("Package Type is invalid.");
  }
}

 
   private async loadSuppliers() {
     this.suppliers = (await this._supplierService.getAll().toPromise()).items;
   }
 
   private async GetActivityTypes() {
    console.log("Loading FollowTypes...");
    try {
      const result = await this._activityService.getAllActivityTypes().toPromise();
      this.FollowTypes = result.items;
      console.log("FollowTypes loaded:", this.FollowTypes);
    } catch (error) {
      console.error("Error fetching FollowTypes:", error);
    }
  }
 
   isEditMode() {
     return this.viewMode == ViewMode.Edit;
   }

   deSelectfollowUpType(event:any){
    if (!event || event == undefined) {
      this.packageTypeDto.followUpTypeId = null;
    }
   }


   onSenderTypeChange() { 
    if (this.senderType == 'Supplier') {
      this.packageTypeDto.senderTypeId = 3;  
      this.selectedSupplierName = this.selectedSupplierName ? this.selectedSupplierName : this.suppliers[0].name;
      this.packageTypeDto.userId = this.suppliers[0].supplierUserId
    } else if (this.senderType == 'Customer') {     
      this.packageTypeDto.senderTypeId = 2; 
      this.selectedCustomerName = this.selectedCustomerName ? this.selectedCustomerName : this.customers[0].name;
      this.packageTypeDto.userId = this.customers[0].customerUserId
    }
    else if (this.senderType == 'None') {
      this.packageTypeDto.senderTypeId = 0; 
      this.packageTypeDto.userId = null;
      this.selectedSupplierName = null;
      this.selectedCustomerName = null;
    }
  }

   save(): void {
     if (
       this.packageTypeDto.senderTypeId == undefined ||
       this.packageTypeDto.senderTypeId == null
     ) {
       this.packageTypeDto.senderTypeId = null;
     }
    console.log("update the final call.",this.packageTypeDto)
     this.saving = true;
     this.updatePackageTypeDto.id = this.packageId;
     this.updatePackageTypeDto.followUpTypeId = this.packageTypeDto.followUpTypeId == null ? 0 : this.packageTypeDto.followUpTypeId;
     this.updatePackageTypeDto.name = this.packageTypeDto.name;
     this.updatePackageTypeDto.faultId = 0;
     this.updatePackageTypeDto.senderTypeId = this.packageTypeDto.senderTypeId
     this.updatePackageTypeDto.userId = this.packageTypeDto.userId;
     this._packageTypesSrvice.update(this.updatePackageTypeDto).subscribe(
        () => {
       this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit();
      },
       () => {
         this.saving = false;
        }
      );
   }
   selectedCustomerNameFunction(event){
    this.selectedCustomerName = event;
    this.packageTypeDto.userId = event;
    }
    selectedSupplierNameFunction(event){
      this.selectedSupplierName = event;
      this.packageTypeDto.userId = event;
    }

}
