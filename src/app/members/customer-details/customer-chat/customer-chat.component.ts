import { ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DateHelper } from '@shared/helpers/DateHelper';
import { ChatService } from '@shared/service-custom/chat.service';
import { ChatServiceServiceProxy, MessageDto, UserDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';

@Component({
  selector: 'app-customer-chat',
  templateUrl: './customer-chat.component.html',
  styleUrls: ['./customer-chat.component.css']
})
export class CustomerChatComponent implements OnInit {
  @Input('customerUserId') customerUserId: number;
  @ViewChild('message') private myScrollContainer: ElementRef;
  title = 'ClientApp';
  txtMessage: string = '';
  uniqueID: string = new Date().getTime().toString();
  messages: MessageDto[] = [];
  message = new MessageDto();
  selectedCustomer: UserDto;
  customers: UserDto[] = [];
  localDate = DateHelper.toLocalDate;
  constructor(
    private chatService: ChatService,
    private _ngZone: NgZone,
    private _appSessionService: AppSessionService,
    private _appChatService: ChatServiceServiceProxy,
    private changeDetector: ChangeDetectorRef,
    private renderer: Renderer2
  ) {
  }
  async ngOnInit(): Promise<void> {

    this.getMessages(this.customerUserId);
    this.chatService.currentMessageSubject.subscribe(async () => {
      await this.getMessages(this.customerUserId);
    });
  }

  getMessages(userId: number): void {
    this._appChatService.getAllByUser(userId)
      .subscribe((res: MessageDto[]) => {
        this.messages = res;
        this.changeDetector.detectChanges();
        if (this.myScrollContainer) {
          this.renderer.setProperty(this.myScrollContainer.nativeElement, 'scrollTop', this.myScrollContainer.nativeElement.scrollHeight);
        }
      });
  }
}
