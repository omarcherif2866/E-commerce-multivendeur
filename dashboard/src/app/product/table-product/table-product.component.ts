import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ServiceService } from '../../service/service.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { Product } from 'src/app/models/product';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-table-product',
  templateUrl: './table-product.component.html',
  styleUrls: ['./table-product.component.css']
})
export class TableProductComponent implements OnInit {
  displayedColumns: string[] = ['Image','productName', 'category', 'price', 'description', 'attributSets', 'action'];
  dataSource!: MatTableDataSource<Product>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Output() editProductClicked: EventEmitter<Product> = new EventEmitter<Product>();
  @Input() vendorId: string | null = null;

  constructor(private dialog: MatDialog, private service: ServiceService,  private route: ActivatedRoute,private categoryService:CategoryService) {
    this.dataSource = new MatTableDataSource<Product>([]);

   }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const userId = params.get('vendorId');
      if (userId) {
        this.vendorId = userId;
        this.getProductsForVendor();
      }
    });

  }

  getProductsForVendor() {
    if (this.vendorId !== null) {
      this.service.getProductsByvendor(this.vendorId).subscribe({
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
  
  




  editProduct(row: any) {
    this.dialog.open(DialogComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this.getProductsForVendor(); // Mettez à jour la liste après l'édition
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteProduct(id: number) {
    this.service.deleteProduct(id).subscribe({
      next: (res) => {
        alert("Produit supprimé avec succès")
        this.getProductsForVendor(); // Mettez à jour la liste après la suppression
      },
      error: (e) => {
        alert("Erreur lors de la suppression du produit")
      }
    })
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
  


  


}
