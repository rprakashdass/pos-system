import { Client } from "./clientTypes";
import { Product } from "./productTypes";

export interface Order {
    id: number;
    orderDate: string;
    totalAmount: number;
    client: Client;
    items: OrderItem[];
}

export interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    product: Product;
}
