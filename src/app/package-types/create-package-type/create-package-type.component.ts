import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewMode } from '@app/activities/create-activity/create-activity.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { ActivityDto, ActivityServiceProxy, CreatePackageDto, CreatePackageTypeDto, CustomerDto, CustomerListDto, CustomerServiceProxy, Int32LookUpDto, PackageTypeDto, PackageTypeServiceProxy, SupplierListDto, SupplierServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';



@Component({
  selector: 'app-create-package-type',
  templateUrl: './create-package-type.component.html',
  styleUrls: ['./create-package-type.component.css'],
  animations: [appModuleAnimation()]

})
export class CreatePackageTypeComponent extends  AppComponentBase implements OnInit {
  @Output() onSave = new EventEmitter<any>();
  @Input() customerUserId: any;
  saving = false;
  keyword: string = "";
  activity = new ActivityDto();
  packageTypeDto: CreatePackageTypeDto = new CreatePackageTypeDto();
  customers: CustomerListDto[] = [];
  subCustomers: CustomerDto[] = [];
  activityTypes: Int32LookUpDto[] = [];
  suppliers: SupplierListDto[] = [];
  selectedCustomer: CustomerDto = new CustomerDto();
  customerId: number;
  senderTypeId : any = 'None';
  activityTypeId: number;
  onlyShowOpen: boolean = false;
  showInput: boolean | null = null;
  viewMode: ViewMode;
  FollowTypes: any;
  customerSearchTerm: string = '';
  customerPageNumber: number = 1;
  customerPageSize: number = 20;
  totalCustomerCount: number;
  loadingCustomers: boolean = false;
  customerSearch$: Subject<string> = new Subject<string>();
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

  async ngOnInit(){
    await this.loadSuppliers();
    await this.GetActivityTypes();
    this.setSender(null);

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

  private async loadSuppliers() {
    this.suppliers = (await this._supplierService.getAll().toPromise()).items;
  }

  private async GetActivityTypes() {

    this._activityService.getAllActivityTypes().subscribe((result) => {
      this.activityTypes = result.items;
      this.FollowTypes = result.items;
    });
  }


  setSender(val) {
    this.showInput = val;
    if (val === null) {
      this.packageTypeDto.userId = null; // Clear userId when None is selected
    }
  }
  isEditMode() {
    return this.viewMode == ViewMode.Edit;
  }

  onSenderTypeChange() { 
    if (this.senderTypeId == 'Supplier') {
      this.packageTypeDto.senderTypeId = 3;  
    } else if (this.senderTypeId === 'Customer') {     
      this.packageTypeDto.senderTypeId = 2; 
    }
    else if (this.senderTypeId === 'None') {
      this.packageTypeDto.senderTypeId = null;
      // this.selectedSupplierName = null; 
      // this.selectedCustomerName = null; 
    }
  }

  save(): void {
    this.saving = true;
    this.packageTypeDto.faultId = 0;
    debugger;
    this._packageTypesSrvice.create(this.packageTypeDto).subscribe(
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

}
