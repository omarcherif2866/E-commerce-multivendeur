import { Product } from "./product";
import { User } from "./user";

export interface Order {
  _id: any;
  commandeId: any;
  clientId: User;
  total: number ;
  statusOrder: string;
  items:OrderItemSchema[]
}


export interface OrderItemSchema {
  productId:Product;
  quantity:number;
  attributes:[]
}




