import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { SiteDto, SiteServiceProxy, UpdateSiteDto } from '@shared/service-proxies/service-proxies';
import { extend } from 'lodash-es';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit-site',
  templateUrl: './edit-site.component.html',
  styleUrls: ['./edit-site.component.css']
})
export class EditSiteComponent extends AppComponentBase implements OnInit {
  
    saving = false;
    siteDto: UpdateSiteDto = new UpdateSiteDto();
    id: number;
    @Output() onSave = new EventEmitter<any>();
  
    constructor(
      injector: Injector,
      public _siteService: SiteServiceProxy,
      public bsModalRef: BsModalRef
    ) {
      super(injector);
    }
  
    async ngOnInit() {
      this._siteService.get(this.id).subscribe((result: SiteDto) => {
        this.siteDto = result;
      });
    }
    save(): void {
      this.saving = true;
      this._siteService.update(this.siteDto).subscribe(
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