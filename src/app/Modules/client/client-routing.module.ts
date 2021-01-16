
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from '../../layout/layout.component';
import { ClientComponent } from './Components/Client/client.component';
import { TblClientComponent } from './Components/tbl-client/tbl-client.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', component: TblClientComponent },
            { path: 'Client', component: ClientComponent },
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

export class ClientRoutingModule {

}