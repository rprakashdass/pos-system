import apiService from "./apiService";
import { Inventory, InventoryCreateForm, InventoryUpdateForm } from "@/types/inventoryTypes";

class InventoryService {
  private readonly endpoint = "/inventory";

  async getAll() {
    return await apiService.get<Inventory[]>(this.endpoint);
  }

  async getById(id: number) {
    return await apiService.get<Inventory>(`${this.endpoint}/${id}`);
  }

  async create(form: InventoryCreateForm) {
    return await apiService.post<Inventory>(this.endpoint, form);
  }

  async update(form: InventoryUpdateForm) {
    return await apiService.put<Inventory>(this.endpoint, form);
  }
}

export default new InventoryService();