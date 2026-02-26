import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Role } from 'src/app/Models/role';
import { User } from 'src/app/Models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private loggedInSubject: BehaviorSubject<boolean>;
  private previousUrl: string = '/'; // Initialisez l'URL précédente avec '/' par défaut

  constructor(private http: HttpClient, private router: Router) {
    // Initialisez le BehaviorSubject à false ou à la valeur stockée dans localStorage
    const storedLoggedIn = localStorage.getItem('loggedIn');
    this.loggedInSubject = new BehaviorSubject<boolean>(storedLoggedIn ? JSON.parse(storedLoggedIn) : false);


    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.previousUrl = this.router.url;
      }
    });
  }

  createAcount(data:any){
    return this.http.post<User>(`${this.apiUrl}/api/signup`,data)
  }



  signIn(credentials: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/api/signin`, credentials).pipe(
      tap((user) => {
        // Mettez à jour l'état de connexion à true dès que l'utilisateur se connecte avec succès
        this.setLoggedIn(true);
        // Enregistrez l'URL précédente avant de rediriger l'utilisateur
        this.previousUrl = this.getPreviousUrl();
        // Redirigez l'utilisateur vers la page précédente ou la page d'accueil après une connexion réussie
        if (this.previousUrl && !this.previousUrl.includes('/register')) {
          this.router.navigateByUrl(this.previousUrl);
        } else {
          this.router.navigateByUrl('/');
        }
      })
    );
  }
  

  getRoles() {
    return this.http.get<Role[]>(`${this.apiUrl}/role/roles`);
  }

  getUser(data:any) {
    return this.http.get<User[]>(`${this.apiUrl}/api/user`);
  }

  setLoggedIn(status: boolean) {
    this.loggedInSubject.next(status); // Mettez à jour l'état de connexion avec le BehaviorSubject
    // Stockez également l'état de connexion dans le localStorage
    localStorage.setItem('loggedIn', JSON.stringify(status));
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedInSubject.asObservable(); // Retournez le BehaviorSubject en tant qu'Observable
  }

  getPreviousUrl(): string {
    return this.previousUrl;
  }

  getUserProfile(id:any) {
    return this.http.get(`${this.apiUrl}/api/user/${id}`)
  }

  logout(): void {
    this.setLoggedIn(false); // Définissez loggedIn sur false
    localStorage.removeItem('loggedIn'); // Supprimez l'état de connexion du localStorage
    this.router.navigateByUrl('/login'); // Redirigez l'utilisateur vers la page de connexion
  }
  

  updateUserProfile(id: string, formData: FormData ): Observable<User> {
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   throw new Error('No token provided!'); // Gérer le cas où le token est manquant ou invalide
    // }

    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // const url = `${this.apiUrl}/api/user/profile/${id}`;

    return this.http.put<User>(`${this.apiUrl}/api/user/profile/${id}`, formData);
  }

  updateUserPassword(id: any, password: string, newPassword: string): Observable<any> {
    const data = {
      password: password,
      newpassword: newPassword
    };
  
    return this.http.put<any>(`${this.apiUrl}/api/user/password/${id}`, data);
  }

  resetPassword(data:any){
    return this.http.post(`${this.apiUrl}/api/user/getforgot-password`,data)

  }
  
}
