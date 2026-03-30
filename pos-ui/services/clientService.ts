import apiService from "./apiService";
import { Client, ClientFormData } from "@/types/clientTypes";

class  ClientService {
    private readonly endpoint = '/clients';

    async getAll() {
        return await apiService.get<Client[]>(this.endpoint);
    }

    async getById(id: number) {
        return await apiService.get<Client>(`${this.endpoint}/${id}`);
    }

    async create(client: ClientFormData) {
        return await apiService.post<Client>(this.endpoint, client);
    }

    async update(id: number, client: ClientFormData) {
        return await apiService.put<Client>(`${this.endpoint}/${id}`, client);
    }

    async search(query: string, searchField: string) {
        return await apiService.get<Client[]>(`${this.endpoint}/search`, {
            params: { q: query, field: searchField }
        });
    }

    async delete(id: number) {
        return await apiService.delete(`${this.endpoint}/${id}`);
    }
}

export default new ClientService();