
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from '../../layout/layout.component';
import { DealerComponent } from './Componets/dealer/dealer.component';
import { TblDealerComponent } from './Componets/tbl-dealer/tbl-dealer.component';



const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', component: TblDealerComponent },
            { path: 'Dealer', component: DealerComponent },
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

export class DealerRoutingModule {

}