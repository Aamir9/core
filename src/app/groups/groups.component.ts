import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { GroupDto, GroupDtoListResultDto, GroupDtoPagedResultDto, GroupServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CreateGroupComponent } from './create-group/create-group.component';
import { DetailsGroupComponent } from './details-group/details-group.component';
import { EditGroupComponent } from './edit-group/edit-group.component';

class PagedGroupsRequestDto extends PagedRequestDto {
  keyword: string;
}

@Component({
  selector: 'app-group',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
  animations: [appModuleAnimation()]
})
export class GroupsComponent extends PagedListingComponentBase<GroupDto> implements OnInit {

  keyword = '';
  groups: GroupDto[] = [];
  constructor(
    injector: Injector,
    private _groupService: GroupServiceProxy,
    private _modalService: BsModalService,
    private router: Router,
    private _appSessionService: AppSessionService,

  ) {
    super(injector);
    if(this._appSessionService?.user?.userTypeId===3){
     this.router.navigate(['/app/faults']);

    }
  }

  ngOnInit(): void {
    this.getDataPage(1);
  }


  protected list(
    request: PagedGroupsRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    this._groupService.getPagedResult(
      request.keyword,
      request.skipCount,
      request.maxResultCount
    )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result:any) => {
        this.groups = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  refresh(): void {
    this.getDataPage(this.pageNumber);
  }

  protected delete(group: GroupDto): void {
    abp.message.confirm(
      this.l('UserDeleteWarningMessage', group.name),
      undefined,
      (result: boolean) => {
        if (result) {
          this._groupService.delete(group.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }

  public showCreateOrEditGroupDialog(id?: number): void {
    let createOrEditUserDialog: BsModalRef;
    if (!id) {
      createOrEditUserDialog = this._modalService.show(
        CreateGroupComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      createOrEditUserDialog = this._modalService.show(
        EditGroupComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditUserDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }

  goToInvitedActivities(id: number): void {
    this.router.navigate(['app/invited-activities', id]);
  }

  isAdminUser(): boolean {
    return this._appSessionService.isAdminUser();
   }

   public detailsGroupDialog(id: number): void {
    
    let detialUserDialog: BsModalRef;
      detialUserDialog = this._modalService.show(
        DetailsGroupComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
  

  }

  public editGroup(id:number):void{

    this.router.navigate(['app/editGroupCustomers',id]);

    // let detialUserDialog: BsModalRef;
    // detialUserDialog = this._modalService.show(
    //   EditGroupComponent,
    //   {
    //     class: 'modal-lg',
    //     initialState: {
    //       id: id,
    //     },
    //   }
    // );

  }

}
