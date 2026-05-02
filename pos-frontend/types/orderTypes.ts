export type OrderStatus = "PENDING" | "CREATED" | "INVOICED" | "CANCELLED" | "COMPLETED";

export interface OrderItem {
    id: number;
    productId: number;
    quantity: number;
    sellingPrice: number;
}

export interface Order {
    id: number;
    clientId: number;
    status: OrderStatus;
    totalPrice: number;
    createdAt: string;
    items: OrderItem[];
}

export interface OrderItemFormData {
    productId: number;
    quantity: number;
}

export interface OrderFormData {
    clientId: number;
    items: OrderItemFormData[];
    status?: OrderStatus;
}
