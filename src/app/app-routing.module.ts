import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientComponent } from './Modules/client/client.component';
import { TblClientComponent } from './Modules/tbl-client/tbl-client.component';
import { DealerComponent } from './Modules/dealer/dealer.component';
import { TblDealerComponent } from './Modules/tbl-dealer/tbl-dealer.component';
import { ItemsAndRoutinesComponent } from './Modules/items-and-routines/items-and-routines.component';
import { ContractComponent } from './Modules/contract/contract.component';
import { TblContractComponent } from './Modules/tbl-contract/tbl-contract.component'; 



const routes: Routes = [{ path: 'MasterClients/Client', component: ClientComponent },
{ path: 'MasterClients', component: TblClientComponent },
{ path: 'MasterDealers/Dealer', component: DealerComponent },
{ path: 'MasterDealers', component: TblDealerComponent },
{ path: 'ItemsAndRoutines', component: ItemsAndRoutinesComponent},
{ path: 'MasterContracts' , component: TblContractComponent},
{ path: 'MasterContracts/Contract' , component:ContractComponent},
{ path: '', redirectTo: '/MasterClients', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
