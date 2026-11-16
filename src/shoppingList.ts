import type { Product, ShoppingListItem, NewShoppingListItem } from "./interfaces.js";

const API_URL = "http://localhost:3001/items";

export class ShoppingList {
  private items: ShoppingListItem[] = [];

  async loadItems(): Promise<ShoppingListItem[]> {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Ошибка загрузки: ${response.status}`);
    }
    this.items = await response.json();
    return this.items;
  }

  async addItem(product: Product, quantity: number): Promise<ShoppingListItem> {
    const newItem: NewShoppingListItem = { product, quantity };
    
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });

    if (!response.ok) {
      throw new Error(`Ошибка добавления: ${response.status}`);
    }

    const created: ShoppingListItem = await response.json();
    this.items.push(created);
    return created;
  }

  async updateQuantity(id: number, newQuantity: number): Promise<void> {
    if (newQuantity <= 0) {
      await this.removeItem(id);
      return;
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQuantity }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка обновления: ${response.status}`);
    }

    const updated: ShoppingListItem = await response.json();
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items[index] = updated;
    }
  }

  async removeItem(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Ошибка удаления: ${response.status}`);
    }

    this.items = this.items.filter((item) => item.id !== id);
  }

  getAllItems(): ShoppingListItem[] {
    return this.items;
  }
}
