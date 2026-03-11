import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class EventService {
  private eventSubject = new Subject<any>();

  emitEvent(event: string, data: any) {
    this.eventSubject.next({ event, data });
  }

  getEvent(event: string) {
    return this.eventSubject.asObservable().pipe(
      filter((e: any) => e.event === event),
      map((e: any) => e.data)
    );
  }
}
