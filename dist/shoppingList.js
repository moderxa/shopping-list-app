var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_URL = "http://localhost:3001/items";
export class ShoppingList {
    constructor() {
        this.items = [];
    }
    loadItems() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(API_URL);
            if (!response.ok) {
                throw new Error(`Ошибка загрузки: ${response.status}`);
            }
            this.items = yield response.json();
            return this.items;
        });
    }
    addItem(product, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            const newItem = { product, quantity };
            const response = yield fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newItem),
            });
            if (!response.ok) {
                throw new Error(`Ошибка добавления: ${response.status}`);
            }
            const created = yield response.json();
            this.items.push(created);
            return created;
        });
    }
    updateQuantity(id, newQuantity) {
        return __awaiter(this, void 0, void 0, function* () {
            if (newQuantity <= 0) {
                yield this.removeItem(id);
                return;
            }
            const response = yield fetch(`${API_URL}/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quantity: newQuantity }),
            });
            if (!response.ok) {
                throw new Error(`Ошибка обновления: ${response.status}`);
            }
            const updated = yield response.json();
            const index = this.items.findIndex((item) => item.id === id);
            if (index !== -1) {
                this.items[index] = updated;
            }
        });
    }
    removeItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error(`Ошибка удаления: ${response.status}`);
            }
            this.items = this.items.filter((item) => item.id !== id);
        });
    }
    getAllItems() {
        return this.items;
    }
}
