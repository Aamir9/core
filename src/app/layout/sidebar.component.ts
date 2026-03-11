import { ChangeDetectionStrategy, Component, OnInit, Renderer2, HostListener } from "@angular/core";
import { LayoutStoreService } from "@shared/layout/layout-store.service";
import { CompanyLoginInfoDto } from "@shared/service-proxies/service-proxies";
import { AppSessionService } from "@shared/session/app-session.service";
import { Subscription } from "rxjs";

@Component({
  selector: "sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ['./menu-custom.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  // sidebarExpanded: boolean;
  sidebarExpanded: boolean ;

  // isMobile: boolean;
   isMobile = false;
  companyInfo = new CompanyLoginInfoDto();
  private subscription: Subscription;
  constructor(
    private renderer: Renderer2,
    private _layoutStore: LayoutStoreService,
    private appSessionService: AppSessionService,
       public _appSessionService: AppSessionService
  ) {}

  ngOnInit(): void {
    this.isMobile = window.innerWidth < 768;
    this.subscription = this._layoutStore.sidebarExpanded.subscribe((value: boolean) => {
      this.sidebarExpanded = value; // No need for fallback; we ensure the observable always emits true or false
      this.toggleSidebar();
    });
    this.companyInfo = this.appSessionService.company;

    const el = window.document.getElementsByClassName("sidebar-dark-primary")[0];
    if (el) {
      this.renderer.setStyle(
        el,
        "background-color",
        this.companyInfo.primaryColor
      );
    }

    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      // this.sidebarExpanded = false;
      this.renderer.removeClass(document.body, "sidebar-open");
    }
  }

  toggleSidebar(): void {
    this.sidebarExpanded = !this.sidebarExpanded;
    if (this.isMobile) {
      this.sidebarExpanded
        ? this.renderer.addClass(document.body, "sidebar-open")
        : this.renderer.removeClass(document.body, "sidebar-open");
    }
  }

  showSidebar(): void {
    this.renderer.removeClass(document.body, "sidebar-collapse");
    this.renderer.addClass(document.body, "sidebar-open");
  }

  hideSidebar(): void {
    this.renderer.removeClass(document.body, "sidebar-open");
    this.renderer.addClass(document.body, "sidebar-collapse");
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
    }
