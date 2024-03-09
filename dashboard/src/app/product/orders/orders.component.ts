

import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/service/order.service';
import { ServiceService } from 'src/app/service/service.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  displayedColumns: string[] = ['_id', 'clientId', 'items', 'total', 'statusOrder'];
  dataSource!: MatTableDataSource<Order>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Input() vendorId: string | null = null;

  constructor(private service: OrderService, private route: ActivatedRoute, private cdr: ChangeDetectorRef , private s : ServiceService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const userId = params.get('vendorId');
      if (userId) {
        this.vendorId = userId;
        this.dataSource = new MatTableDataSource<Order>([]); 
        this.getOrders();
      }
    });
  }
  
  getOrders() {
    if (this.vendorId !== null) {
      this.service.getOrderByVendor(this.vendorId).subscribe({
        next: async (data: Order[] | { orders: Order[] }) => {
          const ordersArray = Array.isArray(data) ? data : data.orders;
          if (ordersArray) {
            for (const order of ordersArray) {
              if (order.clientId ) {
                // Récupérez les détails complets de la catégorie à partir du service
                const clientName = await this.s.getUserById(order.clientId).toPromise();
  
                // Assurez-vous que la catégorie est disponible avant de l'assigner
                if (clientName) {
                  order.clientId = clientName;
                }
              }
            }
  
            this.dataSource.data = ordersArray;
            console.log("ordersArray : " , ordersArray)
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

  
  
  getStatusStyle(statusOrder: string): any {
  
    if (statusOrder === 'En Cours') {
      return { color: 'red' };
    } else if (statusOrder === 'Terminé') {
      return { color: 'green' };
    } else {
      return {};
    }
  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
