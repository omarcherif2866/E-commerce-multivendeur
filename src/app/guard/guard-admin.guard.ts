// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { Observable } from 'rxjs';
// import { CookieService } from 'ngx-cookie-service';
// import { HttpClient } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root'
// })
// export class GuardAdminGuard implements CanActivate {
//   constructor(private Cookies:CookieService,private router: Router, private cookieService: CookieService, private http: HttpClient) { }
//   canActivate(route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

     

//       this.http.get('/api/auth/getUser', {withCredentials: true}).subscribe(

//         (res: any) => {
//          if (res.role === 'admin') {
//            return true;

//          }else {
//            this.router.navigate(['/accueil']);
//            return false;
//          }

//         },
//         err => {
//           this.router.navigate(['/login']);
//           return false;
//         }
//       );

//       return true;



//   }
// }
