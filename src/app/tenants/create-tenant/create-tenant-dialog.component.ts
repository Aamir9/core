import { CustomFieldServiceProxy, CustomFieldDto } from './../../../shared/service-proxies/service-proxies';
import {
  Component,
  Injector,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '@shared/app-component-base';
import {
  CreateTenantDto,
  Int32NameValueDto,
  TenantServiceProxy
} from '@shared/service-proxies/service-proxies';
import { Base64Image } from '@shared/modals/base64image';
import { AppConsts } from '@shared/AppConsts';

@Component({
  templateUrl: 'create-tenant-dialog.component.html'
})
export class CreateTenantDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  tenant: CreateTenantDto = new CreateTenantDto();
  screens: Int32NameValueDto[] = [];
  fieldTypes: Int32NameValueDto[] = [];
  @Output() onSave = new EventEmitter<any>();
  isPhotoUploaded = true;
  syncAPIOptions = AppConsts.SyncApiOptions;

  constructor(
    injector: Injector,
    public _tenantService: TenantServiceProxy,
    private _customFieldService: CustomFieldServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
    this.tenant.customFields = [];
  }

  async ngOnInit() {
    this.tenant.isActive = true;
    await this.getScreens();
    await this.getFieldTypes();
  }

  private async getFieldTypes() {
    this.fieldTypes = (await this._customFieldService.getCustomFieldTypes().toPromise()).items;
  }

  private async getScreens() {
    this.screens = (await this._customFieldService.getScreens().toPromise()).items;
  }

  save(): void {
    if (this.tenant.base64Logo === undefined || this.tenant.base64Logo === '') {
      this.isPhotoUploaded = false;
      return;
    }

    this.saving = true;
    this.tenant.name=this.tenant.companyName;
    this.tenant.isActive=true;
    this.tenant.primaryColor='black';
    this.tenant.secondaryColor='grey';
    this._tenantService.create(this.tenant).subscribe(
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

  onFileUploadHandler(image: Base64Image) {
    this.tenant.base64Logo = image.ImageBase64String;
  }
  onAddField() {
    var customField = new CustomFieldDto();
    customField.type = this.fieldTypes[0].value;
    customField.screen = this.screens[0].value;
    this.tenant.customFields.push(customField);
  }

  onRemoveField(index: number) {
    this.tenant.customFields.splice(index, 1);
  }

}
