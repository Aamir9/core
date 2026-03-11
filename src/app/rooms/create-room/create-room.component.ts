import { AppComponentBase } from '@shared/app-component-base';
import { RoomDto, RoomServiceProxy, CreateRoomDto } from './../../../shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent extends AppComponentBase implements OnInit {
  saving = false;
  room = new CreateRoomDto();
  id: number;
  roomForEdit: RoomDto;
  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _roomService: RoomServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  async ngOnInit() {
    if (this.id)
      await this.getRoomAndMaptoCreateComponent();
  }
  async getRoomAndMaptoCreateComponent() {
    this.roomForEdit = await this._roomService.get(this.id).toPromise();
    this.room.name = this.roomForEdit.name;
    this.room.descriptions = this.roomForEdit.descriptions;
  }


  save(): void {
    this.saving = true;
    if (this.roomForEdit)
      this.edit();
    else
      this.add();
  }
  edit() {
    this.roomForEdit.name=this.room.name;
    this.roomForEdit.descriptions=this.room.descriptions;
    this._roomService
      .update(this.roomForEdit)
      .subscribe(
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


  private add() {
    this._roomService
      .add(this.room)
      .subscribe(
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
}
