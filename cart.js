const cartContainer = document.getElementById("cart-container");
const grandTotalEl = document.getElementById("grandTotal");
const selectAllCheckbox = document.getElementById("selectAll");

let cart = JSON.parse(localStorage.getItem("cart")) || [];


function renderCart() {
    cartContainer.innerHTML = "";
    let grandTotal = 0;

    cart.forEach((item, index) => {
        const imageUrl = item.image;
        const qty = item.quantity || 1;
        const total = item.price * qty;

        if (item.selected) {
            grandTotal += total;
        }

        const div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
            <div style="display:flex;align-items:center;gap:15px;flex:1;">
                
                <!-- ⭐ Checkbox ต่อสินค้า -->
                <input type="checkbox" class="select-item" data-index="${index}"
                    ${item.selected ? "checked" : ""} style="transform:scale(1.3);">

                <img src="${imageUrl}" style="width:90px;height:90px;border-radius:10px;object-fit:cover;">

                <div>
                    <div class="item-name">${item.name}</div>
                    <div>ราคา: ${item.price} $</div>

                    <div style="display:flex;align-items:center;gap:10px;margin-top:5px;">
                        <button class="minus" data-index="${index}">-</button>
                        <span id="qty-${index}">${qty}</span>
                        <button class="plus" data-index="${index}">+</button>
                    </div>
                </div>
            </div>

            <div style="display:flex;flex-direction:column;align-items:center;">
                <div style="font-weight:bold;">${total} $</div>
                <button class="delete-btn" data-index="${index}">ลบ</button>
            </div>
        `;

        cartContainer.appendChild(div);
    });

    grandTotalEl.textContent = grandTotal;
    updateSelectAllStatus();
    addEvents();
}

renderCart();



function updateCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}


function updateSelectAllStatus() {
    const allSelected = cart.length > 0 && cart.every(item => item.selected);
    selectAllCheckbox.checked = allSelected;
}



function addEvents() {

  
    // --- checkbox เลือกสินค้า ---
const selectItems = document.querySelectorAll(".select-item");
for (const i in selectItems) {
    const checkbox = selectItems[i];
    if (!(checkbox instanceof HTMLElement)) continue;

    checkbox.addEventListener("change", () => {
        const index = checkbox.dataset.index;
        cart[index].selected = checkbox.checked;
        updateCart();
    });
}

// --- ปุ่มเพิ่มจำนวน ---
const plusBtns = document.querySelectorAll(".plus");
for (const i in plusBtns) {
    const btn = plusBtns[i];
    if (!(btn instanceof HTMLElement)) continue;

    btn.addEventListener("click", () => {
        const index = btn.dataset.index;

        if (cart[index].quantity >= cart[index].remainingStock) {
            alert("จำนวนเกินสต็อกที่มีอยู่!");
            return;
        }

        cart[index].quantity++;
        updateCart();
    });
}

// --- ปุ่มลดจำนวน ---
const minusBtns = document.querySelectorAll(".minus");
for (const i in minusBtns) {
    const btn = minusBtns[i];
    if (!(btn instanceof HTMLElement)) continue;

    btn.addEventListener("click", () => {
        const index = btn.dataset.index;

        if (cart[index].quantity > 1) {
            cart[index].quantity--;
            updateCart();
        }
    });
}

// --- ปุ่มลบสินค้า ---
const deleteBtns = document.querySelectorAll(".delete-btn");
for (const i in deleteBtns) {
    const btn = deleteBtns[i];
    if (!(btn instanceof HTMLElement)) continue;

    btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        cart.splice(index, 1);
        updateCart();
    });
}


    // ★ Checkbox “เลือกทั้งหมด”
    selectAllCheckbox.addEventListener("change", () => {
        const checked = selectAllCheckbox.checked;
        cart.forEach(item => item.selected = checked);
        updateCart();
    });
}


function goPurchase() {
    const selectedItems = cart.filter(item => item.selected);

    if (selectedItems.length === 0) {
        alert("กรุณาเลือกรายการที่จะชำระเงิน");
        return;
    }

    localStorage.setItem("purchases", JSON.stringify(selectedItems));
    window.location.href = "purchases.html";
}
