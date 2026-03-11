import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { GroupServiceProxy, Int32LookUpDto, UpdateGroupDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-AddCustomerToGroupDialog',
  templateUrl: './AddCustomerToGroupDialog.component.html',
  styleUrls: ['./AddCustomerToGroupDialog.component.css']
})
export class AddCustomerToGroupDialogComponent extends AppComponentBase implements OnInit {
  @Output() onSave = new EventEmitter<any>();

  saving = false;
  group:UpdateGroupDto=new UpdateGroupDto();
  groups: Int32LookUpDto[] = [];
  customerId: number;
  title = 'Add Customer To Group';
  isDataLoaded = false;

  constructor(
    public injector: Injector,
    public bsModalRef: BsModalRef,
    private _groupService: GroupServiceProxy,
  ) {
    super(injector);

  }

  async ngOnInit() {
    this.isDataLoaded = true;
    await this.loadGroups();
  }

  async save() {
    // this.saving = true;
    // let groupCustomers=(await (this._groupService.getGroupCustomers(this.group.id).toPromise())).items;
    // let customerIds=groupCustomers.map(g=>g.id);
    // customerIds.push(this.customerId);
    // this.group.userIds=customerIds;
    // await this._groupService.update(this.group).toPromise();
    // this.notify.info(this.l('SavedSuccessfully'));
    // this.bsModalRef.hide();
  }

  async loadGroups() {
    this.groups = (await this._groupService.getAll().toPromise()).items;
  }
}
