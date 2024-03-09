import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product';
import { CategoryService } from 'src/app/service/category.service';
import { ServiceService } from 'src/app/service/service.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  displayedColumns: string[] = ['Image','productName', 'category', 'price', 'attributSets', 'description', ];
  dataSource!: MatTableDataSource<Product>;
  @Input() vendorId: string | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog: MatDialog, private service: ServiceService,  private route: ActivatedRoute, private categoryService:CategoryService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const userId = params.get('vendorId');
      if (userId) {
        this.vendorId = userId;
        this.dataSource = new MatTableDataSource<Product>([]); // Initialisation vide
        this.getProductsForVendorAndStatus();
      }
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getPlatImageUrl(images: string): string {
    return `http://localhost:9090/img/${images}`;
  }

  getStatusStyle(attribute: any): { [key: string]: string } {
    const style: { [key: string]: string } = {};
  
    if (attribute.name === 'stock') {
      style['color'] = attribute.value > 0 ? 'green' : 'red';
    }
  
    return style;
  }

  getProductsForVendorAndStatus() {
    if (this.vendorId !== null) {
      this.service.getProductsByVendorAndStatus(this.vendorId).subscribe({
        next: async (res: Product[]) => {
          if (res) {
            for (const product of res) {
              if (product.category && typeof product.category === 'string') {
                // Récupérez les détails complets de la catégorie à partir du service
                const category = await this.categoryService.getCategoryById(product.category).toPromise();
  
                // Assurez-vous que la catégorie est disponible avant de l'assigner
                if (category) {
                  product.category = category;
                }
              }
            }
  
            this.dataSource.data = res;
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          } else {
            console.error("No data received");
          }
        },
        error: (e) => {
          alert("Error while fetching the data");
        }
      });
    } else {
      console.error("Invalid Vendor ID");
    }
  }
  

  
  
  

}
