import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import {
  CreateUpdateUserPoliciesDto,
  CreateUserFileDto,
  CreateUserPolicyFileDto,
  UserPoliciesServiceProxy
} from '@shared/service-proxies/service-proxies';
import { Base64File } from '@shared/components/upload-file/upload-file.component';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';


@Component({
  templateUrl: './create-user-policy.component.html'
})
export class CreateUserPolicyComponent extends AppComponentBase implements OnInit {
  saving = false;
  userId!: number;
  uploadedFile: CreateUserPolicyFileDto | null = null;
  uploadedCertificateFile: CreateUserPolicyFileDto | null = null;
  createDto = new CreateUpdateUserPoliciesDto();
  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _userPolicyService: UserPoliciesServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.createDto.userId = this.userId;
    this.createDto.files = [];
    this.createDto.isActive = true;
  }


  onPdfUploaded(file: Base64File) {
    this.uploadedFile = new CreateUserPolicyFileDto();
    this.uploadedFile.name = file.fileName || '';
    this.uploadedFile.type = file.fileType;
    this.uploadedFile.size = file.fileSize;
    this.uploadedFile.base64 = file.fileBase64;
  }


  onCertificatePdfUploaded(file: Base64File) {
    this.uploadedCertificateFile = new CreateUserPolicyFileDto();
    this.uploadedCertificateFile.name = file.fileName || '';
    this.uploadedCertificateFile.type = file.fileType;
    this.uploadedCertificateFile.size = file.fileSize;
    this.uploadedCertificateFile.base64 = file.fileBase64;
  }

  save(): void {
    this.saving = true;

    if (this.createDto.renewalDate) {
      this.createDto.renewalDate = new Date(this.createDto.renewalDate);
    }

    if (this.uploadedFile && this.uploadedFile.base64) {
      const base64Content = this.uploadedFile.base64.includes(',')
        ? this.uploadedFile.base64.split(',')[1]
        : this.uploadedFile.base64;

      this.createDto.policyPdf = new CreateUserPolicyFileDto();
      this.createDto.policyPdf.name = this.uploadedFile.name;
      this.createDto.policyPdf.type = this.uploadedFile.type;
      this.createDto.policyPdf.size = this.uploadedFile.size;
      this.createDto.policyPdf.base64 = base64Content;
    }

    if (this.uploadedCertificateFile && this.uploadedCertificateFile.base64) {
      const base64CertificateContent = this.uploadedCertificateFile && this.uploadedCertificateFile.base64
        ? (this.uploadedCertificateFile.base64.includes(',')
          ? this.uploadedCertificateFile.base64.split(',')[1]
          : this.uploadedCertificateFile.base64)
        : null;

      if (base64CertificateContent) {
        this.createDto.certificatePdfPath = new CreateUserPolicyFileDto();
        this.createDto.certificatePdfPath.name = this.uploadedCertificateFile.name;
        this.createDto.certificatePdfPath.type = this.uploadedCertificateFile.type;
        this.createDto.certificatePdfPath.size = this.uploadedCertificateFile.size;
        this.createDto.certificatePdfPath.base64 = base64CertificateContent;
      }
    }


    this.submitData();
  }


  private submitData(): void {
    this._userPolicyService
      .create(this.createDto)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit();
      });
  }

  public dropped(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          const reader = new FileReader();
          console.log("🚀 Uploading files:", this.createDto.files);

          reader.onload = () => {
            const fileDto: CreateUserFileDto = new CreateUserFileDto();
            fileDto.name = file.name;
            fileDto.size = file.size;
            fileDto.type = file.type;
            fileDto.base64 = reader.result.toString();
            this.createDto.files.push(fileDto);
          };
          reader.onerror = (error) => {
            console.log("Error: ", error);
          };
          reader.readAsDataURL(file);

        });
      }
    }
  }
  public fileOver(event: any) {
    console.log('File over drop zone:', event);
  }

  public fileLeave(event: any) {
    console.log('File left drop zone:', event);
  }

  removeFile(i: number): void {
    if (this.createDto.files) {
      this.createDto.files.splice(i, 1);
    }
  }


}
