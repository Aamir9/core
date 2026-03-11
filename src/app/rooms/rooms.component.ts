import { Router } from '@angular/router';
import { CreateRoomComponent } from './create-room/create-room.component';
import { RoomServiceProxy, RoomDtoPagedResultDto } from './../../shared/service-proxies/service-proxies';
import { Component, OnInit, Injector } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { RoomDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { LayoutStoreService } from '@shared/layout/layout-store.service';

class PagedRoomsRequestDto extends PagedRequestDto {
  keyword: string;
}
@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
  animations: [appModuleAnimation()]
})
export class RoomsComponent extends PagedListingComponentBase<RoomDto> implements OnInit {
  rooms: RoomDto[] = [];
  keyword = '';

  constructor(
    injector: Injector,
    private _roomService: RoomServiceProxy,
    private _modalService: BsModalService,
    private _router:Router,
    private readonly _layoutService: LayoutStoreService
  ) {
    super(injector);
  }
  ngOnInit(): void {
   // this.getDataPage(1);
    this._layoutService.updateHeaderTitle("Rooms");
  }
  list(
    request: PagedRoomsRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;

    this._roomService
      .getAllPaged(request.keyword, request.skipCount, request.maxResultCount)
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: RoomDtoPagedResultDto) => {
        this.rooms = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  delete(room: RoomDto): void {
    abp.message.confirm(
      this.l('RoleDeleteWarningMessage', room.name),
      undefined,
      (result: boolean) => {
        if (result) {
          this._roomService
            .delete(room.id)
            .pipe(
              finalize(() => {
                abp.notify.success(this.l('SuccessfullyDeleted'));
                this.refresh();
              })
            )
            .subscribe(() => {});
        }
      }
    );
  }

  createRoom(): void {
    this.showCreateOrEditRoomDialog();
  }

  editRoom(room: RoomDto): void {
    this.showCreateOrEditRoomDialog(room.id);
  }

  showCreateOrEditRoomDialog(id?: number): void {
    let createOrEditRoomDialog: BsModalRef;
    if (!id) {
      createOrEditRoomDialog = this._modalService.show(
        CreateRoomComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      createOrEditRoomDialog = this._modalService.show(
        CreateRoomComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditRoomDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }

  viewCalender(room:RoomDto){
    this._router.navigate(['/app/room-calender',room.id])
  }
}
