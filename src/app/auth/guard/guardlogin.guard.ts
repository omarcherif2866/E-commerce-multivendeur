// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
// import { Observable, of } from 'rxjs';
// import { map, catchError } from 'rxjs/operators';  // Import catchError

// import { AuthService } from 'src/app/Service/Auth/auth.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class GuardloginGuard implements CanActivate {
//   constructor(private router: Router, private service: AuthService) {}

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

//     return this.service.getUser({ withCredentials: true}).pipe(
//       map((res: any) => {
//         if (res.length === 0) {
//           // User not authenticated, redirect to login
//           this.router.navigate(['/login']);
//           return false;
//         } else if (res.role === 'client') {
//           // User is a client, redirect to accueil
//           this.router.navigate(['/accueil']);
//           return true;
//         } else {
//           // User is not a client, redirect to dashboard
//           this.router.navigate(['/dashboard']);
//           return true;
//         }
//       }),
//       catchError((err: any) => {  // Specify the type of 'err'
//         // Handle unauthorized error, e.g., redirect to login page
//         this.router.navigate(['/login']);
//         return of(false);
//       })
//     );
//   }
// }
