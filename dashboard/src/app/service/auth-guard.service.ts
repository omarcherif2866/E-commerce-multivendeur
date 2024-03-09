import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.authService.isLoggedIn().pipe(
      map((loggedIn) => {
        if (route.routeConfig && route.routeConfig.path && route.routeConfig.path.includes(':vendorId')) {
          // Si la route contient :vendorId, vérifiez si l'utilisateur est connecté
          if (loggedIn) {
            return true;
          } else {
            // Utilisateur non connecté, redirigez-le vers la page de connexion
            return this.router.createUrlTree(['/home']);
          }
        } else {
          // Si la route ne contient pas :vendorId, elle est accessible par tous les utilisateurs connectés ou non
          return true;
        }
      })
    );
  }
}
