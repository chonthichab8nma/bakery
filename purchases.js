const container = document.getElementById("purchaseContainer");
const finalTotalEl = document.getElementById("finalTotal");


function getImageUrl(path) {
    const BASE = "https://uunyyytttawccmjtzjdz.supabase.co/storage/v1/object/";
    return BASE + (path.replace("public/", "products/"));
}

let cart = JSON.parse(localStorage.getItem("purchases")) || [];

function purchase() {
    container.innerHTML = "";
    let summary = 0;

    cart.forEach((item, index) => {


        const imageUrl = getImageUrl(item.imagePath);

        const qty = item.quantity || 1;
        const total = item.price * qty;
        summary += total;

        const div = document.createElement("div");
        div.className = "purchase-item";

        div.innerHTML = `
            <div style="display:flex;align-items:center;">
                <img src="${imageUrl}" style="width:80px;height:80px;border-radius:6px;">
                <div style="margin-left:15px;">
                    <div class="item-name">${item.name}</div>
                    <div>ราคา: ${item.price} $</div>

                    <div style="margin-top:8px;display:flex;align-items:center;gap:10px;">
                        <button class="minus" data-index="${index}">-</button>
                        <span id="qty-${index}" class="qty">${qty}</span>
                        <button class="plus" data-index="${index}">+</button>
                    </div>
                </div>
            </div>

            <div style="font-weight:bold;">${total} $</div>
        `;

        container.appendChild(div);
    });

    finalTotalEl.textContent = summary;
    addPlusMinusEvents();
}

purchase();


function addPlusMinusEvents() {
    document.querySelectorAll(".plus").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = btn.dataset.index;
            cart[index].quantity++;
            localStorage.setItem("purchases", JSON.stringify(cart));
            purchase();
        });
    });

    document.querySelectorAll(".minus").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = btn.dataset.index;
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
                localStorage.setItem("purchases", JSON.stringify(cart));
                purchase();
            }
        });
    });
}


async function submitOrder() {
    const item = cart[0]; 

    const orderData = {
        productId: item.id,
        quantity: item.quantity || 1
    };

    console.log("ส่งไป API:", orderData);

    try {
        const response = await fetch("https://bakery-api-1fji.onrender.com/purchases", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();
        console.log("สั่งซื้อสำเร็จ:", result);

        alert("สั่งซื้อสินค้าเรียบร้อย!");
        window.location.href = "index.html";

    } catch (err) {
        console.error("Error:", err);
    }
}
