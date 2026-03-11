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
  userId!: number; // passed from parent
  uploadedFile: CreateUserPolicyFileDto | null = null;

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
  }


  onPdfUploaded(file: Base64File) {
    this.uploadedFile = new CreateUserPolicyFileDto();

    this.uploadedFile.name = file.fileName || ''; // default name if not provided
    this.uploadedFile.type = file.fileType;
    this.uploadedFile.size = file.fileBase64.length; 
    this.uploadedFile.base64 = file.fileBase64;

  }

save(): void {
  this.saving = true;

  debugger
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
  public fileOver(event) {
    console.log('File over drop zone:', event);
  }

  public fileLeave(event) {
    console.log('File left drop zone:', event);
  }

    removeFile(i: number): void {
    this.createDto.files.splice(i, 1);
  }

  uploadFiles(): void {
  }
}
