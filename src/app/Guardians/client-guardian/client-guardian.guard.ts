import { Injectable } from '@angular/core'
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { Router } from '@angular/router'
import { Observable } from 'rxjs'
import { SecurityModule } from 'src/app/Models/SecurityModule'
import { Modules } from 'src/app/Models/Modules'

@Injectable({
  providedIn: 'root',
})
export class ClientGuardianGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const allowAccess = this.validateModule()
    if (!allowAccess) {
      this.router.navigate(['/Home'])
    }
    return allowAccess
  }

  validateModule(): boolean {
    const session = JSON.parse(sessionStorage.getItem('sessionUser'))
    let rta = false
    for (const AppModule of session.group.modules) {
      if (AppModule.id_module == Modules.CLIENTES) {
        return true
      } else {
        rta = false
      }
    }
    return rta
  }
}
