import { MappingHelper } from './../../../shared/helpers/MappingHelper';
import { UserDto, SupplierListDto, UserServiceProxy, SupplierServiceProxy, Int32LookUpDto, ProductServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrderDto, OrderServiceProxy, Int32LookUpDtoListResultDto, OrderLineDto, OrderLineListDto } from './../../../shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { Component, OnInit, Injector, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AppConsts, UserTypes } from '@shared/AppConsts';
import { DateHelper } from '@shared/helpers/DateHelper';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css'],
  animations: [appModuleAnimation()]
})
export class CreateOrderComponent extends AppComponentBase implements OnInit {

  @Output() onSave = new EventEmitter<any>();

  saving = false;
  order = new CreateOrderDto();
  orderDate = new Date();
  employees: UserDto[] = [];
  suppliers: SupplierListDto[] = [];
  products: Int32LookUpDto[] = [];
  promisedDate = new Date();
  orderTotal: number = 0;
  orderLines:OrderLineListDto[]=[];

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
    await this.getNextOrderNumber();
    await this.loadProducts();
  }

  save(): void {
    this.saving = true;
    this.fillOrderDateOfOrder();
    this.fillOrderLinesOfOrder();
    this._orderService
      .create(this.order)
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
    console.log('Before Push', this.orderLines);
    this.orderLines.push(new OrderLineListDto());
    console.log('After Push', this.orderLines);
  }

  setOrderLinePromisedDate(orderLine: OrderLineDto) {
    console.log(this.promisedDate);
    orderLine.promissedDate = DateHelper.convertDateTimeToString(this.promisedDate, AppConsts.dateFormate)
  }

  calculateOderLineTotal(orderLine: OrderLineDto) {
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

  private async getNextOrderNumber() {
    this.order.orderNumber = (await this._orderService.getNextOrderNumber().toPromise()).value;
  }

  private async loadProducts() {
    this.products = (await this._productService.getAll().toPromise()).items;
  }

  fillOrderLinesOfOrder(){
    this.order.orderLines=    this.orderLines.map(orderLine=>MappingHelper.mapOrderLineListDtoToOrderLineDto(orderLine));
  }
 

  private fillOrderDateOfOrder() {
    this.order.orderDate = DateHelper.convertDateTimeToString(this.orderDate, AppConsts.dateFormate);
  }

  //#endregion
}
