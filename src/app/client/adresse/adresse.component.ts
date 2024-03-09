import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Category } from 'src/app/Models/category';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/Service/Product/product.service';

@Component({
  selector: 'app-adresse',
  templateUrl: './adresse.component.html',
  styleUrls: ['./adresse.component.css']
})
export class AdresseComponent implements OnInit {
  products: any;
  categories: Category[] | undefined;
  seachComponent: boolean = false;
  keyword: string = '';
  cols = 3;
  productsSubscription: Subscription | undefined;
  count = '12';
  constructor(    private productService: ProductService,     private cdr: ChangeDetectorRef,
    ) { }

  ngOnInit(): void {
    this.getAllProducts();

  }
  getAllProducts() {
    this.productsSubscription = this.productService.getAllProducts().subscribe((_products) => {
      this.products = _products;
      this.cdr.detectChanges(); // Force la mise à jour de la vue
    });
  }
}
