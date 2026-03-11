import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CustomerListDto, GroupServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-details-group',
  templateUrl: './details-group.component.html',
  styleUrls: ['./details-group.component.css'],
  animations: [appModuleAnimation()]
})
export class DetailsGroupComponent extends AppComponentBase  implements OnInit {

  id: number;
  customers :CustomerListDto[] = [];
  constructor(
    public injector: Injector,
    public bsModalRef: BsModalRef,
    private _group :GroupServiceProxy

  ) {
    super(injector);

  }

  async ngOnInit(): Promise<void> {

    if(this.id != null){
      await this._group.getGroupUsers(this.id).subscribe(
        (result: any) => {
          this.customers = result.items;
        });
    }
  }



}
