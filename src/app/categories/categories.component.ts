import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { CategoryDto, CatogoryServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { LayoutStoreService } from '@shared/layout/layout-store.service';

class PagedCagegoriesRequestDto extends PagedRequestDto {
  keyword: string;
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  animations: [appModuleAnimation()]
})
export class CategoriesComponent extends PagedListingComponentBase<CategoryDto> implements OnInit {
  keyword: string = "";
  categories:CategoryDto[] = [];

  constructor(
    injector: Injector,
    private  _categoryService:CatogoryServiceProxy,
    private _modalService: BsModalService,
    private readonly _layoutService: LayoutStoreService
  ) { 
    super(injector);
  }


  ngOnInit(): void {
    this.getDataPage(1);
    this._layoutService.updateHeaderTitle("Categories");
  }

  
  protected list(
    request: PagedCagegoriesRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    this._categoryService.getPagedResult(
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
        this.categories = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  refresh(): void {
    this.getDataPage(this.pageNumber);
  }

  protected delete(category: CategoryDto): void {

    abp.message.confirm(
      this.l('UserDeleteWarningMessage', category.name),
      undefined,
      (result: boolean) => {
        if (result) {
          this._categoryService.delete(category.id).subscribe(() => {
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
        CreateCategoryComponent,
        {
          class: 'modal-sm',
        }
      );
    } else {
      createOrEditUserDialog = this._modalService.show(
        EditCategoryComponent,
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
