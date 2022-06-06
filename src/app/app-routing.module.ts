import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuard } from './Guardians/auth/auth.guard'
import { LoginComponent } from './Modules/Login/Components/login/login.component'


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'Login',
  },
  {
    path: 'Login',
    component: LoginComponent,
  },
  {
    path: 'Home',
    loadChildren: () =>
      import('../app/Modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'MasterClients',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../app/Modules/client/client.module').then((m) => m.ClientModule),
  },
  {
    path: 'MasterDealers',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../app/Modules/dealer/dealer.module').then((m) => m.DealerModule),
  },
  {
    path: 'ItemsAndRoutines',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        '../app/Modules/items-and-routines/items-and-routines.module'
      ).then((m) => m.ItemsAndRoutinesModule),
  },
  {
    path: 'MasterMovements',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../app/Modules/movement/movement.module').then(
        (m) => m.MovementModule
      ),
  },
  {
    path: 'MasterContracts',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../app/Modules/contract/contract.module').then(
        (m) => m.ContractModule
      ),
  },
  {
    path: 'QuotaManagement',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../app/Modules/quota-management/quota-management.module').then(
        (m) => m.QuotaManagementModule
      ),
  },
  {
    path: 'WorkOrderManagement',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        '../app/Modules/work-order-manager/work-order-manager.module'
      ).then((m) => m.WorkOrderManagerModule),
  },
  {
    path: 'DashboardClient',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../app/Modules/dashboard-client/dashboard-client.module').then(
        (m) => m.DashboardClientModule
      ),
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
