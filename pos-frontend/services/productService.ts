import { Product } from "@/types/productTypes";
import apiService from "./apiService";

class ProductService {
    private readonly endpoint = '/products';

    async getAll() {
        return await apiService.get<Product[]>(this.endpoint);
    }

    async getById(id: number) {
        return await apiService.get<Product>(`${this.endpoint}/${id}`);
    }

    async create(product: Omit<Product, 'id'>) {
        return await apiService.post<Product>(this.endpoint, product);
    }

    async update(id: number, product: Omit<Product, 'id'>) {
        return await apiService.put<Product>(`${this.endpoint}/${id}`, product);
    }

    async delete(id: number) {
        return await apiService.delete(`${this.endpoint}/${id}`);
    }
}

export default new ProductService();
