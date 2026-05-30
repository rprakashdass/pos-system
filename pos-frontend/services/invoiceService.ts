import { Invoice, InvoiceFormData } from "@/types/invoiceTypes";
import apiService from "./apiService";

class InvoiceService {
    private readonly endpoint = '/invoices';

    async getAll() {
        return await apiService.get<Invoice[]>(this.endpoint);
    }

    async getById(id: number) {
        return await apiService.get<Invoice>(`${this.endpoint}/${id}`);
    }

    async create(invoice: InvoiceFormData) {
        return await apiService.post<Invoice>(this.endpoint, invoice);
    }
}

export default new InvoiceService();
