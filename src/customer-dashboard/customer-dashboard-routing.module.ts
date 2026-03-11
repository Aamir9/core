import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerDashboardComponent } from './customer-dashboard.component';
import { UserPoliciesComponent } from './policies/policies.component';
import { ProfileComponent } from './profile/profile.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';

const routes: Routes = [
  {
    path: '',
    component: CustomerDashboardComponent,
    children: [
      { path: 'profile', component: ProfileComponent,canActivate: [AppRouteGuard], },
      { path: 'user-policies', component: UserPoliciesComponent , canActivate: [AppRouteGuard], },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerDashboardRoutingModule { }
