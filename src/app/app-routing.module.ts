import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientComponent } from './Modules/client/client.component';
import { TblClientComponent } from './Modules/tbl-client/tbl-client.component';
import { DealerComponent } from './Modules/dealer/dealer.component';
import { TblDealerComponent } from './Modules/tbl-dealer/tbl-dealer.component';
import { ItemsAndRoutinesComponent } from './Modules/items-and-routines/items-and-routines.component';
import { ContractComponent } from './Modules/contract/contract.component';
import { TblContractComponent } from './Modules/tbl-contract/tbl-contract.component'; 
import { TblMovementsComponent } from './Modules/tbl-movements/tbl-movements.component';
import { MovementComponent } from './Modules/movement/movement.component';
import { CheckListVehicleModelComponent } from './Components/check-list-vehicle-model/check-list-vehicle-model.component';
import { QuotaManagementComponent } from './Modules/quota-management/quota-management.component';
import { WorkOrderManagerComponent } from './Modules/work-order-manager/work-order-manager.component';
import { DashboardClientComponent } from './Modules/dashboard-client/dashboard-client.component';
import { LoginComponent } from './Components/login/login.component';
import { FinancialInformationByClientComponent } from './Components/financial-information-by-client/financial-information-by-client.component';




const routes: Routes = [{ path: 'MasterClients/Client', component: ClientComponent },
// { path: ' ', component: AppComponent },
{ path: 'Login', component: LoginComponent },
{ path: 'MasterClients', component: TblClientComponent },
{ path: 'MasterDealers/Dealer', component: DealerComponent },
{ path: 'MasterDealers', component: TblDealerComponent },
{ path: 'ItemsAndRoutines', component: ItemsAndRoutinesComponent},
{ path: 'MasterContracts' , component: TblContractComponent},
{ path: 'MasterContracts/Contract' , component:ContractComponent},
{ path: 'MasterMovements' , component:TblMovementsComponent},
{ path: 'MasterMovements/Movement' , component:MovementComponent},
{ path: 'QuotaManagement', component: QuotaManagementComponent},
{ path: 'WorkOrderManagement', component: WorkOrderManagerComponent},
{ path: 'DashboardClient', component: DashboardClientComponent},
{ path: 'check', component: FinancialInformationByClientComponent},
{ path: '', redirectTo: '/Login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
