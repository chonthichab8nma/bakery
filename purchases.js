const container = document.getElementById("purchaseContainer");
const finalTotalEl = document.getElementById("finalTotal");

// ทดสอบ: 
let cart = [
    {
        name: "Strawberry Cake",
        price: 89,
        quantity: 1,
        image: "https://via.placeholder.com/100" // รูปตัวอย่าง
    },
    {
        name: "Cake",
        price: 55,
        quantity: 2,
        image: "https://via.placeholder.com/100" // รูปตัวอย่าง
    }
];

function purchase() {
    container.innerHTML = "";
    let summary = 0;

    cart.forEach(item => {
        const total = item.price * item.quantity;
        summary += total;

        const div = document.createElement("div");
        div.className = "purchase-item";

        div.innerHTML = `
            <div style="display:flex;align-items:center;">
                <img src="${item.image}">
                <div>
                    <div class="item-name">${item.name}</div>
                    <div>ราคา: ${item.price} บาท</div>
                    <div>จำนวน: ${item.quantity}</div>
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

    const orderData = cart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity
    }));

    try {
        const response = await fetch("https://bakery-api-1fji.onrender.com/purchases", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        console.log("ส่งคำสั่งซื้อสำเร็จ! ✅");
        console.log(result);

    } catch (error) {
        console.error("ส่งข้อมูลล้มเหลว ❌", error);
    }
}
