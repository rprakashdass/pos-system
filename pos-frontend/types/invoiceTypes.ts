export interface Invoice {
    id: number;
    orderId: number;
    createdAt: string;
}

export interface InvoiceFormData {
    orderId: number;
}
