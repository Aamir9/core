import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DateHelper } from '@shared/helpers/DateHelper';
import { ChatServiceServiceProxy, MessageDto, UserDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { Message } from '../../Custom-Model/message';
import { ChatService } from '../../service-custom/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @ViewChild('message') private myScrollContainer: ElementRef;
  title = 'ClientApp';
  txtMessage: string = '';
  uniqueID: string = new Date().getTime().toString();
  messages: MessageDto[] = [];
  message = new MessageDto();
  selectedCustomer: UserDto;
  customers: UserDto[] = [];
  localDate=DateHelper.toLocalDate;
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
    await this.getCustomers();
    if(!this.selectedCustomer){
      console.log("Please select");
      this.selectedCustomer=this.customers[0];
      await this.getMessages(this.selectedCustomer.id);
    }
    this.chatService.currentMessageSubject.subscribe(async () => {
      console.log('ERP M essage  ');
      console.log(this.selectedCustomer);
      await this.getCustomers();
      if(!this.selectedCustomer){
        this.selectedCustomer=this.customers[0];
        await this.getMessages(this.selectedCustomer.id);
      }
      if (this.selectedCustomer) {
        console.log('in if you');
        this.getMessages(this.selectedCustomer.id);
      }
    });
  }
  async getCustomers() {
    this.customers = (await this._appChatService.getCustomerUsers().toPromise())
    this.changeDetector.detectChanges();
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

  sendMessage(): void {
    if (this.txtMessage) {

      this.message = new MessageDto();
      this.message.receiverId = this.selectedCustomer.id;
      this.message.receiverTenantId = this.selectedCustomer.tenantId;
      this.message.senderId = this._appSessionService.user.id;
      this.message.senderTenantId = this._appSessionService.tenant.id;
      this.message.type = "sent";
      this.message.message = this.txtMessage;
      this.message.isAdmin = true;
      this._appChatService.saveMessage(this.message).subscribe(
        res => {

          this.message.date = new Date();
          this.messages.push(this.message);
          this.txtMessage = '';
        }
      );
    }
  }

  onCustomerClick(user: UserDto) {
    this.selectedCustomer = user;
    this.getMessages(this.selectedCustomer.id);
  }

}
