import { Component, OnInit } from "@angular/core";
import {
  MenuItemDto,
  MenuItemServiceProxy,
} from "@shared/service-proxies/service-proxies";

@Component({
  selector: "app-menu-configuration",
  templateUrl: "./menu-configuration.component.html",
  styleUrls: ["./menu-configuration.component.css"],
})
export class MenuConfigurationComponent implements OnInit {
  menuItems: MenuItemDto[] = [];

  constructor(private readonly _menuService: MenuItemServiceProxy) {}

  ngOnInit(): void {
    this.loadMenuItems();
  }

  private loadMenuItems(): void {
    this._menuService.get().subscribe((res) => {
      this.menuItems = res;
    });
  }

  public onSaveClick(): void {
    this._menuService.update(this.menuItems).subscribe((res) => {
      this.loadMenuItems();
    });
  }
}
