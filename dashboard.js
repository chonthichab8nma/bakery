const API = "https://bakery-api-1fji.onrender.com/stats/summary";
const API_BEST = "https://bakery-api-1fji.onrender.com/stats/best-sellers";
const API_BEST_SELL ="https://bakery-api-1fji.onrender.com/sales";

async function loadSummary() {
    try {
        const res = await fetch(API);
        if (!res.ok) throw new Error("โหลด summary ไม่สำเร็จ");

        const data = await res.json();
        console.log("Summary:", data);

        const items = data.items || [];

        // สรุปรวมทั้งหมด
        let totalSold = 0;
        let totalRemaining = 0;
        let totalRevenue = 0;

        // รวมตามประเภทสินค้า
        const productMap = {};

        items.forEach(item => {
            const name = item.name || "Unknown";
            if (!productMap[name]) {
                productMap[name] = {
                    soldQuantity: 0,
                    remainingStock: 0,
                    revenue: 0
                };
            }
            productMap[name].soldQuantity += item.soldQuantity;
            productMap[name].remainingStock += item.remainingStock;
            productMap[name].revenue += item.soldQuantity * item.price;

            totalSold += item.soldQuantity;
            totalRemaining += item.remainingStock;
            totalRevenue += item.soldQuantity * item.price;
        });

        // แสดงยอดรวมทั้งหมดบนหน้าเว็บ
        document.getElementById("totalStock").textContent = items.length;       // จำนวนรายการทั้งหมด
        document.getElementById("totalSold").textContent = totalSold;           // จำนวนสินค้าที่ขายได้
        document.getElementById("totalRemaining").textContent = totalRemaining; // สินค้าคงเหลือ

        // แสดงยอดรวมตามประเภทสินค้า
        const summaryDiv = document.getElementById("summaryByProduct");
        if (summaryDiv) {
            summaryDiv.innerHTML = Object.entries(productMap)
                .map(([name, info]) => 
                    `<p>${name} - Sold: ${info.soldQuantity}, Remaining: ${info.remainingStock}, Revenue: $${info.revenue.toFixed(2)}</p>`
                )
                .join('');
        }

        console.log("Product Summary:", productMap);
        console.log("Total Revenue:", totalRevenue);

    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
    }
}


async function loadBestSellers() {
    try {
        const res = await fetch(API_BEST);
        if (!res.ok) throw new Error("โหลดสินค้าขายดีไม่สำเร็จ");

        const data = await res.json();
        console.log("Best Sellers:", data);

        // สินค้าขายดีที่สุดตามจำนวน
        const bestQty = data.bestByQuantity;
        const bestQtyDiv = document.getElementById("bestQuantity");
        bestQtyDiv.innerHTML = `
            <h3>ขายดีที่สุด (จำนวน): ${bestQty.name}</h3>
            <p>จำนวนที่ขาย: ${bestQty.soldQuantity}</p>
            
        `;
        // <img src="${bestQty.imageUrl}" alt="${bestQty.name}" width="150">

        // สินค้าขายดีที่สุดตามยอดเงิน
        const bestRev = data.bestByRevenue;
        const bestRevDiv = document.getElementById("bestRevenue");
        bestRevDiv.innerHTML = `
            <h3>ขายดีที่สุด (ยอดเงิน): ${bestRev.name}</h3>
            <p>จำนวนที่ขาย: ${bestRev.soldQuantity}</p>
            <p>ยอดขายรวม: $${bestRev.totalRevenue}</p>
            <p>ราคา: $${bestRev.price}</p>
            
        `;
        // <img src="${bestRev.imageUrl}" alt="${bestRev.name}" width="150">

    } catch (error) {
        console.error(error);
        document.getElementById("bestQuantity").textContent = "โหลดข้อมูลไม่สำเร็จ";
        document.getElementById("bestRevenue").textContent = "โหลดข้อมูลไม่สำเร็จ";
    }
}
// ฟังก์ชันดึงข้อมูลจาก API

async function fetchSales() {
    try {
        const res = await fetch(API_BEST_SELL);
        const data = await res.json();

        const salesArray = data.items || [];
        if (salesArray.length === 0) return;

        const productMap = {};

        salesArray.forEach(sale => {
            if (!productMap[sale.productName]) {
                productMap[sale.productName] = { quantity: 0, revenue: 0 };
            }
            productMap[sale.productName].quantity += sale.quantity;
            productMap[sale.productName].revenue += sale.totalAmount;
        });

        // แสดงยอดขายรวมตามจำนวน
        const totalByQuantityDiv = document.getElementById('totalByQuantity');
        totalByQuantityDiv.innerHTML = Object.entries(productMap)
            .map(([name, info]) => `<p>${name} - Sold: ${info.quantity}</p>`)
            .join('');

        // แสดงยอดขายรวมตามรายได้
        const totalByRevenueDiv = document.getElementById('totalByRevenue');
        totalByRevenueDiv.innerHTML = Object.entries(productMap)
            .map(([name, info]) => `<p>${name} - Revenue: $${info.revenue.toFixed(2)}</p>`)
            .join('');

    } catch (err) {
        console.error(err);
    }
}

fetchSales();













loadSummary();
// เรียกฟังก์ชันเมื่อโหลดหน้า
document.addEventListener("DOMContentLoaded", loadBestSellers);
