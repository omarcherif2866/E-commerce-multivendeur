import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/Service/Auth/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GuardGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.authService.isLoggedIn().pipe(
      map((loggedIn) => {
        console.log('Is user logged in?', loggedIn);
        console.log('Requested path:', route.routeConfig ? route.routeConfig.path : 'unknown');
        if (route.routeConfig && route.routeConfig.path && route.routeConfig.path.includes(':vendorId')) {
          if (loggedIn && localStorage.getItem('user_roles') === 'vendeur') {
            return true; // L'utilisateur est connecté et est un vendeur, autoriser l'accès
          } else {
            // Utilisateur non connecté ou n'est pas un vendeur, redirigez-le vers la page de connexion
            return this.router.createUrlTree(['/login']);
          }
        } else {
          // Si la route ne contient pas :vendorId, elle est accessible par tous les utilisateurs connectés ou non
          return true;
        }
      })
    );
  } 
}
