const container = document.getElementById("purchaseContainer");
const finalTotalEl = document.getElementById("finalTotal");

const IMAGE_BASE_URL = "https://uunyyytttawccmjtzjdz.supabase.co/storage/v1/object/public/products/";

let cart = JSON.parse(localStorage.getItem("purchases")) || [];

function purchase() {
    container.innerHTML = "";
    let summary = 0;

    cart.forEach(item => {

        // ⭐ ใช้รูปจาก Supabase
        const imageUrl = item.imagePath 
            ? `${IMAGE_BASE_URL}${item.imagePath.replace("public/", "")}`
            : "https://via.placeholder.com/100";

        const qty = item.quantity || 1;
        const total = item.price * qty;

        summary += total;

        const div = document.createElement("div");
        div.className = "purchase-item";

        div.innerHTML = `
            <div style="display:flex;align-items:center;">
                <img src="${imageUrl}">
                <div>
                    <div class="item-name">${item.name}</div>
                    <div>ราคา: ${item.price} บาท</div>
                    <div>จำนวน: ${qty}</div>
                </div>
            </div>
            <div style="font-weight:bold;">${total} บาท</div>
        `;

        container.appendChild(div);
    });

    finalTotalEl.textContent = summary;
}

purchase();


// ⭐ ส่งข้อมูลไป API ให้ถูกต้อง
async function submitOrder() {

    const item = cart[0]; 

    // API ต้องการ id ไม่ใช่ productId ไม่ต้องหุ้มด้วย items[]
    const orderData = {
        productId: item.id,
        quantity: item.quantity || 1
    };

    console.log("ส่งขึ้น API:", orderData);

    try {
        const response = await fetch("https://bakery-api-1fji.onrender.com/purchases", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();
        console.log("สำเร็จ:", result);

        alert("สั่งซื้อสินค้าสำเร็จ!");
        window.location.href = "index.html";

    } catch (err) {
        console.error(err);
    }
}
