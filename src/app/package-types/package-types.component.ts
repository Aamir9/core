import { Component, Injector, OnInit } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { PackageTypeDto, PackageTypeServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CreatePackageTypeComponent } from './create-package-type/create-package-type.component';
import { UpdatePackageTypeComponent } from './update-package-type/update-package-type.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ActivatedRoute } from '@angular/router';
import { LayoutStoreService } from '@shared/layout/layout-store.service';

class PagedPackageTypeRequestDto extends PagedRequestDto {
  keyword: string;
}
@Component({
  selector: 'app-package-types',
  templateUrl: './package-types.component.html',
  styleUrls: ['./package-types.component.css'],
  animations: [appModuleAnimation()]

})
export class PackageTypesComponent extends PagedListingComponentBase<PackageTypeDto> implements OnInit {
  keyword: string = "";
  packageTypes:PackageTypeDto[] = [];

  constructor(
    injector: Injector,
    private  _packageTypeervice:PackageTypeServiceProxy,
    private _modalService: BsModalService,
    private _route: ActivatedRoute,
    private readonly _layoutService: LayoutStoreService
  ) {
    super(injector);
  }


  ngOnInit(): void {
    this._layoutService.updateHeaderTitle("Package Types");
    this.refresh();
  }


  protected list(
    request: PagedPackageTypeRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    this._packageTypeervice.getPagedResult(
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
        this.packageTypes = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  refresh(): void {
    this.getDataPage(this.pageNumber);
  }

  protected delete(input: PackageTypeDto): void {

    abp.message.confirm(
      this.l('UserDeleteWarningMessage', input.name),
      undefined,
      (result: boolean) => {
        if (result) {
          this._packageTypeervice.delete(input.id).subscribe(() => {
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
        CreatePackageTypeComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      createOrEditUserDialog = this._modalService.show(
        UpdatePackageTypeComponent,
        {
          class: 'modal-lg',
          initialState: {
            packageId: id,
          },
        }
      );
    }

    createOrEditUserDialog.content.onSave.subscribe(() => {
      this.refresh();
    });    
  }

}
