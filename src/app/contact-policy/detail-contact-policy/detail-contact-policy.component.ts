import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { LayoutStoreService } from '@shared/layout/layout-store.service';
import { CreateUserFileDto, UserPoliciesDto, UserPoliciesServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-detail-contact-policy',
  templateUrl: './detail-contact-policy.component.html',
  styleUrls: ['./detail-contact-policy.component.css']
})
export class DetailContactPolicyComponent extends AppComponentBase implements OnInit{
   policyId: number;
  policy = new UserPoliciesDto();

  // This is YOUR custom UI variable, not part of DTO
 files:any[] = [];

  pdfUrl: string | null = null;
  

  constructor(
    injector: Injector,
    private route: ActivatedRoute,
    private _policyService: UserPoliciesServiceProxy,
    private modal: BsModalService,
    private location: Location,
     private readonly _layoutService: LayoutStoreService,
     public _appSessionService: AppSessionService
  ) {
    super(injector);
  }
  ngOnInit(): void {
     this._layoutService.updateHeaderTitle("User Policy Details");
    this.route.queryParams.subscribe(params => {
      this.policyId = Number(params['id']);
      if (this.policyId > 0) this.loadPolicy();
      
    });
  }
loadFiles(): void {
  const userId = this.policy.userId;

  this._policyService.getUserPoliciesFilesById(userId).subscribe((res: CreateUserFileDto[]) => {

    this.files = res;
    // this.files = res.map(f => {
    //   const blob = this.base64ToBlob(f.base64, f.type);
    //   const url = URL.createObjectURL(blob);
    //   return { ...f, url };
    // });
  });
}

base64ToBlob(base64: string, type: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = Array.from(byteCharacters, c => c.charCodeAt(0));
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type });
}

  loadPolicy(): void {
    this._policyService.getById(this.policyId).subscribe(res => {

      this.policy = res;

      // Your API does not return any file list, so we keep this empty
       this.loadFiles();

      if (res.policyPdfPath) {
        this.pdfUrl = abp.appPath + res.policyPdfPath;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  editPolicy(): void {
    // const modalRef = this.modal.show(EditUserPolicyComponent, {
    //   class: 'modal-lg',
    //   initialState: { id: this.policyId }
    // });

    // modalRef.content.onSave.subscribe(() => this.loadPolicy());
  }
}
