import { Component, OnInit, Renderer2, ElementRef, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
// import { ProductsService } from '../../services/products.service';
// import { CartService } from 'src/app/services/cart.service';
import { CategoryService } from 'src/app/Service/category/category.service';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/Service/Product/product.service';
import { Product } from 'src/app/Models/product';
import { Category } from 'src/app/Models/category';


const ROWS_HEIGHT: { [id: number]: number } = { 1: 400, 3: 335, 4: 350 };

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  products: any;
  categories: Category[] | undefined;
  seachComponent: boolean = false;
  keyword: string = '';
  cols = 3;
  rowHeight = ROWS_HEIGHT[this.cols];
  productsSubscription: Subscription | undefined;
  count = '12';

  selectedCategory: Category | null = null;
  @Output() showCategory = new EventEmitter<string>();


  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe(data => {
      this.categories = data;
    });

    
    this.getAllProducts();

    var seach: string = new URLSearchParams(window.location.search).get('q') || '';
    // if (seach) {
    //   this.keyword = seach;
    //   this.seachComponent = true
    //   this.productService.searchProducts(seach).subscribe(data => {
    //     this.products = data;
    //     this.products_all = data;
    //   });

    // } else {
    //   this.productService.getProducts().subscribe(data => {
    //     this.products = data;
    //     this.products_all = data;
    //   })
    // }
  }

  activeIndex: any;
  activeAll: boolean = true;
  products_all: any;

  onShowCategory(category: Category) {
    this.selectedCategory = category;
    this.showCategory.emit(category.name);

    // Appeler la méthode pour récupérer les produits de la catégorie sélectionnée
    this.getProductsByCategory(this.selectedCategory._id);
  }


  getProductsByCategory(categoryId: string) {
    this.productService.getProductsByCategory(categoryId).subscribe(
      (res: any) => {
        this.products = res as Product[];
      },
      (error) => {
        console.error('Erreur lors de la récupération des produits :', error);
      }
    );
  }

  sortProducts(sortOption: any) {
    const selectedValue = sortOption.target.value;
    switch (selectedValue) {
      case 'menu_order':
        this.products.sort((a: any, b: any) => (a.id - b.id));
        break;
      case 'date':
        this.products.sort((a: any, b: any) => (b.id - a.id));
        break;
      case 'price':
        this.products.sort((a: any, b: any) => a.price - b.price);
        break;
      case 'price-desc':
        this.products.sort((a: any, b: any) => b.price - a.price);
        break;
    }
  }

  getAllProducts() {
    this.productsSubscription = this.productService.getAllProducts().subscribe((_products) => {
      this.products = _products;
      this.cdr.detectChanges(); // Force la mise à jour de la vue
      console.log(this.products);
    });
  }

}