import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ProductGroupDto, ProductGroupServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit-product-group',
  templateUrl: './edit-product-group.component.html',
  styleUrls: ['./edit-product-group.component.css']
})
export class EditProductGroupComponent extends AppComponentBase  implements OnInit {

  @Output() onSave = new EventEmitter<any>();
  saving = false;
  id: number;
  productGroupDto : ProductGroupDto = new ProductGroupDto(); 
  constructor(
    public injector: Injector,
    public bsModalRef: BsModalRef,
    private _productGroup :ProductGroupServiceProxy

  ) {
    super(injector);

  }

  ngOnInit(): void {

    if(this.id != null){
      this._productGroup.getById(this.id).subscribe(
        (result: ProductGroupDto) => {
          this.productGroupDto = result;
          
        });
    }
  }

  save(): void {
    this.saving = true;
    
    this._productGroup.update(this.productGroupDto).subscribe(
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
