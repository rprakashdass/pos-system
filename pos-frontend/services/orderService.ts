import { Order } from "@/types/orderTypes";
import apiService from "./apiService";

class OrderService {
    private readonly endpoint = '/orders';

    async getAll() {
        return await apiService.get<Order[]>(this.endpoint);
    }

    async getById(id: number) {
        return await apiService.get<Order>(`${this.endpoint}/${id}`);
    }

    async create(order: Omit<Order, 'id' | 'orderDate' | 'totalAmount'>) {
        return await apiService.post<Order>(this.endpoint, order);
    }

    async update(id: number, order: Omit<Order, 'id' | 'orderDate' | 'totalAmount'>) {
        return await apiService.put<Order>(`${this.endpoint}/${id}`, order);
    }

    async delete(id: number) {
        return await apiService.delete(`${this.endpoint}/${id}`);
    }
}

export default new OrderService();
