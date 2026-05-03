export interface Inventory {
  id: number;
  quantity: number;
}

export interface InventoryCreateForm {
  productId: number;
  quantity: number;
}

export interface InventoryUpdateForm {
  id: number;
  quantity: number;
}