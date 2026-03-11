import { ChangeDetectorRef, Component, Injector, OnInit, Renderer2 } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { SignalRAspNetCoreHelper } from '@shared/helpers/SignalRAspNetCoreHelper';
import { LayoutStoreService } from '@shared/layout/layout-store.service';
import { ChatService } from '@shared/service-custom/chat.service';

@Component({
  templateUrl: './app.component.html'
})
export class AppComponent extends AppComponentBase implements OnInit {
  sidebarExpanded: boolean;
  isMessengerVisible=false;
  constructor(
    injector: Injector,
    private renderer: Renderer2,
    private _layoutStore: LayoutStoreService,
    private _chatService: ChatService,
    private changeDetector:ChangeDetectorRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'sidebar-mini');

    SignalRAspNetCoreHelper.initSignalR();

    abp.event.on('abp.notifications.received', (userNotification) => {
      console.log('User Notification received',userNotification);
      this._chatService.currentMessageSubject.next();
      this.isMessengerVisible=true;
      this.changeDetector.detectChanges();

      

    });

    this._layoutStore.sidebarExpanded.subscribe((value) => {
      this.sidebarExpanded = value;
    });
  }

  toggleSidebar(): void {
    this._layoutStore.setSidebarExpanded(!this.sidebarExpanded);
  }
  onChatClick() {
    this.isMessengerVisible = !this.isMessengerVisible;
  }
}
