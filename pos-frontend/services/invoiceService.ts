import { Invoice } from "@/types/invoiceTypes";
import apiService from "./apiService";

class InvoiceService {
    private readonly endpoint = '/invoices';

    async getAll() {
        return await apiService.get<Invoice[]>(this.endpoint);
    }

    async getById(id: number) {
        return await apiService.get<Invoice>(`${this.endpoint}/${id}`);
    }

    async create(invoice: Omit<Invoice, 'id' | 'invoiceDate' | 'totalAmount'>) {
        return await apiService.post<Invoice>(this.endpoint, invoice);
    }

    async update(id: number, invoice: Omit<Invoice, 'id' | 'invoiceDate' | 'totalAmount'>) {
        return await apiService.put<Invoice>(`${this.endpoint}/${id}`, invoice);
    }

    async delete(id: number) {
        return await apiService.delete(`${this.endpoint}/${id}`);
    }
}

export default new InvoiceService();
