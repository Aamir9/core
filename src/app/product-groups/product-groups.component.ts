import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { ProductGroupDto, ProductGroupServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CreateProductGroupComponent } from './create-product-group/create-product-group.component';
import { EditProductGroupComponent } from './edit-product-group/edit-product-group.component';


class PagedProdutGroupRequestDto extends PagedRequestDto {
  keyword: string;
}
@Component({
  selector: 'app-product-groups',
  templateUrl: './product-groups.component.html',
  styleUrls: ['./product-groups.component.css'],
  animations: [appModuleAnimation()]
})
export class ProductGroupsComponent extends PagedListingComponentBase<ProductGroupDto>   implements OnInit {
 
 
  productGroups :ProductGroupDto[] =[];
  keyword: string="";
  constructor(
    private _productGroup :ProductGroupServiceProxy,
    private _modalService: BsModalService,
    private router: Router,
    private _appSessionService: AppSessionService,
    injector: Injector,
    ) { 
      super(injector);
    }

    ngOnInit(): void {
      this.getDataPage(1);
    }

    protected list(
      request: PagedProdutGroupRequestDto,
      pageNumber: number,
      finishedCallback: Function
    ): void {
      request.keyword = this.keyword;
      this._productGroup.getPagedResult(
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
          console.log("result.items",result.items);
          this.productGroups = result.items;
          console.log("this.productGroup",this._productGroup);
          this.showPaging(result, pageNumber);
        });
    }
  
    refresh(): void {
      this.getDataPage(this.pageNumber);
    }
 
    protected delete(model: ProductGroupDto): void {
      abp.message.confirm(
        this.l('UserDeleteWarningMessage', model.name),
        undefined,
        (result: boolean) => {
          if (result) {
            this._productGroup.delete(model.id).subscribe(() => {
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
          CreateProductGroupComponent,
          {
            class: 'modal-lg',
          }
        );
      } else {
        createOrEditUserDialog = this._modalService.show(
          EditProductGroupComponent,
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
  

}
