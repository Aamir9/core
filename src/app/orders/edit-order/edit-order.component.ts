import { MappingHelper } from './../../../shared/helpers/MappingHelper';
import { Int32LookUpDto, OrderDto, OrderLineDto, OrderLineListDto, OrderServiceProxy, ProductServiceProxy, SupplierListDto, SupplierServiceProxy, UpdateOrderDto, UserDto, UserServiceProxy } from './../../../shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DateHelper } from '@shared/helpers/DateHelper';
import { AppConsts, UserTypes } from '@shared/AppConsts';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css']
})
export class EditOrderComponent extends AppComponentBase implements OnInit {

  @Output() onSave = new EventEmitter<any>();

  id: number;
  saving = false;
  order = new UpdateOrderDto();
  orderDate = new Date();
  employees: UserDto[] = [];
  suppliers: SupplierListDto[] = [];
  products: Int32LookUpDto[] = [];
  orderLines: OrderLineListDto[] = [];
  promisedDate = new Date();
  orderTotal: number = 0;
  constructor(
    injector: Injector,
    private _orderService: OrderServiceProxy,
    private _userService: UserServiceProxy,
    private _supplierService: SupplierServiceProxy,
    private _productService: ProductServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
    this.order.orderLines = [];
  }

  async ngOnInit() {
    await this.loadEmployees();
    await this.loadSuppliers();
    await this.loadProducts();
    await this.loadOrder();
  }

  save(): void {
    this.saving = true;
    this.order.orderDate = DateHelper.convertDateTimeToString(this.orderDate, AppConsts.dateFormate);
    this.setOrderLinesOfOrder();
    this._orderService
      .update(this.order)
      .subscribe(
        () => {
          this.notify.info(this.l('SavedSuccessfully'));
          this.bsModalRef.hide();
          this.onSave.emit();
        },
        () => {
          this.saving = false;
        }
      );
  }

  addProduct() {
    this.order.orderLines.push(new OrderLineDto());
  }

  setOrderLinePromisedDate(orderLine: OrderLineDto) {
    console.log(this.promisedDate);
    orderLine.promissedDate = DateHelper.convertDateTimeToString(this.promisedDate, AppConsts.dateFormate)
  }

  calculateOderLineTotal(orderLine: OrderLineListDto) {
    if (!!orderLine.price && !!orderLine.quantity)
      orderLine.total = orderLine.quantity * orderLine.price;

    this.calculateOrderTotal();
  }

  calculateOrderTotal() {
    this.orderTotal = 0;
    this.orderLines.forEach(element => {
      if (!!element.total)
        this.orderTotal += element.total;
    });
  }
  //#region private Methods
  private async loadEmployees() {
    this.employees = (await this._userService.getFilteredUsers(UserTypes.Employee).toPromise()).items;
  }

  private async loadSuppliers() {
    this.suppliers = (await this._supplierService.getAll().toPromise()).items;
  }

  private async loadProducts() {
    this.products = (await this._productService.getAll().toPromise()).items;
  }

  private async loadOrder() {
    let orderData = await this._orderService.get(this.id).toPromise();
    this.setOrderDate(orderData);
    this.order = MappingHelper.mapOrderDtoToUpdateOrderDto(orderData);
    this.setOrderLines(orderData);
    this.calculateOrderTotalFromOrderLines();
  }

  private setOrderDate(orderData: OrderDto) {
    this.orderDate = orderData.orderDate;
  }

  private setOrderLines(orderData: OrderDto) {
    this.orderLines = orderData.orderLines;
  }

  private setOrderLinesOfOrder() {
    this.order.orderLines = this.orderLines.map(orderLine => MappingHelper.mapOrderLineListDtoToOrderLineDto(orderLine));
  }

  private calculateOrderTotalFromOrderLines() {
    this.orderTotal = 0;
    this.orderLines.forEach(element => {
      this.calculateOderLineTotal(element);
    });
  }
  //#endregion

}
