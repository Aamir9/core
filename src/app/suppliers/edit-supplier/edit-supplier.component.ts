import { Component, EventEmitter, Injector, OnInit, Output } from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import { SupplierDto, SupplierServiceProxy } from "@shared/service-proxies/service-proxies";
import { AppSessionService } from "@shared/session/app-session.service";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: 'app-edit-supplier',
  templateUrl: './edit-supplier.component.html',
  styleUrls: ['./edit-supplier.component.css']
})
export class EditSupplierComponent extends AppComponentBase  implements OnInit {

  @Output() onSave = new EventEmitter<any>();
  saving = false;
  id: number;

  supplierModel : SupplierDto = new SupplierDto();
  constructor(
    public injector: Injector,
    public bsModalRef: BsModalRef,
    private _supplierService :SupplierServiceProxy,
    private _appSessionService: AppSessionService
  ) {
    super(injector);

  }

  ngOnInit(): void {
    this._supplierService.get(this.id).subscribe(
      (result) => {
        this.supplierModel = result;
      }
    );
  }

  save(): void {
    if(!this.isAdminUser){
      return
    }

    this.supplierModel.userTypeId = 1;
    this.saving = true;
    this._supplierService.update(this.supplierModel).subscribe(
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