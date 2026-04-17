import { Component, Injector, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { CustomerDto, CustomerDtoPagedResultDto, CustomerServiceProxy, CustomerTypeDto, SubCustomerDto, SubCustomerDtoPagedResultDto, SubCustomerServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { finalize } from 'rxjs/operators';
import { EventService } from '@shared/service-custom/event.service';
import { EditSubCustomerComponent } from './edit-sub-customer/edit-sub-customer.component';
import { SubCustomerComponent } from './sub-customer/sub-customer.component';


class PagedCustomerRequestDto extends PagedRequestDto {
  keyword: string;
  customerNumber:string;
  telephone:string;
  name:string;
  emailAddress:string;
  serialNumber:string;
  parentId:number;
}

@Component({
  selector: 'app-sub-customers',
  templateUrl: './sub-customers.component.html',
  styleUrls: ['./sub-customers.component.css'],
  animations: [appModuleAnimation()],
})
export class SubCustomersComponent extends PagedListingComponentBase<CustomerDto> implements OnInit {
  @Input('customerId') customerId:number;
  keyword = ''
  customerTypeId:number;
  isActive: boolean | null
  advancedFiltersVisible = false
  customers: CustomerDto[];
  customerTypes:CustomerTypeDto[]=[];
  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _customerService:CustomerServiceProxy,
    private _eventService:EventService
  ) {
    super(injector)
  }

  async ngOnInit() {

    this.refresh();
    this._eventService.getEvent("RefreshData").subscribe(res=>{
      this.refresh();
    });
    const customerTypes=(await this._customerService.getCustomerTypes().toPromise()).items;
    customerTypes.forEach(type=>{
      if(type.type!=='Customer'){
       this.customerTypes.push(type);
      }
    })
  }



  clearFilters(): void {
    this.keyword = '';
    this.isActive = undefined
    this.getDataPage(1)

  }

  protected list(
    request: PagedCustomerRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    request.keyword = this.keyword;
    request.parentId=this.customerId;
    
    this._customerService
      .getPagedResult(
        request.keyword,
        false,
        undefined,
        request.customerNumber,
        request.name,
        request.emailAddress,
        request.telephone,
        request.serialNumber,
        request.parentId,
        this.customerTypeId,
        undefined,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback()
        }),
      )
      .subscribe((result: CustomerDtoPagedResultDto) => {
        this.customers = result.items
        this.showPaging(result, pageNumber)
      })
  }
  protected delete(subCustomer: CustomerDto): void {
    abp.message.confirm(
      this.l('UserDeleteWarningMessage', subCustomer.name),
      undefined,
      (result: boolean) => {
        if (result) {
          this._customerService.delete(subCustomer.userId).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'))
            this.refresh()
          })
        }
      },
    )
  }

  public showEditSubCustomerDialog(customer:CustomerDto): void {
    let editSubCustomerDialog: BsModalRef

    editSubCustomerDialog = this._modalService.show(
      EditSubCustomerComponent,
      {
        class: 'modal-lg',
        initialState: {
          id: customer.userId,
          customerId:customer.parentId,
        },
      },
    )
    editSubCustomerDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }

    public showCreateOrEditDialog(): void {
    let createSubCustomerDialog: BsModalRef;

    createSubCustomerDialog = this._modalService.show(SubCustomerComponent, {
      class: "modal-lg",
      initialState: {
        customerId: this.customerId,
      },
    });
    this._eventService.emitEvent("RefreshData", null);
  }
}
