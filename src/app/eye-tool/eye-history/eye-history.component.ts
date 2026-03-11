import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { EyeToolDto, EyeToolDtoListResultDto, EyeToolServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-eye-history',
  templateUrl: './eye-history.component.html',
  styleUrls: ['./eye-history.component.css'],
  animations: [appModuleAnimation()]

})
export class EyeHistoryComponent extends AppComponentBase  implements OnInit {
  ActivityId: number;

  constructor(
    injector: Injector,
    public bsModalRef: BsModalRef,
    private rout: ActivatedRoute,
    private _eyeToolService: EyeToolServiceProxy,
    
  ) {
    super(injector);
  }  
  eyeToolModel = new EyeToolDto();
  eyeToolHistory:EyeToolDto[]= []; 


  ngOnInit(): void {
    this.ActivityId = Number.parseInt(this.rout.snapshot.params['activityId']);
      this.getEyeToolHistory();
  }
  getEyeToolHistory() {
   
     this._eyeToolService.getAll(this.ActivityId).subscribe(result => {
     this.eyeToolHistory = result.items;
     });
  }
}
