import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { Observable } from 'rxjs'
import { Module } from 'src/app/Models/Module'
import { AlertService } from 'src/app/services/alert.service'

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private _alert: AlertService,
        private router: Router
    ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const path = route.url[0].path
    const modules: Module[] = JSON.parse(sessionStorage.getItem('sessionUser'))
      ?.group.modules;
      const module = modules.find(module => module.path.includes(path)); 
    if(!module){
        this._alert.error('No tiene permitido entrar a esta funcionalidad.');
        this.router.navigateByUrl('/Home');
        return false;
    }
    return true;
  }
}
