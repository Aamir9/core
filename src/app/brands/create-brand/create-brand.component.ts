import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { BrandDto, BrandServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-brand',
  templateUrl: './create-brand.component.html',
  styleUrls: ['./create-brand.component.css'],
  animations: [appModuleAnimation()]
})
export class CreateBrandComponent extends AppComponentBase  implements OnInit {
  @Output() onSave = new EventEmitter<any>();
  saving = false;
  // id: number;
  brandDto : BrandDto = new BrandDto(); 
  constructor(
    public injector: Injector,
    public bsModalRef: BsModalRef,
    private _brandService :BrandServiceProxy

  ) {
    super(injector);

  }

  ngOnInit(): void {
   
  }

  save(): void {
    this.saving = true;
    this._brandService.create(this.brandDto).subscribe(
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
