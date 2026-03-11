import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { EyeToolDto, EyeToolDtoListResultDto, EyeToolServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-eye-tool',
  templateUrl: './eye-tool.component.html',
  styleUrls: ['./eye-tool.component.css'],
  animations: [appModuleAnimation()]
})
export class EyeToolComponent extends AppComponentBase  implements OnInit  {

  eyeToolModel = new EyeToolDto();
  eyeToolResult = new EyeToolDto();
  ActivityId: number;

  constructor(
    injector: Injector,
    public bsModalRef: BsModalRef,
    private rout: ActivatedRoute,
    private _eyeToolService: EyeToolServiceProxy,
    
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.ActivityId = Number.parseInt(this.rout.snapshot.params['activityId']);
  }

  // create eye tool
  createEyeTool() {
    this.eyeToolModel.activityId = this.ActivityId;
    console.log(this.eyeToolModel);
    this._eyeToolService.create(this.eyeToolModel).subscribe(result => {
      this.notify.info(this.l('SavedSuccessfully'));
    });
  }

}
