import { Component, Injector, Input, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { SupplierDto, SupplierListDto, SupplierServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CreateSupplierComponent } from './create-supplier/create-supplier.component';
import { EditSupplierComponent } from './edit-supplier/edit-supplier.component';
import { Router } from '@angular/router';
import { LayoutStoreService } from '@shared/layout/layout-store.service';


class PagedSupplierRequestDto extends PagedRequestDto {
  keyword: string;
}
@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css'],
  animations: [appModuleAnimation()]
})
export class SuppliersComponent extends PagedListingComponentBase<SupplierListDto>   implements OnInit {
 
  @Input() userId: number;
  suppilers :SupplierListDto[] =[];
  
  keyword: string="";
  constructor(
    private _supplierService :SupplierServiceProxy,
    private _modalService: BsModalService,
    private router: Router,
    private _appSessionService: AppSessionService,
    injector: Injector,
    private readonly _layoutService: LayoutStoreService
    ) { 
      super(injector);
    }

    ngOnInit(): void {
      this._layoutService.updateHeaderTitle("Suppliers");
      this.getDataPage(1);


    }

    protected list(
      request: PagedSupplierRequestDto,
      pageNumber: number,
      finishedCallback: Function
    ): void {
      request.keyword = this.keyword;
      this._supplierService.getPagedResult(
        request.keyword,
        request.skipCount,
        request.maxResultCount
      )
        .pipe(
          finalize(() => {
            finishedCallback();
          })
        )
        .subscribe((result:any) => {
          this.suppilers = result.items;
          this.showPaging(result, pageNumber);
        });
    }
  
    refresh(): void {
      this.getDataPage(this.pageNumber);
    }
 
    protected delete(model: SupplierListDto): void {
      abp.message.confirm(
        this.l('UserDeleteWarningMessage', model.name),
        undefined,
        (result: boolean) => {
          if (result) {
            this._supplierService.delete(model.id).subscribe(() => {
              abp.notify.success(this.l('SuccessfullyDeleted'));
              this.refresh();
            });
          }
        }
      );
    }
  
    public showCreateOrEditGroupDialog(id?: number): void {
      let createOrEditUserDialog: BsModalRef;
      if (!id) {
        createOrEditUserDialog = this._modalService.show(
          CreateSupplierComponent,
          {
            class: 'modal-lg',
          }
        );
      } else {
        createOrEditUserDialog = this._modalService.show(
          EditSupplierComponent,
          {
            class: 'modal-lg',
            initialState: {
              id: id,
            },
          }
        );
      }
  
      createOrEditUserDialog.content.onSave.subscribe(() => {
        this.refresh();
      });
    }
  

  
    isAdminUser(): boolean {
      return this._appSessionService.isAdminUser();
     }
     SupplierDetails(supplier: SupplierDto) {
      this.router.navigate(["app/suppiler-details/"+supplier.id], {
        queryParams: { userId: supplier.userId },
      });
    }
}
