import { ActivatedRoute, Router } from '@angular/router';
import { FaultStatuses } from './../../shared/AppConsts';
import { state } from '@angular/animations';
import { finalize } from 'rxjs/operators';
import { FaultDtoPagedResultDto, FaultServiceProxy, SupplierServiceProxy, UpdateFaultStatusDto } from './../../shared/service-proxies/service-proxies';
import { Component, Injector, Input, OnInit } from '@angular/core';
import { EntityDto, PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { FaultDto } from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppSessionService } from '@shared/session/app-session.service';

class PagedFaultRequestDto extends PagedRequestDto {
  invoiceLineId: number;
  customerId: number;
}

@Component({
  selector: 'app-faults',
  templateUrl: './faults.component.html',
  styleUrls: ['./faults.component.css'],
  animations: [appModuleAnimation()],
})
export class FaultsComponent extends PagedListingComponentBase<FaultDto> implements OnInit {
  @Input() customerId: number;
  @Input() isDisplayCloseFaultButton = true;
  invoiceLineId: number;
  advancedFiltersVisible = false;
  title = 'Faults';
  faults: FaultDto[] = [];
  productItemId: number;
  supplierId:number;
  responsibleEmployee:number;
  constructor(
    injector: Injector,
    private _faultService: FaultServiceProxy,
    private router: Router,
    private rout: ActivatedRoute,
    private _sessionService:AppSessionService,
    private _supplierService:SupplierServiceProxy
  ) {
    super(injector);
   
    let productItemString = this.rout.snapshot.queryParamMap.get('productItemId');
    if (productItemString)
      this.productItemId = Number.parseInt(productItemString);
  // this.responsibleEmployee=this.appSession.userId;
  }
  async ngOnInit() {
    if(this._sessionService?.user?.userTypeId===3){
      let supplierId=await this._supplierService.getSupplierIdFromUserId(this._sessionService.user.id).toPromise();
       this.supplierId=supplierId.id;
       this.responsibleEmployee=undefined;
    }
    this.getDataPage(1);
  }

  clearFilters(): void {
    this.getDataPage(1);
  }

  protected list(
    request: PagedFaultRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.invoiceLineId = this.invoiceLineId;
    request.customerId = this.customerId;
    this._faultService
      .getPagedResult(
        undefined,
        this.responsibleEmployee,
        this.productItemId,
        this.supplierId,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: FaultDtoPagedResultDto) => {
        this.faults = result.items;
        this.showPaging(result, pageNumber);
      });
  }
  protected delete(fault: FaultDto): void {
    abp.message.confirm(
      this.l('UserDeleteWarningMessage'),
      undefined,
      (result: boolean) => {
        if (result) {

        }
      }
    );
  }

  async closeFault(fault: FaultDto) {
    let updateFaultStatus = this.getUpdateFaultStatusInputDto(fault);
    try {
      await this._faultService.updateFaultStatus(updateFaultStatus).toPromise();
      this.refresh();
    }
    catch (error) {
      this.notify.error(error);
    }
  }

  private getUpdateFaultStatusInputDto(fault: FaultDto) {
    let updateFaultStatus = new UpdateFaultStatusDto();
    updateFaultStatus.id = fault.id;
    updateFaultStatus.faultStatus = FaultStatuses.Close;
    return updateFaultStatus;
  }

  isAlreadyResolved(fault: FaultDto) {
    return fault.status === FaultStatuses.Close.toString();
  }
  viewDetail(fault: FaultDto): void {
    this.router.navigate(['app/fault-detail'], { queryParams: { faultId: fault.id } });
  }
}
