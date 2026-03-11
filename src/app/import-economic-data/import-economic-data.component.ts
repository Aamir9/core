import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { EconomicSyncHistoryDto, SyncEconomicDataServiceProxy, SyncHistoryDetailDto } from '@shared/service-proxies/service-proxies';
import { NotifyService } from 'abp-ng2-module';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AddEconomicGrantsComponent } from './add-economic-grants/add-economic-grants.component';
import { Router } from '@node_modules/@angular/router';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { finalize } from '@node_modules/rxjs/operators';

@Component({
  selector: 'app-import-economic-data',
  templateUrl: './import-economic-data.component.html',
  styleUrls: ['./import-economic-data.component.css'],
  animations: [appModuleAnimation()]
})
export class ImportEconomicDataComponent extends PagedListingComponentBase<EconomicSyncHistoryDto> implements OnInit {
  isConnected: boolean = false;
  SyncHistory: EconomicSyncHistoryDto[] = [];
  syncHistoryDetails: SyncHistoryDetailDto[] = [];
  isSyncing = false;

  constructor(
    private syncEconomicDataService: SyncEconomicDataServiceProxy,
    private _modalService: BsModalService,
    private router:Router,
    public notify: NotifyService,
     injector: Injector,
  ) { 
    super(injector);
  }

  async ngOnInit() {
    this.isConnected = await this.syncEconomicDataService.isUserHasEconomicGrants().toPromise();
    // if (this.isConnected) {
    //   this.getSyncHistory();

    //   setInterval(() => {
    //     this.getSyncHistory();
    //   }, 20000);
    // } else {
    //   this.notify.warn("You don't have any sync api grants");
    // }
    
    if (this.isConnected) {
      this.getDataPage(1);
    } else {
      this.notify.warn("You don't have any sync api grants");
    }
  }
  protected list(
      request: PagedRequestDto,
      pageNumber: number,
      finishedCallback: Function
    ): void {
      
      this.syncEconomicDataService
        .getPagedResult(
          request.maxResultCount,
          request.skipCount
        )
        .pipe(
          finalize(() => {
            finishedCallback();
          })
        )
        .subscribe((result: any) => {
          this.SyncHistory = result.items;
          this.showPaging(result, pageNumber);
        });
    }
  
    refresh(): void {
      this.getDataPage(this.pageNumber);
    }

     protected delete(model: EconomicSyncHistoryDto): void {
        abp.message.confirm(
          this.l("UserDeleteWarningMessage", ""),
          undefined,
          (result: boolean) => {
            if (result) {
              // this._product.delete(model.id).subscribe(() => {
              //   abp.notify.success(this.l("SuccessfullyDeleted"));
              //   this.refresh();
              // });
            }
          }
        );
      }
  
  startSync() {
    this.isSyncing = true;
    this.syncEconomicDataService.initializeSync().subscribe(result => {
      console.log(result);
      this.isSyncing = false;
    });
  }
  getSyncHistory() {
    this.syncEconomicDataService.getSyncHistory().subscribe(result => {
      this.SyncHistory = result;
    });
  }
  openGrantDialog() {
    const modal = this._modalService.show(AddEconomicGrantsComponent);
    modal.content.onSave.subscribe(() => {
      this.ngOnInit();
    })
  }

  viewDetail(id:number){
   this.router.navigate(["/app/import-detail/" + id]);
    //  const url = this.router.serializeUrl(
    //   this.router.createUrlTree([`/app/import-detail/${id}`])
    //   );

    //   window.open(url, '_blank');
  }
}
