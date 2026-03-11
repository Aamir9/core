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
  TenantServiceProxy,
  TenantDto,
  Int32NameValueDto,
  CustomFieldServiceProxy,
  CustomFieldDto,
  CustomFieldDtoListResultDto
} from '@shared/service-proxies/service-proxies';
import { Base64Image } from '@shared/modals/base64image';
import { AppConsts } from '@shared/AppConsts';

@Component({
  templateUrl: 'edit-tenant-dialog.component.html'
})
export class EditTenantDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  tenant: TenantDto = new TenantDto();
  id: number;
  isPhotoUploaded = true;
  isDataLoaded = false;
  logoUrl = '';
  syncAPIOptions = AppConsts.SyncApiOptions;
  screens: Int32NameValueDto[] = [];
  fieldTypes: Int32NameValueDto[] = [];
  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _tenantService: TenantServiceProxy,
    private _customFieldService: CustomFieldServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  async ngOnInit() {
    await this.getScreens();
    await this.getFieldTypes();
    this._tenantService.get(this.id).subscribe((result: TenantDto) => {
      this.tenant = result;
      this.logoUrl = this.tenant.logoPath;
      this.isDataLoaded = true;
      this._customFieldService.getTenantCustomFields(this.tenant.id).subscribe((result) => {
        this.fillTenantCustomFields(result);
      });
    });
  }
  private fillTenantCustomFields(result: CustomFieldDtoListResultDto) {
    result.items.forEach(field => {
      console.log(field);
      this.tenant.customFields.push(field);
    });
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
    console.log(this.tenant.customFields);
    this._tenantService.update(this.tenant).subscribe(
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
