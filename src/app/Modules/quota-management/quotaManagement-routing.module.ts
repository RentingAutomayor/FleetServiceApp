
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from '../../layout/layout.component';
import { QuotaManagementComponent } from './Components/quota-management/quota-management.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', component: QuotaManagementComponent },
        ]     
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)],
    exports: [
        RouterModule
    ]
})

export class QuotaManagementRoutingModule {

}