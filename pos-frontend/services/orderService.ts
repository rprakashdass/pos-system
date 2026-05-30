import { Order, OrderFormData, OrderStatus } from "@/types/orderTypes";
import apiService from "./apiService";

class OrderService {
    private readonly endpoint = '/orders';

    async getAll() {
        return await apiService.get<Order[]>(this.endpoint);
    }

    async getById(id: number) {
        return await apiService.get<Order>(`${this.endpoint}/${id}`);
    }

    async create(order: OrderFormData) {
        return await apiService.post<Order>(this.endpoint, order);
    }

    async updateStatus(id: number, status: OrderStatus) {
        return await apiService.put<Order>(`${this.endpoint}/${id}/status`, { status });
    }

    async delete(id: number) {
        return await apiService.delete(`${this.endpoint}/${id}`);
    }
}

export default new OrderService();
