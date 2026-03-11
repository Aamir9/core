import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CategoryDto, CatogoryServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css'],
  animations: [appModuleAnimation()]
})
export class CreateCategoryComponent  extends AppComponentBase  implements OnInit {

  @Output() onSave = new EventEmitter<any>();
  saving = false;
  // id: number;
  categoryDto : CategoryDto = new CategoryDto(); 
  constructor(
    public injector: Injector,
    public bsModalRef: BsModalRef,
    private _categoryService :CatogoryServiceProxy

  ) {
    super(injector);

  }

  ngOnInit(): void {
   
  }

  save(): void {
    this.saving = true;
    this._categoryService.create(this.categoryDto).subscribe(
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
