import { Product } from "./product";

export interface Category {
  _id: any;
  name: string;
  products?: Product[];
}