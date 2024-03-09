import { ChangeDetectorRef, Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Emitters } from 'src/app/emitters/emitter';
import { DOCUMENT } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ScriptService } from './../../Service/script/script.service';
import { Subject } from 'rxjs/internal/Subject';
import { Subscription, Observable, timer } from 'rxjs';
import * as moment from 'moment';
import { SocketIOServiceService } from './../../Service/SocketIOService/socket-ioservice.service';
import { Category } from 'src/app/Models/category';
import { CategoryService } from 'src/app/Service/category/category.service';
import { Cart, CartItem } from 'src/app/Models/cart';
import { CartService } from 'src/app/Service/cart/cart.service';
import { AuthService } from 'src/app/Service/Auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {

  itemsQuantity = 0;
  private _cart: Cart = { items: [] };
  get cart(): Cart {
    return this._cart;
  }

  set cart(cart: Cart) {
    this._cart = cart;
    this.itemsQuantity = cart.items.map((item) => item.quantity).reduce((prev, current) => prev + current, 0);
  }
  categories: Category[] | undefined;
  categoriesSubscription: Subscription | undefined;

  authenticated = false;
  ListCategorie: any;
  ListPanier: any;
  login: string = '';
  x: number = 0;
  idUser: any;
  ListCountPanier: any;
  totalePrixPanier: any;
  tt: number = 0;

  constructor(
    private service: CategoryService,
    private cartService: CartService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private renderer: Renderer2,
    private ScriptServiceService: ScriptService,
    private toastr: ToastrService,
    private http: HttpClient,
    private currentRoute: ActivatedRoute,
    private SocketIOServiceService: SocketIOServiceService
  ) {}

  ngOnInit(): void {
    const id = localStorage.getItem('user_id');
    this.idUser= id;
    this.authService.isLoggedIn().subscribe((loggedIn) => {
      this.authenticated = loggedIn;
      console.log('Utilisateur connecté ?', loggedIn);
      console.log('Utilisateur connecté ?', this.idUser);
  
      // Si l'utilisateur est connecté, récupérez son ID
      if (loggedIn) {
        this.authService.getUserProfile(id).subscribe((user: any) => {
          if (user && user.id) { // Vérifiez si l'objet utilisateur et son ID existent
            this.idUser = user.id; // Utilisez la propriété idUser au lieu de id
            console.log('ID de l\'utilisateur connecté :', this.idUser); // Utilisez également idUser ici
          }
        });
      }
    });

    this.categoriesSubscription = this.service
      .getAllCategories()
      .subscribe((response: Category[]) => {
        this.categories = response;
        this.cdr.detectChanges(); // Force an update
      });
      console.log(this.itemsQuantity)

      this.cart = this.cartService.getCartValue();

      // Abonnez-vous aux changements du panier
      this.cartService.cartSubject.subscribe((cart: Cart) => {
        this.cart = cart;
      });
  }

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  getPlatImageUrl(images: string | undefined): string {
    // Vérifiez si l'image est définie
    if (images) {
      return `http://localhost:9090/img/${images}`;
    } else {
      // Remplacez par une URL ou une image par défaut si nécessaire
      return 'http://localhost:9090/default-image.jpg';
    }
  }

  onRemoveFromCart(item: CartItem) {
    this.cartService.removeFromCart(item);
  }

  logout(): void {
    this.authService.logout(); // Appelez la méthode logout() du service AuthService
    this.toastr.success('Vous etes déconnecté');
    this.router.navigate(['/accueil']);

  }
  
  // deletePanier(idProduit: number) {
  //   this.http
  //     .get('api/auth/getUser', { withCredentials: true })
  //     .subscribe((user: any) => {
  //       this.authenticated = true;

  //       const id = user.id;

  //       this.http
  //         .delete('api/panier/deletePanier/' + id + '/' + idProduit)
  //         .subscribe((data: any) => {
  //           this.toastr.success('Produit supprimé avec succès');
  //           this.ngOnInit();
  //           this.SocketIOServiceService.emit('idusercountprdouit', id);
  //         });
  //     });
  // }

  // logout(): void {
  //   this.http
  //     .post('api/auth/logout', {}, { withCredentials: true })
  //     .subscribe(() => (this.authenticated = false));
  //   this.router.navigate(['/accueil']);
  // }
  // showallCat() {
  //   this.http.get('api/categories/affichercategorie').subscribe((data: any) => {
  //     this.ListCategorie = data;

  //     console.log(this.ListCategorie);
  //   });
  // }
}
