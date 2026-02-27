import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ElementRef,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { ScriptService } from '../../Service/script/script.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Emitters } from 'src/app/emitters/emitter';
import { Observable, filter } from 'rxjs';
import { SocketIOServiceService } from 'src/app/Service/SocketIOService/socket-ioservice.service';
import { Category } from 'src/app/Models/category';
import { ProductService } from 'src/app/Service/Product/product.service';
import { CategoryService } from 'src/app/Service/category/category.service';
import { Attribute, Product } from 'src/app/Models/product';
import { Cart, CartItem } from 'src/app/Models/cart';
import { CartService } from 'src/app/Service/cart/cart.service';
const SCRIPT_PATH_LIST = [
  'assets/client/js/jquery-3.3.1.min.js',

  'assets/client/js/menu.js',

  'assets/client/js/lazysizes.min.js',

  'assets/client/js/price-range.js',

  'assets/client/js/slick.js',

  'assets/client/js/bootstrap.bundle.min.js',

  'assets/client/js/bootstrap-notify.min.js',

  'assets/client/js/theme-setting.js',
  'assets/client/js/script.js',
];

@Component({
  selector: 'app-singlepage-product',
  templateUrl: './singlepage-product.component.html',
  styleUrls: ['./singlepage-product.component.css'],
})
export class SinglepageProductComponent implements OnInit {
  @ViewChild('inputnoter1') inputnoter1!: ElementRef;
  @ViewChild('inputnoter2') inputnoter2!: ElementRef;
  @ViewChild('inputnoter3') inputnoter3!: ElementRef;
  @ViewChild('inputnoter4') inputnoter4!: ElementRef;
  @ViewChild('inputnoter5') inputnoter5!: ElementRef;

  id: any;
data: any = null;
  @Input() product: Product | undefined;
  itemsQuantity = 0;
  private _cart: Cart = { items: [] };
  category$!: Observable<Category>;

  @Input()
  get cart(): Cart {
    return this._cart;
  }

  set cart(cart: Cart) {
    this._cart = cart;
    this.itemsQuantity = cart.items.map((item) => item.quantity).reduce((prev, current) => prev + current, 0);
  }

  message: any;
  public route: any = '';
  idproduitss: any;
  nom: any;
  prix: any;
  image: any;
  Description: any;
  quantite: any;
  promotion: any;
  date_exp: any;
  prixold: any;
  numberpromotion: any;
  image2: any;
  idProduit: any;
  countlike: any;
  numberRate: number = 0;

  constructor(
    private ScriptServiceService: ScriptService,
    private _router: Router,
    private renderer: Renderer2,
    private service: ProductService,
    private categoryService:CategoryService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private http: HttpClient,
    private currentRoute: ActivatedRoute,
    private router: Router,
    private SocketIOServiceService: SocketIOServiceService
  ) {
    this.route = this._router.url;

  }

  ngOnInit() {

    console.log(this.route);
    const segments = this.route.split('/');
    this.id = segments[segments.length - 1]; // Initialisation de this.id avec l'ID extrait de l'URL
    console.log(this.id);
    this.getProducts();
    // const id = this.currentRoute.snapshot.paramMap.get('id');

    // this.http
    //   .get('api/like/getcountlikebyidproduit/' + id)
    //   .subscribe((data: any) => {
    //     this.countlike = data.countlike;
    //     console.log(this.countlike);
    //   });
    // this.http
    //   .get('api/totale/afficheRate' + '/' + id)
    //   .subscribe((data: any) => {
    //     for (let i = 0; i < data.length; i++) {
    //       this.numberRate += parseInt(data[i].noter) / data.length;
    //     }
    //   });

    // this.http.get('api/auth/getUser', { withCredentials: true }).subscribe(
    //   (res: any) => {
    //     let str = 'http://localhost:4200/' + 'api' + '/' + res.image;
    //     this.message = res.id;
    //     // this.message = `${this.api+res.image}`;
    //     // how show image in toast angular 13 ?

    //     Emitters.authEmitter.emit(true);
    //   },
    //   (err) => {
    //     Emitters.authEmitter.emit(false);
    //   }
    // );

    // this.http
    //   .get('api/produit/afficheproduitparid/' + id)
    //   .subscribe((data: any) => {
    //     this.idproduitss = data.id;
    //     this.nom = data.nom;
    //     this.prix = data.prix;
    //     this.image2 = data.image;
    //     this.Description = data.Description;
    //     this.quantite = data.quantite;
    //     this.promotion = data.promotion;
    //     this.date_exp = data.date_exp;
    //     this.prixold = data.prixold;
    //     this.idProduit = data.id;
    //     this.numberpromotion = data.numberpromotion;
    //   });
    // this.http
    //   .get('api/produit/afficheImageProduit/' + id)
    //   .subscribe((data: any) => {
    //     this.image = data;
    //     console.log(this.image);
    //   });

    // this.http
    //   .get('api/noterproduit/checkRateexistUser/' + this.message + '/' + id)
    //   .subscribe(
    //     (res: any) => {
    //       console.log(res.message);
    //     },
    //     (err) => {}
    //   );

    // // how reload page angular with router navigate ?

    // SCRIPT_PATH_LIST.forEach((e) => {
    //   const scriptElement = this.ScriptServiceService.loadJsScript(
    //     this.renderer,
    //     e
    //   );
    //   scriptElement.onload = () => {
    //     console.log('loaded');
    //   };
    //   scriptElement.onerror = () => {
    //     console.log('Could not load the script!');
    //   };
    // });
  }
  ajouterPanier(id: number, idProduit: number, prix: number) {
    if (id == null) {
      this.toastr.error(
        'Vous devez vous connecter pour ajouter au panier',
        'Erreur',
        {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right',
        }
      );
      this._router.navigate(['/login']);
    }
    this.http
      .post('api/panier/ajouterPanier', {
        id: id,
        idProduit: idProduit,
        prix: prix,
      })
      .subscribe(
        (data: any) => {
          this.toastr.success(
            'Produit ajouté au panier avec succès',
            'Ajouté au panier',
            {
              timeOut: 3000,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right',
            }
          );
          this.ngOnInit();
          this.SocketIOServiceService.emit('idusercountprdouit', id);
        },
        (error: any) => {
          if (error.status == 401) {
            this.toastr.error('Produit déjà dans le panier', 'Erreur', {
              timeOut: 3000,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right',
            });

          }else if (error.status == 400) {
            this.toastr.error('Produit hors stock', 'Erreur', {
              timeOut: 3000,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right',
            });

          }
          else{
            this.toastr.warning('Serveur indisponible', 'Erreur', {
              timeOut: 3000,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right',
            });
          }

        }
      );
  }
  jaime(id: number, idProduit: number) {
    if (this.message == null) {
      this.toastr.error('Vous devez vous connecter', 'Erreur', {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right',
      });
      this._router.navigate(['/login']);
    }

    this.http
      .post('api/like/ajouterlike', { id_user: id, id_produit: idProduit })
      .subscribe(
        (data: any) => {
          if (data.message == 'like ajouté') {
            this.toastr.success('Vous aimez ce produit', 'Ajouté au panier', {
              timeOut: 3000,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right',
            });
            this.router.navigate(['/singleProduct/' + idProduit]).then(() => {
              window.location.reload();
            });
          } else {
            this.toastr.error('Vous n aimez pas ce produit', 'Erreur', {
              timeOut: 3000,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right',
            });
          }
          this.router.navigate(['/singleProduct/' + idProduit]).then(() => {
            window.location.reload();
          });
        },
        (err: any) => {
          this.toastr.error('Vous devez vous connecter', 'Erreur', {
            timeOut: 3000,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right',
          });
        }
      );
    this.ngOnInit();
  }

  noterProduit(id: number, idProduit: number) {
    if (
      this.inputnoter1.nativeElement.checked == false &&
      this.inputnoter2.nativeElement.checked == false &&
      this.inputnoter3.nativeElement.checked == false &&
      this.inputnoter4.nativeElement.checked == false &&
      this.inputnoter5.nativeElement.checked == false
    ) {
      this.toastr.error('Vous devez choisir une note', 'Erreur', {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right',
      });
    }

    if (this.inputnoter1.nativeElement.checked == true) {
      console.log(this.inputnoter1.nativeElement.value);
      this.http
        .post('api/noterproduit/ajouterRate', {
          id_user: id,
          id_produit: idProduit,
          noter: this.inputnoter1.nativeElement.value,
        })
        .subscribe((data: any) => {
          if (data.message == 'note ajoutée') {
            this.toastr.success(
              'Vous aimez noter ce produit',
              'noter Produit',
              {
                timeOut: 3000,
                progressBar: true,
                progressAnimation: 'increasing',
                positionClass: 'toast-top-right',
              }
            );
          }
        });
      this.router.navigate(['/singleProduct/' + idProduit]).then(() => {
        window.location.reload();
      });
    }
    if (this.inputnoter2.nativeElement.checked == true) {
      console.log(this.inputnoter2.nativeElement.value);
      this.http
        .post('api/noterproduit/ajouterRate', {
          id_user: id,
          id_produit: idProduit,
          noter: this.inputnoter2.nativeElement.value,
        })
        .subscribe((data: any) => {
          if (data.message == 'note ajoutée') {
            this.toastr.success(
              'Vous aimez noter ce produit',
              'noter Produit',
              {
                timeOut: 3000,
                progressBar: true,
                progressAnimation: 'increasing',
                positionClass: 'toast-top-right',
              }
            );
          }
        });
      this.router.navigate(['/singleProduct/' + idProduit]).then(() => {
        window.location.reload();
      });
    }
    if (this.inputnoter3.nativeElement.checked == true) {
      console.log(this.inputnoter3.nativeElement.value);
      this.http
        .post('api/noterproduit/ajouterRate', {
          id_user: id,
          id_produit: idProduit,
          noter: this.inputnoter3.nativeElement.value,
        })
        .subscribe((data: any) => {
          if (data.message == 'note ajoutée') {
            this.toastr.success(
              'Vous aimez noter ce produit',
              'noter Produit',
              {
                timeOut: 3000,
                progressBar: true,
                progressAnimation: 'increasing',
                positionClass: 'toast-top-right',
              }
            );
          }
        });
      this.router.navigate(['/singleProduct/' + idProduit]).then(() => {
        window.location.reload();
      });
    }

    if (this.inputnoter4.nativeElement.checked == true) {
      console.log(this.inputnoter4.nativeElement.value);
      this.http
        .post('api/noterproduit/ajouterRate', {
          id_user: id,
          id_produit: idProduit,
          noter: this.inputnoter4.nativeElement.value,
        })
        .subscribe((data: any) => {
          if (data.message == 'note ajoutée') {
            this.toastr.success(
              'Vous aimez noter ce produit',
              'noter Produit',
              {
                timeOut: 3000,
                progressBar: true,
                progressAnimation: 'increasing',
                positionClass: 'toast-top-right',
              }
            );
          }
        });
      this.router.navigate(['/singleProduct/' + idProduit]).then(() => {
        window.location.reload();
      });
    }

    if (this.inputnoter5.nativeElement.checked == true) {
      console.log(this.inputnoter5.nativeElement.value);
      this.http
        .post('api/noterproduit/ajouterRate', {
          id_user: id,
          id_produit: idProduit,
          noter: this.inputnoter5.nativeElement.value,
        })
        .subscribe((data: any) => {
          if (data.message == 'note ajoutée') {
            this.toastr.success(
              'Vous aimez noter ce produit',
              'noter Produit',
              {
                timeOut: 3000,
                progressBar: true,
                progressAnimation: 'increasing',
                positionClass: 'toast-top-right',
              }
            );
          }
        });
      this.router.navigate(['/singleProduct/' + idProduit]).then(() => {
        window.location.reload();
      });
    }
  }



  // getPlatImageUrl(images: string): string {
  //   // Vérifiez si data.image existe avant de construire l'URL
  //   return this.data.image ? `http://localhost:9090/img/${this.data.image}` : '';
  // }
getProducts() {
  this.service.getProductsById(this.id).subscribe(
    (res) => {
      this.data = res;
      console.log('attributeSets:', JSON.stringify(this.data.attributeSets));
      console.log('data est null?', this.data === null);
      this.cdr.detectChanges();
    }
  );
}

  onAddToCart(attributeSet: Attribute[]) {
    console.log("Adding to cart:", attributeSet);
  
    // Créer l'objet CartItem avec une quantité de 1 et l'ensemble d'attributs spécifique
    const cartItem: CartItem = {
      name: this.data.name,
      price: this.data.price,
      quantity: 1,
      id: this.data._id,
      category: this.data.category,
      description: this.data.description,
      image: this.data.image,
      vendorId: this.data.vendorId,
      attributes: attributeSet, // Ajoutez l'ensemble d'attributs au panier
    };
  
    const vendorId = this.data.vendorId;
  
    // Appel du service pour ajouter au panier
    this.cartService.addToCart(cartItem, vendorId);
    this.cdr.detectChanges(); // Force la mise à jour de la vue

      this.toastr.success('Produit ajouté au panier', '', {
        timeOut: 1500,
        progressAnimation: 'increasing',
        progressBar: true,
        positionClass: 'toast-top-right',
      });
      Emitters.authEmitter2.emit(true);
  }

}
