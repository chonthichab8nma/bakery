const container = document.getElementById("purchaseContainer");
const finalTotalEl = document.getElementById("finalTotal");

let cart = JSON.parse(localStorage.getItem("purchases")) || [];

function purchase() {
    container.innerHTML = "";
    let summary = 0;

    cart.forEach(item => {

        // ⭐ ดึงรูปจาก imagePath แทน image
        const imageUrl = item.imagePath
            ? `https://bakery-api-1fji.onrender.com/${item.imagePath}`
            : "https://via.placeholder.com/100";

        const qty = item.quantity || 1;   // ⭐ กัน quantity undefined
        const total = item.price * qty;   // ⭐ ไม่เป็น NaN แล้ว

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

// ฟังก์ชันกดซื้อทั้งหมด → ส่งเข้า API
async function submitOrder() {

    const orderData = {
        items: cart.map(item => ({
            id: item.id,         
            quantity: item.quantity || 1
        }))
    };

    try {
        const response = await fetch("https://bakery-api-1fji.onrender.com/purchases", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();
        console.log("ส่งคำสั่งซื้อสำเร็จ! ✅");
        console.log(result);

    } catch (error) {
        console.error("ส่งข้อมูลล้มเหลว ❌", error);
    }
}
