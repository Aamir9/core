import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivityTaskDto, ActivityTaskServiceProxy, CreateActivityTaskDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  animations: [appModuleAnimation()]
})
export class TasksComponent extends AppComponentBase implements OnInit,OnChanges {

  taskList: ActivityTaskDto[] = [];
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
    this.activityTasks();
  }
  ngOnChanges(): void {
    this.activityTasks();
  }
  activityTasks(){
    this._activityTaskService.getAll(this.activityId).subscribe((result) => {
      this.taskList = result.items;
      
    });
  }

  createTask() {

    this.taskModel.activityId=this.activityId;
    this._activityTaskService.create(this.taskModel).subscribe(
      () => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.taskModel = new CreateActivityTaskDto();
        this.activityTasks();
        
      }
    );
  }





}
