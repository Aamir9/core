import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateSupplierDto, ProductGroupDto, SupplierDto, SupplierServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-supplier',
  templateUrl: './create-supplier.component.html',
  styleUrls: ['./create-supplier.component.css'],
  animations: [appModuleAnimation()]
})
export class CreateSupplierComponent extends AppComponentBase  implements OnInit {

  @Output() onSave = new EventEmitter<any>();
  saving = false;
  id: number;
  supplierDto : SupplierDto = new SupplierDto();
  supplierModel :CreateSupplierDto = new CreateSupplierDto();
  constructor(
    public injector: Injector,
    public bsModalRef: BsModalRef,
    private _supplierService :SupplierServiceProxy,
    private _appSessionService: AppSessionService
  ) {
    super(injector);

  }

  ngOnInit(): void {

  }

  save(): void {
    if(!this.isAdminUser){
      return
    }

    this.supplierModel.userTypeId = 3;
    this.saving = true;
    this.supplierModel.tenantId = this.appSession.tenantId;
    this._supplierService.create(this.supplierModel).subscribe(
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

  isAdminUser(): boolean {
    return this._appSessionService.isAdminUser();
   }

}
