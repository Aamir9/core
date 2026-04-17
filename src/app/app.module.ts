import { CreateFaultComponent } from './faults/create-fault/create-fault.component';
import { RoomCalenderComponent } from './rooms/room-calender/room-calender.component';
import { CreateRoomComponent } from './rooms/create-room/create-room.component';
import { EditCustomerComponent } from './members/edit-customer/edit-customer.component';
import { CreateCustomerComponent } from './members/create-customer/create-customer.component';
import { CustomerActivitiesComponent } from './activities/customer-activities/customer-activities.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientJsonpModule } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule,BsModalService } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { SharedModule } from '@shared/shared.module';
import { HomeComponent } from '@app/home/home.component';
import { AboutComponent } from '@app/about/about.component';
// tenants
import { TenantsComponent } from '@app/tenants/tenants.component';
import { CreateTenantDialogComponent } from './tenants/create-tenant/create-tenant-dialog.component';
import { EditTenantDialogComponent } from './tenants/edit-tenant/edit-tenant-dialog.component';
// roles
import { RolesComponent } from '@app/roles/roles.component';
import { CreateRoleDialogComponent } from './roles/create-role/create-role-dialog.component';
import { EditRoleDialogComponent } from './roles/edit-role/edit-role-dialog.component';
// users
import { UsersComponent } from '@app/users/users.component';
import { CreateUserDialogComponent } from '@app/users/create-user/create-user-dialog.component';
import { EditUserDialogComponent } from '@app/users/edit-user/edit-user-dialog.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { ResetPasswordDialogComponent } from './users/reset-password/reset-password.component';
// layout
import { HeaderComponent } from './layout/header.component';
import { HeaderLeftNavbarComponent } from './layout/header-left-navbar.component';
import { HeaderLanguageMenuComponent } from './layout/header-language-menu.component';
import { HeaderUserMenuComponent } from './layout/header-user-menu.component';
import { FooterComponent } from './layout/footer.component';
import { SidebarComponent } from './layout/sidebar.component';
import { SidebarLogoComponent } from './layout/sidebar-logo.component';
import { SidebarUserPanelComponent } from './layout/sidebar-user-panel.component';
import { SidebarMenuComponent } from './layout/sidebar-menu.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarComponent } from './calendar/calendar.component';
import { ActivitiesCalendarComponent } from './activities-calendar/activities-calendar.component';
import { ActivitiesComponent } from './activities/activities.component';
import { ActivityServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditActivityComponent } from './activities/edit-activity/edit-activity.component';
import { CustomersComponent } from './members/customers.component';
import { RememberReportsComponent } from './remember-reports/remember-reports.component';
import { CreateActivityComponent } from './activities/create-activity/create-activity.component';
import { EyeToolComponent } from './eye-tool/eye-tool.component';
import { EyeHistoryComponent } from './eye-tool/eye-history/eye-history.component';
import { EyeResultComponent } from './eye-tool/eye-result/eye-result.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { InvoiceLinesComponent } from './invoice-lines/invoice-lines.component';
import { GroupsComponent } from './groups/groups.component';
import { EditGroupComponent } from './groups/edit-group/edit-group.component';
import { CreateGroupComponent } from './groups/create-group/create-group.component';
import { InvitedActivitiesComponent } from './invited-activities/invited-activities.component';
import { ImportEconomicDataComponent } from './import-economic-data/import-economic-data.component';
import { AddEconomicGrantsComponent } from './import-economic-data/add-economic-grants/add-economic-grants.component';
import { CreateInvitedActivityComponent } from './invited-activities/create-invited-activity/create-invited-activity.component';
import { TasksComponent } from './tasks/tasks.component';
import { CreateTaskComponent } from './tasks/create-task/create-task.component';
import { ActivityInviteComponent } from './activity-invite/activity-invite.component';
import { CreateInviteComponent } from './activity-invite/create-invite/create-invite.component';
import { ActivityInviteDetailsComponent } from './activity-invite/activity-invite-details/activity-invite-details.component';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { CustomerDetailsComponent } from './members/customer-details/customer-details.component';
import { PhoneCallActivityComponent } from './activities/phone-call-activity/phone-call-activity.component';
import { SmsActivityComponent } from './activities/sms-activity/sms-activity.component';
import { EmailActivityComponent } from './activities/email-activity/email-activity.component';
import { ProductsComponent } from './products/products.component';
import { ProductGroupsComponent } from './product-groups/product-groups.component';
import { RoomsComponent } from './rooms/rooms.component';
import { CreateProductGroupComponent } from './product-groups/create-product-group/create-product-group.component';
import { EditProductGroupComponent } from './product-groups/edit-product-group/edit-product-group.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { CreateSupplierComponent } from './suppliers/create-supplier/create-supplier.component';
import { EditSupplierComponent } from './suppliers/edit-supplier/edit-supplier.component';
import { OrdersComponent } from './orders/orders.component';
import { CreateOrderComponent } from './orders/create-order/create-order.component';
import { EditOrderComponent } from './orders/edit-order/edit-order.component';
import { CreateProductComponent } from './products/create-product/create-product.component';
import { EditProductComponent } from './products/edit-product/edit-product.component';
import { DetailsGroupComponent } from './groups/details-group/details-group.component';
import { CustomersGroupComponent } from './groups/customers-group/customers-group.component';
import { CustomerInvitesComponent } from './members/customer-invites/customer-invites.component';
import { CustomerInviteDetailsComponent } from './members/customer-invite-details/customer-invite-details.component';
import { FaultsComponent } from './faults/faults.component';
import { CreateInvoiceComponent } from './invoices/create-invoice/create-invoice.component';
import { CustomerBookingsComponent } from './members/customer-bookings/customer-bookings.component';
import { CustomerBookingDetailsComponent } from './members/customer-booking-details/customer-booking-details.component';
import { FaultDetailComponent } from './faults/fault-detail/fault-detail.component';
import { CategoriesComponent } from './categories/categories.component';
import { BrandsComponent } from './brands/brands.component';
import { CreateBrandComponent } from './brands/create-brand/create-brand.component';
import { EditBrandComponent } from './brands/edit-brand/edit-brand.component';
import { MenuConfigurationComponent } from './configuration/menu-configuration/menu-configuration.component';
import { ConfigurationPageComponent } from './configuration/configuration-page/configuration-page.component';
import { ContentConfigurationComponent } from './configuration/content-configuration/content-configuration.component'
import { ProductSerialDialogComponent } from './products/product-serial-dialog/product-serial-dialog.component';
import { ItemsComponent } from 'items/items.component';
import { CreateProductItemsComponent } from 'items/create-product-items/create-product-items.component';
import { CreateItemsComponent } from 'items/create-items/create-items.component';
import { EditItemsComponent } from 'items/edit-items/edit-items.component';
import { CreateProductItemActivityDialogComponent } from './activities/create-product-item-activity-dialog/create-product-item-activity-dialog.component';
import { AddSerialNumberDialogComponent } from './invoices/AddSerialNumberDialog/AddSerialNumberDialog.component';
import { NgSelectModule } from '@ng-select/ng-select';
import {WebShopComponent} from './web-shop/web-shop.component';
import {CartItemsComponent} from './cart-items/cart-items.component';
import { CreateCategoryComponent } from './categories/create-category/create-category.component';
import { EditCategoryComponent } from './categories/edit-category/edit-category.component';
import { CustomerChatComponent } from './members/customer-details/customer-chat/customer-chat.component';
import { AddCustomerToGroupDialogComponent } from './members/customer-details/AddCustomerToGroupDialog/AddCustomerToGroupDialog.component';
import { SubCustomersComponent} from './members/customer-details/sub-customers/sub-customers.component';
import { SubCustomerComponent} from './members/customer-details/sub-customers/sub-customer/sub-customer.component';
import { DetailTicketComponent } from './tickets/detail-ticket/detail-ticket.component';
import { CreateTicketComponent } from './tickets/create-ticket/create-ticket.component';
import { EditTicketComponent } from './tickets/edit-ticket/edit-ticket.component';
import { TicketsComponent } from './tickets/tickets.component';
import { SitesComponent } from './sites/sites.component';
import { CreateSiteComponent } from './sites/create-site/create-site.component';
import { EditSiteComponent } from './sites/edit-site/edit-site.component';
import { DetailSiteComponent } from './sites/detail-site/detail-site.component';
import { DetailsTenantComponent } from './tenants/details-tenant/details-tenant.component';
import { UploadFilesComponent } from './faults/upload-files/upload-files.component';
import { CreatePhoneCallAcitvityDialogComponent } from './activities/create-phone-call-acitvity-dialog/create-phone-call-acitvity-dialog.component';
import { ReceivePackagesComponent } from './receive-packages/receive-packages.component';
import { PackageTypesComponent } from './package-types/package-types.component';
import { CreatePackageTypeComponent } from './package-types/create-package-type/create-package-type.component';
import { UpdatePackageTypeComponent } from './package-types/update-package-type/update-package-type.component';
import { PackageReciveComponent } from './receive-packages/package-recive/package-recive';
import { CreateReceivePackageComponent } from './receive-packages/create-receive-package/create-receive-package.component';
import { DetialsReceivePackageComponent } from './receive-packages/detials-receive-package/detials-receive-package.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { EditReceivePackageComponent } from './receive-packages/edit-receive-package/edit-receive-package.component';
import { SuppliersDetailsComponent } from './suppliers/suppliers-details/suppliers-details.component';
import { DetailUserDialogComponent } from './users/detail-user-dialog/detail-user-dialog.component';
import { ActivityDailogComponentComponent } from './activity-dailog-component/activity-dailog-component.component';
import { ReminderCustomerSupplierDailogComponentComponent } from './reminder-customer-supplier-dailog-component/reminder-customer-supplier-dailog-component.component';
import { EconomicDetailDataComponent } from './import-economic-data/economic-detail-data/economic-detail-data.component';
import { UserPoliciesComponent } from './user-policies/user-policies.component';
import { CreateUserPolicyComponent } from './user-policies/create-user-policy/create-user-policy.component';
import { EditUserPolicyComponent } from './user-policies/edit-user-policy/edit-user-policy.component';
import { EditSubCustomerComponent } from './members/customer-details/sub-customers/edit-sub-customer/edit-sub-customer.component';
import { DetailUserPolicyComponent } from './user-policies/detail-user-policy/detail-user-policy.component';
import { CreateContactPolicyComponent } from './contact-policy/create-contact-policy/create-contact-policy.component';
import { ContactPolicyComponent } from './contact-policy/contact-policy.component';
import { EditContactPolicyComponent } from './contact-policy/edit-contact-policy/edit-contact-policy.component';
import { DetailContactPolicyComponent } from './contact-policy/detail-contact-policy/detail-contact-policy.component';
import { ResetPasswordModalComponent } from '../shared/reset-password-modal/reset-password-modal.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        AboutComponent,
        CartItemsComponent,
        // tenants
        TenantsComponent,
        CreateTenantDialogComponent,
        EditTenantDialogComponent,
        // roles
        RolesComponent,
        CreateRoleDialogComponent,
        EditRoleDialogComponent,
        // users
        UsersComponent,
        CreateUserDialogComponent,
        EditUserDialogComponent,
        ChangePasswordComponent,
        ResetPasswordDialogComponent,
        // layout
        HeaderComponent,
        HeaderLeftNavbarComponent,
        HeaderLanguageMenuComponent,
        HeaderUserMenuComponent,
        FooterComponent,
        SidebarComponent,
        SidebarLogoComponent,
        SidebarUserPanelComponent,
        SidebarMenuComponent,
        CalendarComponent,
        ActivitiesCalendarComponent,
        ActivitiesComponent,
        CustomersComponent,
        RememberReportsComponent,
        CustomerActivitiesComponent,
        EditActivityComponent,
        CreateActivityComponent,
        EyeToolComponent,
        EyeHistoryComponent,
        EyeResultComponent,
        CustomersComponent,
        CreateCustomerComponent,
        EditCustomerComponent,
        InvoicesComponent,
        InvoiceLinesComponent,
        GroupsComponent,
        EditGroupComponent,
        CreateGroupComponent,
        InvitedActivitiesComponent,
        ImportEconomicDataComponent,
        AddEconomicGrantsComponent,
        CreateInvitedActivityComponent,
        TasksComponent,
        CreateTaskComponent,
        ActivityInviteComponent,
        CreateInviteComponent,
        ActivityInviteDetailsComponent,
        CustomerDetailsComponent,
        PhoneCallActivityComponent,
        SmsActivityComponent,
        EmailActivityComponent,
        ProductsComponent,
        ProductGroupsComponent,
        EmailActivityComponent,
        RoomsComponent,
        CreateRoomComponent,
        RoomCalenderComponent,
        CreateProductGroupComponent,
        EditProductGroupComponent,
        SuppliersComponent,
        CreateSupplierComponent,
        EditSupplierComponent,
        OrdersComponent,
        CreateOrderComponent,
        EditOrderComponent,
        CreateProductComponent,
        EditProductComponent,
        DetailsGroupComponent,
        CustomersGroupComponent,
        CustomerInvitesComponent,
        CustomerInviteDetailsComponent,
        FaultsComponent,
        CreateFaultComponent,
        CreateInvoiceComponent,
        CustomerBookingsComponent,
        CustomerBookingDetailsComponent,
        FaultDetailComponent,
        CategoriesComponent,
        CreateCategoryComponent,
        EditCategoryComponent,
        BrandsComponent,
        CreateBrandComponent,
        EditBrandComponent,
        MenuConfigurationComponent,
        ConfigurationPageComponent,
        ContentConfigurationComponent,
        ProductSerialDialogComponent,
        ItemsComponent,
        CreateProductItemsComponent,
        CreateItemsComponent,
        EditItemsComponent,
        CreateProductItemActivityDialogComponent,
        AddSerialNumberDialogComponent,
        AddCustomerToGroupDialogComponent,
        WebShopComponent,
        CustomerChatComponent,
        SubCustomerComponent,
        SubCustomersComponent,
        TicketsComponent,
        DetailTicketComponent,
        CreateTicketComponent,
        EditTicketComponent,
        SitesComponent,
        CreateSiteComponent,
        EditSiteComponent,
        DetailSiteComponent,
        DetailsTenantComponent,
        UploadFilesComponent,
        CreatePhoneCallAcitvityDialogComponent,
        PackageReciveComponent,
        ReceivePackagesComponent,
        PackageTypesComponent,
        CreatePackageTypeComponent,
        UpdatePackageTypeComponent,
        CreateReceivePackageComponent,
        DetialsReceivePackageComponent,
        EditReceivePackageComponent,
        SuppliersDetailsComponent,
        DetailUserDialogComponent,
        ActivityDailogComponentComponent,
        ReminderCustomerSupplierDailogComponentComponent,
        EconomicDetailDataComponent,
        UserPoliciesComponent,
        CreateUserPolicyComponent,
        EditUserPolicyComponent,
        EditSubCustomerComponent,
        DetailUserPolicyComponent,
        CreateContactPolicyComponent,
        ContactPolicyComponent,
        EditContactPolicyComponent,
        DetailContactPolicyComponent,
        ResetPasswordModalComponent,
        // CategoriesComponent,
        // CreateCategoryComponent,
        // EditCategoryComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpClientJsonpModule,
        ModalModule.forChild(),
        BsDropdownModule,
        CollapseModule,
        TabsModule,
        AppRoutingModule,
        ServiceProxyModule,
        SharedModule,
        NgxPaginationModule,
        NgSelectModule,
        TypeaheadModule.forRoot(),
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
        BsDatepickerModule.forRoot(),
    ],
    providers: [ActivityServiceProxy, DatePipe,BsModalService]
})
export class AppModule { }
