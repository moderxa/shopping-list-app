var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ShoppingList } from "./shoppingList.js";
const shoppingList = new ShoppingList();
const form = document.getElementById("add-form");
const listElement = document.getElementById("shopping-list");
const statusElement = document.getElementById("status");
function render() {
    if (!listElement)
        return;
    listElement.innerHTML = "";
    const items = shoppingList.getAllItems();
    if (items.length === 0) {
        listElement.innerHTML = "<li>Список покупок пуст</li>";
        return;
    }
    items.forEach((item) => {
        const li = document.createElement("li");
        li.style.marginBottom = "10px";
        li.innerHTML = `
      <strong>${item.product.name}</strong> — ${item.product.price} руб. × ${item.quantity} шт.
      (Итого: ${item.product.price * item.quantity} руб.)
      <button data-action="inc" data-id="${item.id}" style="margin-left: 10px;">+1</button>
      <button data-action="dec" data-id="${item.id}">-1</button>
      <button data-action="del" data-id="${item.id}" style="color: red; margin-left: 5px;">Удалить</button>
    `;
        listElement.appendChild(li);
    });
}
form === null || form === void 0 ? void 0 : form.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    const nameInput = document.getElementById("item-name");
    const priceInput = document.getElementById("item-price");
    const qtyInput = document.getElementById("item-qty");
    const product = {
        id: Date.now(),
        name: nameInput.value.trim(),
        price: Number(priceInput.value),
    };
    const quantity = Number(qtyInput.value);
    try {
        if (statusElement)
            statusElement.textContent = "Добавляем товар...";
        yield shoppingList.addItem(product, quantity);
        form.reset();
        qtyInput.value = "1";
        render();
        if (statusElement)
            statusElement.textContent = "Товар успешно сохранен в db.json";
    }
    catch (error) {
        if (statusElement)
            statusElement.textContent = `Ошибка: ${error}`;
    }
}));
listElement === null || listElement === void 0 ? void 0 : listElement.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
    const target = event.target;
    const action = target.getAttribute("data-action");
    const idAttr = target.getAttribute("data-id");
    if (!action || !idAttr)
        return;
    const id = Number(idAttr);
    const currentItem = shoppingList.getAllItems().find((i) => i.id === id);
    if (!currentItem)
        return;
    try {
        if (action === "inc") {
            yield shoppingList.updateQuantity(id, currentItem.quantity + 1);
        }
        else if (action === "dec") {
            yield shoppingList.updateQuantity(id, currentItem.quantity - 1);
        }
        else if (action === "del") {
            yield shoppingList.removeItem(id);
        }
        render();
        if (statusElement)
            statusElement.textContent = "База данных обновлена";
    }
    catch (error) {
        if (statusElement)
            statusElement.textContent = `Ошибка: ${error}`;
    }
}));
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (statusElement)
                statusElement.textContent = "Загрузка списка покупок...";
            yield shoppingList.loadItems();
            render();
            if (statusElement)
                statusElement.textContent = "Данные загружены с сервера";
        }
        catch (error) {
            if (statusElement)
                statusElement.textContent = `Не удалось подключиться к серверу: ${error}`;
        }
    });
}
void init();
