import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CategoryDto, CatogoryServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent extends AppComponentBase  implements OnInit {

  @Output() onSave = new EventEmitter<any>();
  saving = false;
   id: number;
  categoryDto : CategoryDto = new CategoryDto(); 
  constructor(
    public injector: Injector,
    public bsModalRef: BsModalRef,
    private _categoryService :CatogoryServiceProxy

  ) {
    super(injector);

  }

  ngOnInit(): void {

    if(this.id != null){
      this._categoryService.get(this.id).subscribe(
        (result: CategoryDto) => {
          this.categoryDto = result;
          
        });
    }
  }

  save(): void {
    this.saving = true;
    this._categoryService.update(this.categoryDto).subscribe(
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
