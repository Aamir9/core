import { Component, Injector, Input, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivityTaskServiceProxy, CreateActivityTaskDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css'],
  animations: [appModuleAnimation()]
})
export class CreateTaskComponent extends AppComponentBase implements OnInit {

 
  @Input() activityId : number;
  saving = false;
  taskModel = new CreateActivityTaskDto();
  
  constructor(
    public bsModalRef: BsModalRef,
    private _activityTaskService: ActivityTaskServiceProxy,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }
  createTask() {

    this.taskModel.activityId=this.activityId;
    this._activityTaskService.create(this.taskModel).subscribe(
      () => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.taskModel = new CreateActivityTaskDto();
        
      }
    );
  }

}
