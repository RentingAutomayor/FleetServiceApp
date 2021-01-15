import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientComponent } from './Modules/client/Components/Client/client.component';
import { TblClientComponent } from './Modules/client/Components/tbl-client/tbl-client.component';
import { DealerComponent } from './Modules/dealer/Componets/dealer/dealer.component';
import { TblDealerComponent } from './Modules/dealer/Componets/tbl-dealer/tbl-dealer.component';
import { ItemsAndRoutinesComponent } from './Modules/items-and-routines/Components/items-and-routines/items-and-routines.component';
import { ContractComponent } from './Modules/contract/Components/Contract/contract.component';
import { TblContractComponent } from './Modules/contract/Components/tbl-contract/tbl-contract.component';
import { TblMovementsComponent } from './Modules/movement/Components/tbl-movements/tbl-movements.component';
import { MovementComponent } from './Modules/movement/Components/movement/movement.component';
import { QuotaManagementComponent } from './Modules/quota-management/Components/quota-management/quota-management.component';
import { WorkOrderManagerComponent } from './Modules/work-order-manager/Components/work-order-manager/work-order-manager.component';
import { DashboardClientComponent } from './Modules/dashboard-client/Components/dashboard-client/dashboard-client.component';
import { LoginComponent } from './Modules/Login/Components/login/login.component';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'Login'
  },
  {
    path: 'Login',
    component: LoginComponent
  },
  {
    path: 'Home',
    component: LayoutComponent,
    pathMatch: 'full'
  },
  {
    path: 'MasterClients',
    component: LayoutComponent,
    children: [
      { path: '', component: TblClientComponent },
      { path: 'Client', component: ClientComponent },
    ]
  },
  {
    path: 'MasterDealers',
    component: LayoutComponent,
    children: [
      { path: '', component: TblDealerComponent },
      { path: 'Dealer', component: DealerComponent },
    ]
  },
  {
    path: 'ItemsAndRoutines',
    component: LayoutComponent,
    children: [
      { path: '', component: ItemsAndRoutinesComponent },
    ]
  },
  {
    path: 'MasterContracts',
    component: LayoutComponent,
    children: [
      { path: '', component: TblContractComponent },
      { path: 'Contract', component: ContractComponent },
    ]
  },
  {
    path: 'MasterMovements',
    component: LayoutComponent,
    children: [
      { path: '', component: TblMovementsComponent },
      { path: 'Movement', component: MovementComponent },
    ]
  },
  {
    path: 'QuotaManagement',
    component: LayoutComponent,
    children: [
      { path: '', component: QuotaManagementComponent },
    ]
  },

  {
    path: 'WorkOrderManagement',
    component: LayoutComponent,
    children: [
      { path: '', component: WorkOrderManagerComponent },
    ]
  },
  {
    path: 'DashboardClient',
    component: LayoutComponent,
    children: [
      { path: '', component: DashboardClientComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
