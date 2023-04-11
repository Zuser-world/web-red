import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuardDashboardGuard implements CanActivate {
  statePath : boolean = true;
  constructor(
    private router: Router,
    private toastr: ToastrService,
  ){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.statePath){
      console.log('Bienvenido')
      return this.statePath
    } 

    console.log('You don`t have permission to activate')
    this.toastr.error('You don`t have permission', 'Error')
    this.router.navigate(['/login']);
    return this.statePath
  }
  stateOfPath(valor: boolean){
    this.statePath = valor
  }
}
