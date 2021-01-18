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

import { ClientGuardianGuard } from 'src/app/Guardians/client-guardian/client-guardian.guard';

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
    canActivate: [ClientGuardianGuard],
    loadChildren: () =>  import('../app/Modules/client/client.module').then(m => m.ClientModule)
  },
  {
    path: 'MasterDealers',
    loadChildren: () => import('../app/Modules/dealer/dealer.module').then(m => m.DealerModule)
  },
  {
    path: 'ItemsAndRoutines',
    loadChildren: () => import('../app/Modules/items-and-routines/items-and-routines.module').then(m => m.ItemsAndRoutinesModule)   
  },
  {
    path: 'MasterMovements',
    loadChildren: () => import('../app/Modules/movement/movement.module').then(m => m.MovementModule)   
  },
  {
    path: 'MasterContracts',
    loadChildren: () => import('../app/Modules/contract/contract.module').then(m => m.ContractModule)    
  }, 
  {
    path: 'QuotaManagement',
    loadChildren: () => import('../app/Modules/quota-management/quota-management.module').then(m => m.QuotaManagementModule)  
  },
  {
    path: 'WorkOrderManagement',
    loadChildren: ()=> import('../app/Modules/work-order-manager/work-order-manager.module').then(m=> m.WorkOrderManagerModule)   
  },
  {
    path: 'DashboardClient',
    loadChildren: () => import('../app/Modules/dashboard-client/dashboard-client.module').then(m => m.DashboardClientModule)   
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
