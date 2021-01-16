
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from '../../layout/layout.component';
import { DashboardClientComponent } from './Components/dashboard-client/dashboard-client.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', component: DashboardClientComponent },
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

export class DashboardClientRoutingModule {

}