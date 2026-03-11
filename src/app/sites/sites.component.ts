import { Component, Injector, Input, OnInit } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { SiteDto, SiteServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CreateSiteComponent } from './create-site/create-site.component';
import { EditSiteComponent } from './edit-site/edit-site.component';


class PagedSiteRequestDto extends PagedRequestDto {
  keyword: string;
  tenantId:number
}
@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.css']
})


export class SitesComponent extends PagedListingComponentBase<SiteDto>  implements OnInit {
@Input() tenantId:number;
   keyword: string = "";
  sites:SiteDto[] = [];

  constructor(
    injector: Injector,
    private  _siteService:SiteServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getDataPage(1);
  }


  protected list(
    request: PagedSiteRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    console.log("tenantId in sites:",this.tenantId)
    request.keyword = this.keyword;
    request.tenantId=this.tenantId;
    this._siteService.getPagedResult(
      request.keyword,
      request.tenantId,
      request.skipCount,
      request.maxResultCount
    )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result:any) => {
        this.sites = result.items;
        console.log('Sites response',this.sites);
        this.showPaging(result, pageNumber);
      });
  }

  refresh(): void {
    this.getDataPage(this.pageNumber);
  }

  protected delete(site: SiteDto): void {

    abp.message.confirm(
      this.l('UserDeleteWarningMessage', site.name),
      undefined,
      (result: boolean) => {
        if (result) {
          this._siteService.delete(site.id).subscribe(() => {
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
        CreateSiteComponent,
        {
          class: 'modal-md',
          initialState: {
            tenantId: this.tenantId,
          },
        }
      );
    } else {
      createOrEditUserDialog = this._modalService.show(
        EditSiteComponent,
        {
          class: 'modal-md',
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
