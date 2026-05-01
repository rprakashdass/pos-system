import { Order } from "./orderTypes";

export interface Invoice {
    id: number;
    invoiceDate: string;
    totalAmount: number;
    order: Order;
}
