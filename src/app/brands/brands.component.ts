import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { BrandDto,BrandServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CreateBrandComponent } from './create-brand/create-brand.component';
import { EditBrandComponent } from './edit-brand/edit-brand.component';
import { LayoutStoreService } from '@shared/layout/layout-store.service';


class PagedCagegoriesRequestDto extends PagedRequestDto {
  keyword: string;
}

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css'],
  animations: [appModuleAnimation()]
})
export class BrandsComponent extends PagedListingComponentBase<BrandDto> implements OnInit {
  keyword: string = "";
  brands:BrandDto[] = [];

  constructor(
    injector: Injector,
    private  _brandService:BrandServiceProxy,
    private _modalService: BsModalService,
    private readonly _layoutService: LayoutStoreService
  ) { 
    super(injector);
  }


  ngOnInit(): void {
    this.getDataPage(1);
    this._layoutService.updateHeaderTitle("Brands");
  }

  
  protected list(
    request: PagedCagegoriesRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    this._brandService.getPagedResult(
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
        this.brands = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  refresh(): void {
    this.getDataPage(this.pageNumber);
  }

  protected delete(brand: BrandDto): void {

    abp.message.confirm(
      this.l('UserDeleteWarningMessage', brand.name),
      undefined,
      (result: boolean) => {
        if (result) {
          this._brandService.delete(brand.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }

  public showCreateOrEditDialog(id?: number): void {
    let createOrEditUserDialog: BsModalRef;
    if (!id) {
      createOrEditUserDialog = this._modalService.show(
        CreateBrandComponent,
        {
          class: 'modal-sm',
        }
      );
    } else {
      createOrEditUserDialog = this._modalService.show(
        EditBrandComponent,
        {
          class: 'modal-sm',
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

}
