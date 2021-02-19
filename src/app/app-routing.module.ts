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

import { HomeGuard } from 'src/app/Guardians/home-guardian/home.guard';
import { ClientGuardianGuard } from 'src/app/Guardians/client-guardian/client-guardian.guard';
import { DealerGuard } from 'src/app/Guardians/dealer-guardian/dealer.guard';
import { MaintenanceGuard } from 'src/app/Guardians/maintenance-guardian/maintenance.guard';
import { MovementGuard } from 'src/app/Guardians/movement-guardian/movement.guard';
import { ContractGuard } from 'src/app/Guardians/contract-guardian/contract.guard';
import { QuotaGuard } from 'src/app/Guardians/quota-guardian/quota.guard';
import { WorkorderGuard } from 'src/app/Guardians/workorder-guardian/workorder.guard';
import { DashboardClientGuard } from 'src/app/Guardians/dashboard-client-guardian/dashboard-client.guard';

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
    canActivate: [HomeGuard],
    loadChildren: () => import('../app/Modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'MasterClients',
    canActivate: [ClientGuardianGuard],
    loadChildren: () =>  import('../app/Modules/client/client.module').then(m => m.ClientModule)
  },
  {
    path: 'MasterDealers',
    canActivate: [DealerGuard],
    loadChildren: () => import('../app/Modules/dealer/dealer.module').then(m => m.DealerModule)
  },
  {
    path: 'ItemsAndRoutines',
    canActivate: [MaintenanceGuard],
    loadChildren: () => import('../app/Modules/items-and-routines/items-and-routines.module').then(m => m.ItemsAndRoutinesModule)   
  },
  {
    path: 'MasterMovements',
    canActivate: [MovementGuard],
    loadChildren: () => import('../app/Modules/movement/movement.module').then(m => m.MovementModule)   
  },
  {
    path: 'MasterContracts',
    canActivate: [ContractGuard],
    loadChildren: () => import('../app/Modules/contract/contract.module').then(m => m.ContractModule)    
  }, 
  {
    path: 'QuotaManagement',
    canActivate: [QuotaGuard],
    loadChildren: () => import('../app/Modules/quota-management/quota-management.module').then(m => m.QuotaManagementModule)  
  },
  {
    path: 'WorkOrderManagement',
    canActivate: [WorkorderGuard],
    loadChildren: ()=> import('../app/Modules/work-order-manager/work-order-manager.module').then(m=> m.WorkOrderManagerModule)   
  },
  {
    path: 'DashboardClient',
    canActivate: [DashboardClientGuard],
    loadChildren: () => import('../app/Modules/dashboard-client/dashboard-client.module').then(m => m.DashboardClientModule)   
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
