import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { SharedModule } from '@shared/shared.module'; // adjust if needed
import { Base64File } from '@shared/components/upload-file/upload-file.component';

import {
  CreateUpdateUserPoliciesDto,
  CreateUserPolicyFileDto,
  UserPoliciesDto,
  UserPoliciesServiceProxy
} from '@shared/service-proxies/service-proxies';

@Component({
  templateUrl: './edit-user-policy.component.html'
})
export class EditUserPolicyComponent extends AppComponentBase implements OnInit {
  saving = false;
   loading = true;
  @Input() id!: number;
  @Input() userId!: number;

  uploadedFile: CreateUserPolicyFileDto | null = null;
  userPolicy = new UserPoliciesDto();
  updateDto = new CreateUpdateUserPoliciesDto();

  @Output() onSave = new EventEmitter<void>();

  constructor(
    injector: Injector,
    private _userPolicyService: UserPoliciesServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }
ngOnInit(): void {
  if (!this.id) return;

  this.loading = true;

  this._userPolicyService.getById(this.id).subscribe((result: UserPoliciesDto) => {
    this.userPolicy = result;

    // Pre-fill form fields
    this.updateDto.userId = this.userId;
    this.updateDto.branch = result.branch;
    this.updateDto.company = result.company;
    this.updateDto.comment = result.comment;
    this.updateDto.policyNumber = result.policyNumber;

    // FIXED DATE (convert to yyyy-MM-dd)
   this.updateDto.renewalDate = result.renewalDate; // keep as Date


    this.updateDto.annualPremium = result.annualPremium;
    this.updateDto.isActive = result.isActive;

    // Pre-fill PDF if exists
    if (result.policyPdfPath) {
      this.uploadedFile = new CreateUserPolicyFileDto();
      this.uploadedFile.name = result.policyPdfPath.split('/').pop() || '';
      this.uploadedFile.type = '';
      this.uploadedFile.size = 0;
      this.uploadedFile.base64 = '';
    }

    this.loading = false;
  });
}

onRenewalDateChange(value: string) {
  if (value) {
    this.updateDto.renewalDate = new Date(value);
  } else {
    this.updateDto.renewalDate = undefined;
  }
}


private toDateInputValue(date: any): string | null {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString().split('T')[0]; // "YYYY-MM-DD"
}


  loadData() {
  this._userPolicyService.getById(this.id).subscribe((res: UserPoliciesDto) => {
    this.userPolicy = res;
    this.loading = false;   // form is now ready, enable button
  });
}

  onPdfUploaded(file: Base64File) {
    const newFile = new CreateUserPolicyFileDto();
    newFile.name = file.fileName;
    newFile.type = file.fileType;
    newFile.size = file.fileBase64.length; 
    newFile.base64 = file.fileBase64;
    this.uploadedFile = newFile;
  }

  save(): void {
    this.saving = true;
    this.updateDto.userId = this.userId;
   
    console.log(this.updateDto.isActive, "this.updateDto.isActive ========>" );

    if (this.updateDto.renewalDate) {
      this.updateDto.renewalDate = new Date(this.updateDto.renewalDate);
    }
    if (this.uploadedFile && this.uploadedFile.base64) {
      // Strip data URI prefix if present
      const base64Content = this.uploadedFile.base64.includes(',')
        ? this.uploadedFile.base64.split(',')[1]
        : this.uploadedFile.base64;
           
      this.updateDto.policyPdf = new CreateUserPolicyFileDto();
      this.updateDto.policyPdf.name = this.uploadedFile.name;
      this.updateDto.policyPdf.type = this.uploadedFile.type;
      this.updateDto.policyPdf.size = this.uploadedFile.size;
      this.updateDto.policyPdf.base64 = base64Content;
    }

    this._userPolicyService
      .update(this.id, this.updateDto)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit();
      });
  }
}
