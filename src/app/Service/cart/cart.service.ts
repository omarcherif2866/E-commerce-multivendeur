import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Cart, CartItem } from 'src/app/Models/cart';
import { Attribute } from 'src/app/Models/product';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = environment.apiUrl;

  public cartSubject = new BehaviorSubject<Cart>({ items: [] });
  cart: Observable<Cart> = this.cartSubject.asObservable();  constructor(private _snackBar: MatSnackBar, private http: HttpClient) { }
  private productsInCart: CartItem[] = [];

  
  addToCart(item: CartItem, vendorId: string) {
    const cart = this.cartSubject.value;
    const items = [...cart.items];
  
    const stockAttribute = this.getStockAttribute(item.attributes, 'stock');
  
    if (!stockAttribute) {
      console.error(`L'attribut "stock" n'a pas été trouvé pour le produit avec l'ID ${item.id}`);
      return;
    }
  
    // Trouver l'index de l'élément dans le panier avec des attributs similaires
    const index = items.findIndex((_item) => this.areAttributesEqual(_item.attributes, item.attributes));
  
    if (index !== -1) {
      // L'élément avec des attributs similaires existe déjà dans le panier, augmentons simplement la quantité
      items[index].quantity += 1;
    } else {
      // L'élément n'existe pas dans le panier, ajoutons-le avec l'ID du vendeur
      items.push({ ...item, quantity: 1, vendorId, stockAttribute });
    }
  
    this.cartSubject.next({ items: [...items] });
    this._snackBar.open('1 item added to cart', 'ok', { duration: 3000 });
    console.log(this.cartSubject.value);
  }
  
  private getStockAttribute(attributes: Attribute[] | undefined, attributeName: string) {
    if (attributes && attributes.length) {
      return attributes.find(attr => attr.name === attributeName);
    }
    return undefined;
  }
  



  
  
  private areAttributesEqual(attributes1: Attribute[] | undefined, attributes2: Attribute[] | undefined): boolean {
    // Vérifiez si les deux tableaux d'attributs sont définis
    if (!attributes1 || !attributes2) {
      return false;
    }
  
    // Comparez les attributs en utilisant la sérialisation JSON pour une comparaison profonde
    const sortedAttributes1 = JSON.stringify(attributes1.sort());
    const sortedAttributes2 = JSON.stringify(attributes2.sort());
  
    return sortedAttributes1 === sortedAttributes2;
  }
  
  
  

  removeQuantity(item: CartItem){
    let itemForRemoval: CartItem | undefined
   let filteredItems =  this.cartSubject.value.items.map((_item)=>{
      if (_item.id === item.id){
        _item.quantity--
        if(_item.quantity === 0){
          itemForRemoval = _item
        }
      }
      return _item
    });
    if (itemForRemoval){
      filteredItems = this.removeFromCart(itemForRemoval, false)
    }
    this.cartSubject.next({items: filteredItems})
    this._snackBar.open('1 item removed from cart','ok',{duration:3000})
  }

  getTotal(items: Array<CartItem>): number{
    return items.map((item) => item.price * item.quantity)
    .reduce((prev, current) => prev + current, 0)
  }

  ClearCart(){
    this.cartSubject.next({items:[]})
    this._snackBar.open('Cart is clear','ok',{duration:3000})
  }

  removeFromCart(item: CartItem, update = true): Array<CartItem>{
    const filteredItems = this.cartSubject.value.items.filter((_item)=>
    _item.id !== item.id );

    if(update){
      this.cartSubject.next({items : filteredItems})
      this._snackBar.open('1 item removed from cart','ok',{duration:3000});
    }

    return filteredItems

  }


  getOrdersForVendor(vendorId: string): Observable<any> {
    // Remplacez l'URL par l'API appropriée pour récupérer les commandes pour le vendeur spécifique
    const url = `${this.apiUrl}/vendor/${vendorId}/orders`;

    return this.http.get<any>(url);
  }

// Dans votre CartService
checkOut(data: any, clientId: any): Observable<any> {
  const cartItemsWithAttributes = data.items.map((item: any) => ({
    productId: item.productId,
    quantity: item.quantity,
    attributes: item.stockAttribute // Assurez-vous que "stockAttribute" est correct
  }));

  const updatedData = {
    ...data,
    items: cartItemsWithAttributes
  };

  return this.http.post<any>(`${this.apiUrl}/commande/create/${clientId}`, updatedData);
}


  getProductsInCart(): CartItem[] {
    return this.productsInCart;
  }

  getCartValue(): Cart {
    return this.cartSubject.value;
  }

  

}
