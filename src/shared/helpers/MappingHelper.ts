import { DateHelper } from './DateHelper';
import { AppConsts } from './../AppConsts';
import { OrderDto, OrderLineDto, OrderLineListDto, UpdateOrderDto } from './../service-proxies/service-proxies';
export class MappingHelper {
    
    public static mapOrderLineListDtoToOrderLineDto(orderLine: OrderLineListDto): OrderLineDto {
        let orderLineToReturn = new OrderLineDto();
        orderLineToReturn.productId = orderLine.productId;
        orderLineToReturn.quantity = orderLine.quantity;
        orderLineToReturn.price = orderLine.price;
        orderLineToReturn.promissedDate = DateHelper.convertDateTimeToString(orderLine.promissedDate, AppConsts.dateFormate);
        orderLineToReturn.total = orderLine.total;
        return orderLineToReturn;
    }

  public static  mapOrderDtoToUpdateOrderDto(orderData: OrderDto): UpdateOrderDto {
        let order = new UpdateOrderDto();
        order.id=orderData.id;
        order.orderNumber = orderData.orderNumber;
        order.supplierId = orderData.supplierId;
        order.employeeId = orderData.employeeId;
        order.note = orderData.note;
        return order;
      }
}