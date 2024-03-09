import { Category } from "./category";

export interface Product {
  _id: any;
  name: string;
  price: number;
  category: Category ;
  description: string;
  image: any;
  vendorId: string;
  attributeSets: Attribute[];
}

export interface Attribute {
  name: string;
  value: string;
  isSelected: boolean;

  some(predicate: (value: Attribute) => boolean): boolean;
  find(predicate: (value: Attribute) => boolean): Attribute | undefined; // Add the 'find' method
}
