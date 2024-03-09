import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ScriptService } from './../../Service/script/script.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from '../header/header.component';
import { SocketIOServiceService } from 'src/app/Service/SocketIOService/socket-ioservice.service';
import { Cart, CartData, CartItem } from 'src/app/Models/cart';
import { CartService } from 'src/app/Service/cart/cart.service';
import { AuthService } from 'src/app/Service/Auth/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  dataSource: Array<CartItem> = [];
  cart: Cart = { items: [] };
  displayedColumns: Array<string> = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'attributes', // Ajoutez cette colonne
    'action'
  ];
  listProduit: any;
  totalePrixPanier: any;
  authenticated = false;
  quantites: any;
  @ViewChild('inputnumber') inputnumber!: ElementRef;
  idproduit!: number;
  nomproduit!: string;

  constructor(
    private router: Router,
    private service: CartService,
    private authService : AuthService,
    private http: HttpClient,
    private toastr: ToastrService,
    private SocketIOServiceService: SocketIOServiceService

  ) {}

  ngOnInit(): void {

    

    this.service.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    });


    this.SocketIOServiceService.listen('panier').subscribe((data: any) => {
      this.listProduit = data.panier;
    });
    try {
      this.http
        .get('api/auth/getUser', { withCredentials: true })
        .subscribe((user: any) => {
          this.authenticated = true;

          const id = user.id;
          this.http
            .get('api/panier/afficherPanierparId/' + id)
            .subscribe((data: any) => {
              this.listProduit = data;
            }),
            this.http
              .get('api/panier/totaleprixpanier/' + id)
              .subscribe((data: any) => {
                this.totalePrixPanier = data;
                console.log(this.totalePrixPanier);
              });
        });
    } catch (error) {
      this.authenticated = false;
    }
  }

  update() {
    const quantite = this.inputnumber.nativeElement.value;
    console.log(quantite);

    if (this.inputnumber.nativeElement.value == '') {
      this.toastr.error('quantite invalide');
    } else {
      console.log('***********************************');
      console.log(this.idproduit);
      this.http
        .get('api/auth/getUser', { withCredentials: true })
        .subscribe((user: any) => {
          this.authenticated = true;

          const id = user.id;

          this.http
            .put('api/panier/updatePanier', {
              id,
              quantite,
              idProduit: this.idproduit,
            })
            .subscribe(
              (data: any) => {
                this.toastr.success('Produit update avec succès');
                this.SocketIOServiceService.emit('idusercountprdouit', id);
                this.ngOnInit();
              },
              (error) => {
                this.toastr.error('produit hors stock');
              }
            );
        });
    }
  }

  hassen(idProduit: number, nom: string) {
    this.nomproduit = nom;
    this.idproduit = idProduit;
  }

  deletePanier(idProduit: number) {
    this.http
      .get('api/auth/getUser', { withCredentials: true })
      .subscribe((user: any) => {
        this.authenticated = true;

        const id = user.id;

        this.http
          .delete('api/panier/deletePanier/' + id + '/' + idProduit)
          .subscribe((data: any) => {
            this.toastr.success('Produit supprimé avec succès');
            this.http
              .get('api/panier/afficherPanierparId/' + idProduit)
              .subscribe((data: any) => {
                this.listProduit = data;
                this.SocketIOServiceService.emit('idusercountprdouit', id);
                this.ngOnInit();
              });
          });
      });
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

  getTotal(items: Array<CartItem>): number {
    return this.service.getTotal(items);
  }

  onClearCart() {
    this.service.ClearCart();
  }

  onRemoveFromCart(item: CartItem) {
    this.service.removeFromCart(item);
  }

  onAddQuantity(item: CartItem) {
    const vendorId = item.vendorId;
    this.service.addToCart(item, vendorId);
  }

  onRemoveQuantity(item: CartItem) {
    this.service.removeQuantity(item);
  }



  checkOut() {
    console.log('Tentative de paiement...');

    this.authService.isLoggedIn().subscribe(loggedIn => {
      console.log('Utilisateur connecté ?', loggedIn);

      if (loggedIn) {
        console.log("Utilisateur connecté, procéder au paiement...");
        // Récupérer l'identifiant du client
        const clientId = localStorage.getItem('user_id');
        if (!clientId) {
          console.error('Identifiant du client non trouvé');
          return;
        }
  
        // Préparer les données de la commande
        const cartItems: CartData[] = this.cart.items.map((data) => {
          return {
            productId: data.id,
            quantity: data.quantity,
            stockAttribute: data.attributes, // Assurez-vous que "attributes" correspond à ce que le serveur attend
          };
        });
  
        const data = {
          items: cartItems,
          clientId: clientId,
        };
  
        // Envoyer la requête de paiement
        this.service.checkOut(data, clientId).subscribe({
          next: (res) => {
            // Mettre à jour le panier avec les nouveaux articles après l'achat
            this.cart.items = res.globalOrder.items;
            this.dataSource = this.cart.items;
            this.router.navigate(['/checkout']);
            console.log("Commande ajoutée avec succès");

            // Afficher un message de succès
            // alert('Commande ajoutée avec succès');
          },
          error: (err) => {
            // Afficher un message d'erreur précis
            alert(`Erreur lors de l'ajout de la commande: ${err.message}`);
          }
        });
      } else {
        console.log("Utilisateur non connecté, redirection vers la page de connexion...");
        this.router.navigate(['/login']);
      }
    });
  }
  
  
}
