import {Component,ChangeDetectionStrategy,Injector,OnInit, EventEmitter, Output, Input} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivityServiceProxy, CreateInvoiceDto, CreateOrderDto, CreatePackageDto, CreatePackageTypeDto, CustomerDto, CustomerListDto, CustomerServiceProxy, CustomFieldServiceProxy, Int32LookUpDto, InvoiceLineDto, InvoiceServiceProxy, OrderLineListDto, OrderServiceProxy, PackageServiceProxy, ProductDto, ProductGroupServiceProxy, ProductServiceProxy, SupplierListDto, SupplierServiceProxy, UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Screen, UserTypes } from "@shared/AppConsts";
import { DatePipe } from '@angular/common';
import { DateHelper } from '@shared/helpers/DateHelper';
import { EventService } from '@shared/service-custom/event.service';

import { platformBrowser } from '@angular/platform-browser'
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ViewMode } from '@app/activities/create-activity/create-activity.component';
import { AbpValidationError } from '@shared/components/validation/abp-validation.api';
import { PagedRequestDto } from '@shared/paged-listing-component-base';
class PagedPackageRequestDto extends PagedRequestDto {
  keyword: string;
  customerId: number | undefined;
}
  @Component({
    selector: 'app-package-recive',
templateUrl: './package-recive.html',
  animations: [appModuleAnimation()]
  })
  export class PackageReciveComponent extends AppComponentBase implements OnInit {
    @Output() onSave = new EventEmitter<any>();
    saving = false;
    @Input() customerUserId: any;
    customers: CustomerListDto[] = [];
    suppliers: SupplierListDto[] = [];
    employees: UserDto[] = [];
    CreatePackageDto: CreatePackageDto = new CreatePackageDto();
    onlyShowOpen: boolean = false;
    showInput: boolean = true;
    FollowTypes: any;
    activityTypes: Int32LookUpDto[] = [];
    today: string = new Date().toISOString().split('T')[0]; 
    order = new CreateOrderDto(); 
    viewMode: ViewMode;
assignedTo: any;
selectedEmployees: UserDto[] = [];
  
    constructor(
      private  _packageSrvice:PackageServiceProxy,
      private _activityService: ActivityServiceProxy,
      private _customerService: CustomerServiceProxy,
      private _supplierService: SupplierServiceProxy,
      private _userService: UserServiceProxy,
      public bsModalRef: BsModalRef,
      injector: Injector,
      
      private _route: ActivatedRoute
      ) {
        super(injector);
       
    }
  
   async ngOnInit(): Promise<void> {
    await this.loadEmployees();
    await this.loadSuppliers();
    await this.GetActivityTypes();
    this.setSender(false); 
    this.setFollowupType(false);
    
    }
 
   
    
    private async loadSuppliers() {
      this.suppliers = (await this._supplierService.getAll().toPromise()).items;
    }
  
      private async loadCustomers() {
        this.customers = (await this._customerService.getAll().toPromise()).items;
    }
  //#region private Methods
  private async loadEmployees() {
    this.employees = (await this._userService.getFilteredUsers(UserTypes.Employee).toPromise()).items;
    console.log('Employees loaded:', this.employees);
  }
  
  onEmployeeChange(employeeId: number) {
    const alreadyExists = this.selectedEmployees.find(
      (e) => e.id == employeeId
    );
    if (alreadyExists) return;
    this.selectedEmployees.push(this.employees.find((e) => e.id == employeeId));
  }
  private async GetActivityTypes() {

    this._activityService.getAllActivityTypes().subscribe((result) => {
      this.activityTypes = result.items;
      this.FollowTypes = result.items;
    });
  }
  setSender(val) {
    this.showInput = val;
  }
  isEditMode() {
    return this.viewMode == ViewMode.Edit;
  }
  setFollowupType(val) {
    this.showInput = val;
  }
  save(): void {
    this.saving = true;
    // this.invoice.invoiceNo='12';
    this.saving = true;
    
   
      
    this._packageSrvice.create(this.CreatePackageDto).subscribe(
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
   delete(arg0: any) {
throw new Error('Method not implemented.');
}
addSubPackage() {
throw new Error('Method not implemented.');
}
 
}
  
 
  
  
  