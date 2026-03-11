import { UpdateActivityDto } from './../../../shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { AppConsts, UserTypes } from '@shared/AppConsts';
import { DateHelper } from '@shared/helpers/DateHelper';
import { ActivityDto, ActivityServiceProxy, UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit-activity',
  templateUrl: './edit-activity.component.html',
  styleUrls: ['./edit-activity.component.css'],
  animations: [appModuleAnimation()]
})
export class EditActivityComponent extends AppComponentBase implements OnInit {

  @Output() onSave = new EventEmitter<any>();
  saving = false;
  activity = new ActivityDto();
  id: number;

  followUpDate=new Date();
  activityDate=new  Date();

  activityTypes: any;
  FollowTypes: any;
  activityKinds: any; 
  employees: UserDto[] = [];
  customers: UserDto[] = [];

  constructor(
    public injector: Injector,
    public bsModalRef: BsModalRef,
    private _activityService: ActivityServiceProxy,
    private _userService: UserServiceProxy
  ) {
    super(injector);
  }


  async ngOnInit() {

    this.GetActivityTypes();
    this.getActivityArts();
    await this.getEmployees();
  //  await this.getCustomers();
    this.getActivity();
  }

  private getActivity() {
    this._activityService.get(this.id).subscribe((result) => {
      this.activity = result;
      this.activityDate = this.activity.date;
      this.followUpDate = this.activity.followUpDate;
    });
  }

  // private async getCustomers() {
  //   this.customers = await (await this._userService.getFilteredUsers(UserTypes.Customer).toPromise()).items;
  // }

  private GetActivityTypes() {
    this._activityService.getAllActivityTypes().subscribe((result) => {
      this.activityTypes = result.items;
      this.FollowTypes = result.items;
    });
  }

  private getActivityArts() {
    this._activityService.getAllActivityArts().subscribe((result) => {
      this.activityKinds = result.items;
    });
  }

  private async getEmployees() {
    this.employees = await (await this._userService.getFilteredUsers(UserTypes.Employee).toPromise()).items;
  }

  save(): void {
    this.saving = true;
    this.saving = false;
    let updateActivity=new UpdateActivityDto();
    updateActivity.id=this.activity.id;
    updateActivity.tenantId=this.activity.tenantId;
    updateActivity.name=this.activity.name;
    updateActivity.date=DateHelper.convertDateTimeToString(this.activityDate,AppConsts.dateFormate);
    updateActivity.followUpDate=DateHelper.convertDateTimeToString(this.followUpDate,AppConsts.dateFormate);
    updateActivity.followUpTypeId=this.activity.followUpTypeId;
    updateActivity.activityArtId=this.activity.activityArtId;
    updateActivity.activityTypeId=this.activity.activityTypeId;
    updateActivity.employeeId=this.activity.employeeId;
    updateActivity.customerId=this.activity.customerId;
    updateActivity.followUpByEmployeeId=this.activity.followUpByEmployeeId;

    this._activityService.update(updateActivity).subscribe(
      () => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit(updateActivity);
      },
      () => {
        this.saving = false;
      }
    );
  }

}
