import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateSiteDto, SiteDto, SiteServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-site',
  templateUrl: './create-site.component.html',
  styleUrls: ['./create-site.component.css']
})
export class CreateSiteComponent extends AppComponentBase implements OnInit {

  saving = false;
  tenantId:number;
  siteDto: CreateSiteDto = new CreateSiteDto();
  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _siteService: SiteServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  async ngOnInit() {
  }

  save(): void {
    this.saving = true;
    console.log('Tenant Id in Create Site Dto',this.tenantId)
    this.siteDto.tenantId=this.tenantId;
    this._siteService.create(this.siteDto).subscribe(
      () => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit();
      },
      () => {
        this.saving = false;
      }
    );
  }
}
