import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Modules , } from 'src/app/Models/Modules';

@Injectable({
  providedIn: 'root'
})
export class HomeGuard implements CanActivate {
  constructor(
    private router: Router
  ){ }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const allowAccess = true;
      // if(!allowAccess){
      //   this.router.navigate(['/Login']);
      // }
      return allowAccess;
    }


    // validateModule():boolean{
    //   let session = JSON.parse(sessionStorage.getItem('sessionUser'));
    //   let rta = true;
    //    return rta;
    // }


}
