import { Component, Injector, OnInit } from "@angular/core";
import {
  NavigationEnd,
  PRIMARY_OUTLET,
  Router,
  RouterEvent,
} from "@angular/router";
import { AppComponentBase } from "@shared/app-component-base";
import { MenuItem } from "@shared/layout/menu-item";
import { CompanyLoginInfoDto } from "@shared/service-proxies/service-proxies";
import { AppSessionService } from "@shared/session/app-session.service";
import { BehaviorSubject } from "rxjs";
import { filter } from "rxjs/operators";
@Component({
  selector: "sidebar-menu",
  templateUrl: "./sidebar-menu.component.html",
  styleUrls: ["./menu-custom.css"],
})
export class SidebarMenuComponent extends AppComponentBase implements OnInit {
  menuItems: MenuItem[];
  menuItemsMap: { [key: number]: MenuItem } = {};
  activatedMenuItems: MenuItem[] = [];
  routerEvents: BehaviorSubject<RouterEvent> = new BehaviorSubject(undefined);
  homeRoute = "/app/about";
  companyInfo = new CompanyLoginInfoDto();
  isCustomer = false;

  constructor(
    injector: Injector,
    private router: Router,
    private appSessionService: AppSessionService,
     public _appSessionService: AppSessionService
  ) {
    super(injector);
    this.router.events.subscribe(this.routerEvents);
  }


  // ngOnInit(): void {

  //   this.menuItems = this.getMenuItems();
  //   this.patchMenuItems(this.menuItems);
  //   this.routerEvents
  //     .pipe(filter((event) => event instanceof NavigationEnd))
  //     .subscribe((event) => {
  //       const currentUrl = event.url !== "/" ? event.url : this.homeRoute;
  //       const primaryUrlSegmentGroup =
  //         this.router.parseUrl(currentUrl).root.children[PRIMARY_OUTLET];
  //       if (primaryUrlSegmentGroup) {
  //         this.activateMenuItems("/" + primaryUrlSegmentGroup.toString());
  //       }
  //     });
  //   if (this.appSessionService?.user?.userTypeId === 2) {
  //     this.menuItems = this.menuItems.filter((m) => m.label === "Faults");
  //   }
  //   this.companyInfo = this.appSessionService.company;
  // }
ngOnInit(): void {
  const user = this.appSessionService?.user;

if (this._appSessionService.isCustomerUser()) {
  // --- CUSTOMER ---
  this.isCustomer = true;

  // Customer should only see Policies
  this.menuItems = [
    new MenuItem(
      this.l("Policies"),
      "/app/policies",
      "fas fa-scroll"
    )
  ];

  this.router.navigate(["/app/policies"]);

} else if (this._appSessionService.isAdminUser()) {
  // --- ADMIN ---
  this.isCustomer = false;

  // Load all menu items EXCEPT Policies
  this.menuItems = this.getMenuItems().filter(
    (item) => item.label !== this.l("Policies")
  );

} else {
  // --- OTHER ROLES (EMPLOYEE, MANAGER, ETC.) ---
  this.isCustomer = false;
  this.menuItems = this.getMenuItems();
}



  // Patch menu items (ABP menu system)
  this.patchMenuItems(this.menuItems);

  // Activate menu on route change
  this.routerEvents
    .pipe(filter((event) => event instanceof NavigationEnd))
    .subscribe((event) => {
      const currentUrl = event.url !== "/" ? event.url : this.homeRoute;
      const primaryUrlSegmentGroup =
        this.router.parseUrl(currentUrl).root.children[PRIMARY_OUTLET];
      if (primaryUrlSegmentGroup) {
        this.activateMenuItems("/" + primaryUrlSegmentGroup.toString());
      }
    });

  this.companyInfo = this.appSessionService.company;
}

  getMenuItems(): MenuItem[] {
    return [
   
     new MenuItem(this.l("Companies"), "/app/customers",  "fas fa-building"),
      
     
      new MenuItem(this.l("Policies"), "/app/policies", "fas fa-scroll"),
      
       new MenuItem(this.l("Not Use"), "", "fas fa-list", "", [
         new MenuItem( this.l("Reminders"),"/app/employee-remember-reports", "fas fa-bell"),
        new MenuItem(this.l("Groups"), "/app/groups", "fas fa-user-friends"),
        new MenuItem(this.l("Activities"), "/app/activities", "fas fa-running"), 
       new MenuItem(this.l("Package Receive"), "/app/package-receive", "fas fa-gift"),
       new MenuItem(this.l("Package Type"), "/app/package-types", "fas fa-gift"),       
         new MenuItem(this.l("Products"), "/app/products", "fas fa-boxes"),
         new MenuItem(this.l("WebShop"), "/app/web-shop", "fas fa-store"),
         new MenuItem(this.l("Sales"), "/app/sales", "fas fa-receipt"),
         new MenuItem(this.l("Brands"), "/app/brands", "fas fa-tags"),
         new MenuItem(this.l("Categories"), "/app/categories", "fas fa-list"),
         new MenuItem(this.l("Tickets"), "/app/tickets", "fas fa-ticket-alt"),
         new MenuItem(this.l("Rooms"), "/app/rooms", "fas fa-building", "Pages.Users"),
         new MenuItem(this.l("Suppliers"), "/app/suppliers", "fas fa-truck"),



      // new MenuItem(this.l("Products"), "", "fas fa-cubes", "", [
       new MenuItem(this.l("Serial Database"), "/app/items", "fas fa-database"),
         new MenuItem(this.l("Purchases"), "/app/orders", "fas fa-shopping-bag"),
         new MenuItem(this.l("Groups"), "/app/product-groups", "fas fa-user-friends"),
      // ]),

       //new MenuItem(this.l("Activities"), "", "fas fa-info-circle", "", [
         new MenuItem(this.l("Bookings"), "/app/bookings", "fas fa-clipboard-list"),
         new MenuItem(this.l("Faults"), "/app/faults", "fas fa-exclamation-triangle", ""),

        // new MenuItem(this.l("Calender"), "", "", "", [
           new MenuItem( this.l("Calender"),"/app/activities-calendar", "fas fa-calendar-alt","Pages.Users" ),

         //]),
      // ]),

     //  new MenuItem(this.l("Administration"), "", "fas fa-cogs", "", [
         new MenuItem(this.l("Users"), "/app/users", "fas fa-user", "Pages.Users"),
         

         new MenuItem(
           this.l("ImportData"),
           "/app/import-economic-data",
           "fas fa-file-import",
           "Pages.Users"
         ),

         new MenuItem(
           this.l("Companies"),
           "/app/tenants",
           "fa fa-building",
           "Pages.Tenants"
         ),

         new MenuItem(this.l("Roles"), "/app/roles", "fas fa-user-shield", "Pages.Roles"),

         new MenuItem(this.l("Configuration"), "/app/configuration", "fas fa-cogs"),

       //]),
        ]),
       // new MenuItem(this.l("Package Recive"), "", "fas fa-gift"),


     ];
  }

  patchMenuItems(items: MenuItem[], parentId?: number): void {
    items.forEach((item: MenuItem, index: number) => {
      item.id = parentId ? Number(parentId + "" + (index + 1)) : index + 1;
      if (parentId) {
        item.parentId = parentId;
      }
      if (parentId || item.children) {
        this.menuItemsMap[item.id] = item;
      }
      if (item.children) {
        this.patchMenuItems(item.children, item.id);
      }
    });
  }

  activateMenuItems(url: string): void {
    this.deactivateMenuItems(this.menuItems);
    this.activatedMenuItems = [];
    const foundedItems = this.findMenuItemsByUrl(url, this.menuItems);
    foundedItems.forEach((item) => {
      this.activateMenuItem(item);
    });
  }

  deactivateMenuItems(items: MenuItem[]): void {
    items.forEach((item: MenuItem) => {
      item.isActive = false;
      item.isCollapsed = true;
      if (item.children) {
        this.deactivateMenuItems(item.children);
      }
    });
  }

  activateMenuItem(item: MenuItem): void {
    item.isActive = true;
    if (item.children) {
      item.isCollapsed = false;
    }
    this.activatedMenuItems.push(item);
    if (item.parentId) {
      this.activateMenuItem(this.menuItemsMap[item.parentId]);
    }
  }

  onMenuItemClick(item: MenuItem): void {
    if (item.children) {
      item.isCollapsed = !item.isCollapsed;
      return;
    }
    this.deactivateMenuItems(this.menuItems);

    item.isActive = true;
    item.isCollapsed = false;
    if (item.parentId) {
      this.activateMenuItem(this.menuItemsMap[item.parentId]);
    }
  }

  findMenuItemsByUrl(
    url: string,
    items: MenuItem[],
    foundedItems: MenuItem[] = []
  ): MenuItem[] {
    items.forEach((item: MenuItem) => {
      if (item.route === url) {
        foundedItems.push(item);
      } else if (item.children) {
        this.findMenuItemsByUrl(url, item.children, foundedItems);
      }
    });
    return foundedItems;
  }

  isMenuItemVisible(item: MenuItem): boolean {
    if (!item.permissionName) {
      return true;
    }
    return this.permission.isGranted(item.permissionName);
  }

  onParentClick(item: MenuItem): void {
    if (item.children) {
      item.isCollapsed = !item.isCollapsed;
    }
    this.deactivateMenuItems(this.menuItems);
    this.activateMenuItem(item);
  }
}
