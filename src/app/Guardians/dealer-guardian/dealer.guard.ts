import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { Observable } from 'rxjs';
import { SecurityModule } from 'src/app/Models/SecurityModule';
import { Router } from '@angular/router';
import { Modules , } from 'src/app/Models/Modules';

@Injectable({
  providedIn: 'root'
})
export class DealerGuard implements CanActivate {

  constructor(
    private router: Router
  ){
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let allowAccess = this.validateModule();   
    if(!allowAccess){
      this.router.navigate(['/Home']);
    }
    return allowAccess;
  }

  
  validateModule():boolean{
    let session = JSON.parse(sessionStorage.getItem('sessionUser'));     
    let rta = false;  
    for (let AppModule of session.group.modules) {
      if (AppModule.id_module == Modules.CONCESIONARIOS) {
        return true;        
      }else{
        rta = false;
      }
    }
     return rta;
  }
  
}
