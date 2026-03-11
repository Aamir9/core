import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AbpHttpInterceptor } from 'abp-ng2-module';

import * as ApiServiceProxies from './service-proxies';

@NgModule({
        providers: [
                ApiServiceProxies.RoleServiceProxy,
                ApiServiceProxies.SessionServiceProxy,
                ApiServiceProxies.TenantServiceProxy,
                ApiServiceProxies.UserServiceProxy,
                ApiServiceProxies.TokenAuthServiceProxy,
                ApiServiceProxies.AccountServiceProxy,
                ApiServiceProxies.ConfigurationServiceProxy,
                ApiServiceProxies.UserTypeServiceProxy,
                ApiServiceProxies.EyeToolServiceProxy,
                ApiServiceProxies.CustomerServiceProxy,
                ApiServiceProxies.ActivityServiceProxy,
                ApiServiceProxies.InvoiceServiceProxy,
                ApiServiceProxies.InvoiceLineServiceProxy,
                ApiServiceProxies.GroupServiceProxy,
                ApiServiceProxies.InviteServiceProxy,
                ApiServiceProxies.SyncEconomicDataServiceProxy,
                ApiServiceProxies.CommentServiceProxy,
                ApiServiceProxies.ActivityTaskServiceProxy,
                ApiServiceProxies.CustomFieldServiceProxy,
                ApiServiceProxies.RoomServiceProxy,
                ApiServiceProxies.ProductGroupServiceProxy,
                ApiServiceProxies.SupplierServiceProxy,
                ApiServiceProxies.OrderServiceProxy,
                ApiServiceProxies.ProductServiceProxy,
                ApiServiceProxies.FaultServiceProxy,
                ApiServiceProxies.BookingServiceProxy,
                ApiServiceProxies.CatogoryServiceProxy,
                ApiServiceProxies.BrandServiceProxy,
                ApiServiceProxies.ChatServiceServiceProxy,
                ApiServiceProxies.MenuItemServiceProxy,
                ApiServiceProxies.PageConfigServiceProxy,
                ApiServiceProxies.ProductItemServiceProxy,
                ApiServiceProxies.SubCustomerServiceProxy,
                ApiServiceProxies.TicketServiceProxy,
                ApiServiceProxies.SiteServiceProxy,
                ApiServiceProxies.PackageTypeServiceProxy,
                ApiServiceProxies.PackageServiceProxy,
                ApiServiceProxies.UserPoliciesServiceProxy,

                { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true }
        ]
})
export class ServiceProxyModule { }
