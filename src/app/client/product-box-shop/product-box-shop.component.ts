import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category } from 'src/app/Models/category';
import { Product } from 'src/app/Models/product';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-box-shop',
  templateUrl: './product-box-shop.component.html',
  styleUrls: ['./product-box-shop.component.css']
})
export class ProductBoxShopComponent implements OnInit {
  @Input() fullWidthMode = false;
  @Input() product: Product | undefined;
  categoryName: string | undefined; // Variable pour stocker le nom de la catégorie
  @Input() products: Product[] = [];
  @Output() addToCart = new EventEmitter();
  selectedCategory: Category | undefined; // Utilisez undefined comme valeur par défaut

  constructor( private toastr: ToastrService) {}

  ngOnInit(): void {
    console.log(this.product?.category.name);
    console.log(this.product?.name);

  }

  onCategorySelected(category: Category) {
    this.selectedCategory = category;
  }

  clearCategoryFilter() {
    this.selectedCategory = undefined; // Définissez la catégorie sélectionnée sur undefined pour afficher tous les produits
  }

  getFilteredProducts(): Product[] {
    if (!this.products) {
      return [];
    }
    if (this.selectedCategory === undefined) {
      return this.products; // Si selectedCategory est undefined, afficher tous les produits.
    } else {
      // Filtrer les produits en fonction de la catégorie sélectionnée.
      return this.products.filter((product) => product.category?._id === this.selectedCategory);
    }
  }


  onAddToCart() {

    this.addToCart.emit(this.product);    

  }

  getPlatImageUrl(images: string): string {
    return `http://localhost:9090/img/${images}`;
  }

}
