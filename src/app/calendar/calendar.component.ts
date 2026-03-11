import { ActivatedRoute } from '@angular/router';
import { AppConsts } from '@shared/AppConsts'
import {
  ActivityListDto,
  ActivityServiceProxy,
} from './../../shared/service-proxies/service-proxies'
import { DateHelper } from './../../shared/helpers/DateHelper'
import { Component, Input, OnInit } from '@angular/core'
import { CalendarEvent, CalendarView } from 'angular-calendar'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format,
} from 'date-fns'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { CreateInvitedActivityComponent } from '@app/invited-activities/create-invited-activity/create-invited-activity.component'
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  @Input('roomId') roomId:number;
   view: CalendarView = CalendarView.Week
  CalendarView = CalendarView
  viewDate: Date = new Date()
  activities: ActivityListDto[] = []
  events: CalendarEvent[] = []
  activeDayIsOpen: boolean = true
  daysInWeek: number

  constructor(
    private _activityService: ActivityServiceProxy,
    private _modalService: BsModalService,
    private _datePipeService: DatePipe
  ) {
  }

  async ngOnInit() {
    await this.getActivities()

    console.log(this.activities)
  }

  private async getActivities() {
    console.log(this.roomId);
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay,
    }[this.view]

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay,
    }[this.view]

    let fromDate = new Date(
      format(getStart(this.viewDate), AppConsts.dateFormate),
    )
    let toDate = new Date(format(getEnd(this.viewDate), AppConsts.dateFormate))

    this.activities = await (
      await this._activityService
        .getAllActivities(
          DateHelper.convertDateTimeToString(fromDate, AppConsts.dateFormate),
          DateHelper.convertDateTimeToString(toDate, AppConsts.dateFormate),
          this.roomId
        )
        .toPromise()
    ).items
    this.events = this.convertEventsToCalenderEvents(this.activities)
  }

  convertEventsToCalenderEvents(
    activities: ActivityListDto[],
  ): CalendarEvent[] {
    var calendarEvents: CalendarEvent[] = []

    activities.forEach((activity) => {
      let startDate=new Date(
        this._datePipeService.transform(
          DateHelper.toLocalDate(activity.date),
        ),
      );
      //Deep copy startDate
      let endDate = new Date(startDate.getTime())
      endDate.setHours(5);
      calendarEvents.push({
        start:startDate ,
        end:endDate,
        title:
          "<div class='cal-event-title2'><h6 class='text-large alert- heading text-center   text-wrap'   >" +
          activity.name +
          '</h6><span ><b>Type:</b> ' +
          activity.activityTypeName +
          '</span></div>',
        color: {
          primary: '#ad2121',
          secondary: '#01928ff',
        },
        // actions: this.actions,
        allDay: false,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
        draggable: false,
        id: activity.id,
        cssClass: 'cal-event-title',
      })
    })

    return calendarEvents
  }
  getLocalDate(date: Date) {
    var date = new Date(date)
    return date.toDateString()
  }

  async changeDate(): Promise<void> {
    this.getActivities()
  }
  async setView(view: CalendarView): Promise<void> {
    this.view = view
    this.getActivities()
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false
  }

  async handleEvent(action: string, event: CalendarEvent): Promise<void> {
    try {
      this.showCreateOrEditActivityDialog(Number(event.id))
    } catch (error) {
      console.log(error)
    }
  }

  private showCreateOrEditActivityDialog(id?: number): void {
    let createOrEditUserDialog: BsModalRef
    if (!id) {
      createOrEditUserDialog = this._modalService.show(
        CreateInvitedActivityComponent,
        {
          class: 'modal-lg',
        },
      )
    } else {
      createOrEditUserDialog = this._modalService.show(
        CreateInvitedActivityComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        },
      )
    }
  }
}
