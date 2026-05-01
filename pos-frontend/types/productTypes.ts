export interface Product {
    id: number;
    name: string;
    barcode: string;
    description?: string;
    price: number;
    clientId: number;
}

export interface ProductFormData {
    name: string;
    barcode: string;
    description?: string;
    price: number;
    clientId: number;
}
