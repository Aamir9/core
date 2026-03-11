export class MenuItem {
  id: number;
  parentId: number;
  label: string;
  route: string;
  icon: string;
  permissionName: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  children: MenuItem[];
  creatorUserId: 1;
  name: "My Home";
  orderNo: 0;
  tenantId: 2;

  constructor(
    label: string,
    route: string,
    icon: string,
    permissionName: string = null,
    children: MenuItem[] = null
  ) {
    this.label = label;
    this.route = route;
    this.icon = icon;
    this.permissionName = permissionName;
    this.children = children;
  }
}
