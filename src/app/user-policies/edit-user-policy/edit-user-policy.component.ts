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
  uploadedCertificateFile: CreateUserPolicyFileDto | null = null;
  // Flags so the backend (or save() payload) can tell the difference between
  // "no change" and "user explicitly removed the existing file".
  removePolicyPdf = false;
  removeCertificatePdf = false;
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

    // Pre-fill certificate PDF if exists
    if (result.certificatePdfPath) {
      this.uploadedCertificateFile = new CreateUserPolicyFileDto();
      this.uploadedCertificateFile.name = result.certificatePdfPath.split('/').pop() || '';
      this.uploadedCertificateFile.type = '';
      this.uploadedCertificateFile.size = 0;
      this.uploadedCertificateFile.base64 = '';
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
    newFile.size = file.fileSize; 
    newFile.base64 = file.fileBase64;
    this.uploadedFile = newFile;
  }

  removePolicyFile(uploader?: any): void {
    console.log('[EditUserPolicy] removePolicyFile clicked. Before:', {
      uploadedFile: this.uploadedFile,
      existingPath: this.userPolicy?.policyPdfPath
    });

    this.uploadedFile = null;
    this.removePolicyPdf = true;
    // Sentinel empty DTO so backend doesn't NRE on input.PolicyPdf.Base64
    this.updateDto.policyPdf = this.buildEmptyFileDto(true);

    if (uploader && typeof uploader.removeFile === 'function') {
      uploader.removeFile();
    }

    console.log('[EditUserPolicy] removePolicyFile done. After:', {
      uploadedFile: this.uploadedFile,
      removePolicyPdf: this.removePolicyPdf,
      policyPdfDto: this.updateDto.policyPdf
    });
  }

  private buildEmptyFileDto(asDeleteSentinel = false): CreateUserPolicyFileDto {
    const empty = new CreateUserPolicyFileDto();
    // '__DELETE__' is a sentinel the backend can check to clear the stored path.
    empty.name = asDeleteSentinel ? '__DELETE__' : '';
    empty.type = '';
    empty.size = 0;
    empty.base64 = '';
    return empty;
  }

  onCertificatePdfUploaded(file: Base64File) {
    const newFile = new CreateUserPolicyFileDto();
    newFile.name = file.fileName;
    newFile.type = file.fileType;
    newFile.size = file.fileSize;
    newFile.base64 = file.fileBase64;
    this.uploadedCertificateFile = newFile;
  }

  removeCertificateFile(uploader?: any): void {
    console.log('[EditUserPolicy] removeCertificateFile clicked. Before:', {
      uploadedCertificateFile: this.uploadedCertificateFile,
      existingPath: this.userPolicy?.certificatePdfPath
    });

    this.uploadedCertificateFile = null;
    this.removeCertificatePdf = true;
    // Sentinel empty DTO so backend doesn't NRE on input.CertificatePdfPath.Base64
    this.updateDto.certificatePdfPath = this.buildEmptyFileDto(true);

    if (uploader && typeof uploader.removeFile === 'function') {
      uploader.removeFile();
    }

    console.log('[EditUserPolicy] removeCertificateFile done. After:', {
      uploadedCertificateFile: this.uploadedCertificateFile,
      removeCertificatePdf: this.removeCertificatePdf,
      certificatePdfDto: this.updateDto.certificatePdfPath
    });
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
    } else {
      // No new upload. If user explicitly removed -> send delete sentinel.
      this.updateDto.policyPdf = this.buildEmptyFileDto(this.removePolicyPdf);
    }

    if (this.uploadedCertificateFile && this.uploadedCertificateFile.base64) {
      const certBase64 = this.uploadedCertificateFile.base64.includes(',')
        ? this.uploadedCertificateFile.base64.split(',')[1]
        : this.uploadedCertificateFile.base64;

      this.updateDto.certificatePdfPath = new CreateUserPolicyFileDto();
      this.updateDto.certificatePdfPath.name = this.uploadedCertificateFile.name;
      this.updateDto.certificatePdfPath.type = this.uploadedCertificateFile.type;
      this.updateDto.certificatePdfPath.size = this.uploadedCertificateFile.size;
      this.updateDto.certificatePdfPath.base64 = certBase64;
    } else {
      this.updateDto.certificatePdfPath = this.buildEmptyFileDto(this.removeCertificatePdf);
    }

    console.log('[EditUserPolicy] save() payload:', {
      removePolicyPdf: this.removePolicyPdf,
      removeCertificatePdf: this.removeCertificatePdf,
      policyPdf: this.updateDto.policyPdf,
      certificatePdfPath: this.updateDto.certificatePdfPath,
      updateDto: this.updateDto
    });

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
