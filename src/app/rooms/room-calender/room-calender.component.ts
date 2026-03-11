import { ActivatedRoute } from '@angular/router';
import { RoomDto, RoomServiceProxy } from './../../../shared/service-proxies/service-proxies';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-room-calender',
  templateUrl: './room-calender.component.html',
  styleUrls: ['./room-calender.component.css']
})
export class RoomCalenderComponent implements OnInit {
  roomId:number;
  room=new RoomDto;
  constructor(
    private _roomService:RoomServiceProxy,
    rout:ActivatedRoute
  ) { 
      this.roomId=Number.parseInt(rout.snapshot.paramMap.get('id'));
  }

  ngOnInit() {
    this._roomService.get(this.roomId).subscribe(res=>{
      this.room=res;
    });
  }

}
