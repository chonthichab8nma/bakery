const cartContainer = document.getElementById("cart-container");
const grandTotalEl = document.getElementById("grandTotal");

let cart = [];

async function loadProducts() {
  const res = await fetch("https://bakery-api-1fji.onrender.com/products");
  const products = await res.json();

  // ตัวอย่าง: ใส่สินค้าทั้งหมดลงตะกร้าพร้อมจำนวน = 1
  cart = products.map(p => ({ ...p, quantity: 1 }));

  renderCart();
}

function renderCart() {
  cartContainer.innerHTML = "";
  let grandTotal = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    grandTotal += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">

      <div class="item-info">
        <div class="item-name">${item.name}</div>
        <div class="item-price">${item.price} บาท</div>

        <div class="quantity-control">
          <button onclick="changeQty(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="changeQty(${item.id}, +1)">+</button>
        </div>
      </div>

      <div class="item-total">
        รวม: ${itemTotal} บาท
      </div>
    `;

    cartContainer.appendChild(div);
  });

  grandTotalEl.textContent = grandTotal;
}

function changeQty(id, num) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.quantity += num;
  if (item.quantity < 1) item.quantity = 1;

  renderCart();
}

loadProducts();
