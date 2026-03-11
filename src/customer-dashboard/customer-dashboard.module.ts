import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientJsonpModule } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CustomerDashboardRoutingModule } from './customer-dashboard-routing.module';
import { ServiceProxyModule } from '../shared/service-proxies/service-proxy.module';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ModalModule,BsModalService } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxPaginationModule } from 'ngx-pagination';
import { ActivityServiceProxy } from '@shared/service-proxies/service-proxies';
import { NgSelectModule } from '@ng-select/ng-select';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CustomerDashboardComponent } from './customer-dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import {SideNavigationComponent} from './side-navigation/side-navigation.component';
import {HeaderComponent} from './header/header.component';
import { UserPoliciesComponent } from './policies/policies.component';
import { AbpModule } from 'abp-ng2-module';

@NgModule({
  declarations: [
           CustomerDashboardComponent,
           SideNavigationComponent,
           UserPoliciesComponent,
            HeaderComponent,
           ProfileComponent
  ],
 imports: [
       AbpModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpClientJsonpModule,
        CustomerDashboardRoutingModule, 
        ModalModule.forChild(),
        BsDropdownModule,
        CollapseModule,
        TabsModule,
        ServiceProxyModule,
        SharedModule,
        NgxPaginationModule,
        NgSelectModule,
         RouterModule ,
        TypeaheadModule.forRoot(),
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
        BsDatepickerModule.forRoot(),
    ],
    providers: [ActivityServiceProxy, DatePipe,BsModalService]
})
export class CustomerDashboardModule { }
