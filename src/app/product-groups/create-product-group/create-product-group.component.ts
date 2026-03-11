import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { ProductGroupDto, ProductGroupServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-product-group',
  templateUrl: './create-product-group.component.html',
  styleUrls: ['./create-product-group.component.css'],
  animations: [appModuleAnimation()]
})
export class CreateProductGroupComponent  extends AppComponentBase  implements OnInit {

  @Output() onSave = new EventEmitter<any>();
  saving = false;
  // id: number;
  productGroupDto : ProductGroupDto = new ProductGroupDto(); 
  constructor(
    public injector: Injector,
    public bsModalRef: BsModalRef,
    private _productGroup :ProductGroupServiceProxy

  ) {
    super(injector);

  }

  ngOnInit(): void {
   
  }

  save(): void {
    this.saving = true;
    this._productGroup.create(this.productGroupDto).subscribe(
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
