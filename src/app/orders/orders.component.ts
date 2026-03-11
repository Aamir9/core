import { EditOrderComponent } from './edit-order/edit-order.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { EntityDto, OrderDtoPagedResultDto, OrderServiceProxy } from './../../shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { Component, Injector, OnInit } from '@angular/core';
import { OrderDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';

class PagedOrdersRequestDto extends PagedRequestDto {
  keyword: string;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  animations: [appModuleAnimation()]
})
export class OrdersComponent extends PagedListingComponentBase<OrderDto> implements OnInit {

  orders: OrderDto[] = [];
  keyword = '';

  constructor(
    injector: Injector,
    private _orderService: OrderServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  list(
    request: PagedOrdersRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;

    this._orderService
      .getAll(request.keyword, request.skipCount, request.maxResultCount)
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: OrderDtoPagedResultDto) => {
        this.orders = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  delete(order: OrderDto): void {
    abp.message.confirm(
      this.l('RoleDeleteWarningMessage', order.orderNumber),
      undefined,
      (result: boolean) => {
        // if (result) {
        //   this._orderService
        //     .delete(order.id)
        //     .pipe(
        //       finalize(() => {
        //         abp.notify.success(this.l('SuccessfullyDeleted'));
        //         this.refresh();
        //       })
        //     )
        //     .subscribe(() => {});
        // }
      }
    );
  }

  createOrder(): void {
    this.showCreateOrEditOrderDialog();
  }

  editOrder(order: OrderDto): void {
    this.showCreateOrEditOrderDialog(order.id);
  }

  showCreateOrEditOrderDialog(id?: number): void {
    let createOrEditOrderDialog: BsModalRef;
    if (!id) {
      createOrEditOrderDialog = this._modalService.show(
        CreateOrderComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      createOrEditOrderDialog = this._modalService.show(
        EditOrderComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditOrderDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }
  async markOrderAsReceived(order: OrderDto) {
    let input = new EntityDto();
    input.id = order.id;
    await this._orderService.markOrderAsReceived(input).toPromise();
    this.refresh();
  }
}
