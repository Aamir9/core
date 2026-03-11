import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: '/app/customers', pathMatch: 'full' },
    {
        path: 'account',
        loadChildren: () => import('account/account.module').then(m => m.AccountModule),
        data: { preload: true }
    },
    {
        path: 'app',
        loadChildren: () => import('app/app.module').then(m => m.AppModule),
        data: { preload: true }
    },
       {
        path: 'client',
        loadChildren: () => import('customer-dashboard/customer-dashboard.module').then(m => m.CustomerDashboardModule),
        data: { preload: true }
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class RootRoutingModule { }
