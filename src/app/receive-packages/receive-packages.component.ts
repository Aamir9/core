import { Customer } from './../../shared/service-proxies/service-proxies';
import { Component, Injector, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PackageDto, PackageServiceProxy, PackageTypeDto, PackageTypeServiceProxy } from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { finalize } from 'rxjs/internal/operators/finalize';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Router } from '@angular/router';
import { LayoutStoreService } from '@shared/layout/layout-store.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { AppConsts, UserTypes } from '@shared/AppConsts';
import { CreateReceivePackageComponent } from './create-receive-package/create-receive-package.component';


class PagedPackageRequestDto extends PagedRequestDto {
  keyword: string;
  packageTypeId:number | undefined;
  receiveDate:string;
  UserTypeId:number | undefined;
}
@Component({
  selector: 'app-receive-packages',
  templateUrl: './receive-packages.component.html',
  styleUrls: ['./receive-packages.component.css'],
  animations: [appModuleAnimation()]
})
export class ReceivePackagesComponent extends PagedListingComponentBase<PackageDto> implements OnInit {

  keyword: string = '';
  packages: PackageDto[] = [];
  selectedPackageTypeId: number | null = null;
  selectedReceiveDate: string;
  selectedToDate: string;
  selectedFromDate: string;
  userTypeName="";
  packageTypes  : PackageTypeDto[]= [];

  bsConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'YYYY-MM-DD',
    containerClass: 'theme-dark'
  };

  constructor(
    injector: Injector,
    private router: Router,
    private _packageService: PackageServiceProxy,
    private _packageTypeService: PackageTypeServiceProxy,
    private _modalService: BsModalService,
    private readonly _layoutService: LayoutStoreService
  ) {
    super(injector);
    this.bsConfig = {
      dateInputFormat: 'YYYY-MM-DD', // Format to display only the date
    };
  }

  ngOnInit(): void {
    this._layoutService.updateHeaderTitle("Packages Received");
    this.refresh();

    this._packageTypeService.getAll().subscribe((res)=>{
    this.packageTypes = res.items;
    });
  }

  protected list(
    request: PagedPackageRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {

    let userTypeId = 0;
    if(this.userTypeName == UserTypes.Customer){
      userTypeId = 2;
    }

    if(this.userTypeName == UserTypes.Supplier){
      userTypeId = 3;
    }

    let packgeTypeId = 0;
    if(this.selectedPackageTypeId){
      packgeTypeId = this.selectedPackageTypeId ;
    }

    request.keyword = '';
    this._packageService.getPagedResult(
      this.keyword,
      packgeTypeId,
      this.selectedReceiveDate,
      userTypeId,
      this.selectedToDate,
      this.selectedFromDate,
      request.skipCount,
      request.maxResultCount,
    )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: any) => {
        this.packages = result.items;
        this.showPaging(result, pageNumber);
      });
  }
  clearFilters(): void {
    this.keyword = "";
    this.getDataPage(1);
  }

  refresh(): void {
    this.getDataPage(this.pageNumber);
  }

  protected delete(input: PackageDto): void {
    abp.message.confirm(
      this.l('UserDeleteWarningMessage', input.id),
      undefined,
      (result: boolean) => {
        if (result) {
          this._packageService.delete(input.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }



  public showCreateOrEditGroupDialog(): void {

    let createOrEditUserDialog: BsModalRef;
      createOrEditUserDialog = this._modalService.show(
        CreateReceivePackageComponent,
        {
          class: 'customer-modal-lg',
        }
      );
    createOrEditUserDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }


  toggleSubList(item: PackageDto) {
    item.isOpenSubList = !item.isOpenSubList;
  }

  collapseAll() {
    this.packages.forEach((item) => {
      item.isOpenSubList = false;
    });
  }



  expandAll() {
    this.packages.forEach((item) => {
      item.isOpenSubList = true;
    });
  }

  userType(val:number){
    if(val == 2){

      return "Customer"
    }
    if(val == 3){
      return "Supplier";
    }
  }

  createPackage(){
    this.router.navigate(['/app/create-package']);
  }
  searchPackageType(): void {
    if (this.selectedPackageTypeId) {
      // Filter the packages based on the selected package type ID
      const filteredPackages = this.packages.filter(packageItem => packageItem.packageTypeId === this.selectedPackageTypeId);

      if (filteredPackages.length > 0) {
        console.log("Filtered Packages:", filteredPackages);
        // Display the details of the filtered packages
        this.packages = filteredPackages;
      } else {
        console.log("No packages found for the selected package type.");
        // Handle the case where no packages match the selected type
        this.packages = []; // Clear the packages if none match
      }
    } else {
      console.log("No Package Type selected.");
      // If no package type is selected, refresh the package list to show all packages
      this.refresh(); // Assuming refresh() reloads all packages
    }
  }
  searchByReceiveDate(): void {
    if (this.selectedReceiveDate) {
      // Filter the packages based on the selected receive date
      const filteredPackages = this.packages.filter(packageItem =>
        new Date(packageItem.receiveDate).toDateString() === new Date(this.selectedReceiveDate).toDateString()
      );

      if (filteredPackages.length > 0) {
        console.log("Filtered Packages:", filteredPackages);
        // Display the details of the filtered packages
        this.packages = filteredPackages;
      } else {
        console.log("No packages found for the selected receive date.");
        // Handle the case where no packages match the selected date
        this.packages = []; // Clear the packages if none match
      }
    } else {
      console.log("No Receive Date selected.");
      // If no receive date is selected, refresh the package list to show all packages
      this.refresh(); // Assuming refresh() reloads all packages
    }
  }
  searchByFromDate(): void {
    if (this.selectedReceiveDate) {
      // Filter the packages based on the selected receive date
      const filteredPackages = this.packages.filter(packageItem =>
        new Date(packageItem.receiveDate).toDateString() === new Date(this.selectedReceiveDate).toDateString()
      );

      if (filteredPackages.length > 0) {
        console.log("Filtered Packages:", filteredPackages);
        // Display the details of the filtered packages
        this.packages = filteredPackages;
      } else {
        console.log("No packages found for the selected receive date.");
        // Handle the case where no packages match the selected date
        this.packages = []; // Clear the packages if none match
      }
    } else {
      console.log("No Receive Date selected.");
      // If no receive date is selected, refresh the package list to show all packages
      this.refresh(); // Assuming refresh() reloads all packages
    }
  } 
  
   searchByToDate(): void {
    if (this.selectedReceiveDate) {
      // Filter the packages based on the selected receive date
      const filteredPackages = this.packages.filter(packageItem =>
        new Date(packageItem.receiveDate).toDateString() === new Date(this.selectedReceiveDate).toDateString()
      );

      if (filteredPackages.length > 0) {
        console.log("Filtered Packages:", filteredPackages);
        // Display the details of the filtered packages
        this.packages = filteredPackages;
      } else {
        console.log("No packages found for the selected receive date.");
        // Handle the case where no packages match the selected date
        this.packages = []; // Clear the packages if none match
      }
    } else {
      console.log("No Receive Date selected.");
      // If no receive date is selected, refresh the package list to show all packages
      this.refresh(); // Assuming refresh() reloads all packages
    }
  }


  
  onPackageTypeChange(selectedValue: number | null) {

    if (selectedValue === null) {
      this.clearPackageType();
      this.getDataPage(1); // Call the API method
    } else {
      // If a valid selection is made, just call the API
      this.getDataPage(1);
    }
  }


  // Method to clear the selection
  clearPackageType() {
    this.selectedPackageTypeId = null;
     // Reset the selected value
    this.getDataPage(1);
  }

  
}
