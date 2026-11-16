import { ShoppingList } from "./shoppingList.js";
import type { Product } from "./interfaces.js";

const shoppingList = new ShoppingList();

const form = document.getElementById("add-form") as HTMLFormElement | null;
const listElement = document.getElementById("shopping-list") as HTMLUListElement | null;
const statusElement = document.getElementById("status") as HTMLParagraphElement | null;

function render(): void {
  if (!listElement) return;
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

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nameInput = document.getElementById("item-name") as HTMLInputElement;
  const priceInput = document.getElementById("item-price") as HTMLInputElement;
  const qtyInput = document.getElementById("item-qty") as HTMLInputElement;

  const product: Product = {
    id: Date.now(),
    name: nameInput.value.trim(),
    price: Number(priceInput.value),
  };
  const quantity = Number(qtyInput.value);

  try {
    if (statusElement) statusElement.textContent = "Добавляем товар...";
    await shoppingList.addItem(product, quantity);
    form.reset();
    qtyInput.value = "1";
    render();
    if (statusElement) statusElement.textContent = "Товар успешно сохранен в db.json";
  } catch (error) {
    if (statusElement) statusElement.textContent = `Ошибка: ${error}`;
  }
});

listElement?.addEventListener("click", async (event) => {
  const target = event.target as HTMLElement;
  const action = target.getAttribute("data-action");
  const idAttr = target.getAttribute("data-id");

  if (!action || !idAttr) return;
  const id = Number(idAttr);

  const currentItem = shoppingList.getAllItems().find((i) => i.id === id);
  if (!currentItem) return;

  try {
    if (action === "inc") {
      await shoppingList.updateQuantity(id, currentItem.quantity + 1);
    } else if (action === "dec") {
      await shoppingList.updateQuantity(id, currentItem.quantity - 1);
    } else if (action === "del") {
      await shoppingList.removeItem(id);
    }
    render();
    if (statusElement) statusElement.textContent = "База данных обновлена";
  } catch (error) {
    if (statusElement) statusElement.textContent = `Ошибка: ${error}`;
  }
});

async function init(): Promise<void> {
  try {
    if (statusElement) statusElement.textContent = "Загрузка списка покупок...";
    await shoppingList.loadItems();
    render();
    if (statusElement) statusElement.textContent = "Данные загружены с сервера";
  } catch (error) {
    if (statusElement) statusElement.textContent = `Не удалось подключиться к серверу: ${error}`;
  }
}

void init();
