const API = "https://bakery-api-1fji.onrender.com/stats/summary";
const API_BEST = "https://bakery-api-1fji.onrender.com/stats/best-sellers";
const API_BEST_SELL = "https://bakery-api-1fji.onrender.com/sales";
const API_PRODUCTS = "https://bakery-api-1fji.onrender.com/products";

// ฟังก์ชันแสดงยอดรวมทั้งหมด
async function loadSummary() {
    try {
        const res = await fetch(API);
        if (!res.ok) throw new Error("โหลด summary ไม่สำเร็จ");

        const data = await res.json();
        console.log("Summary:", data);

        document.getElementById("totalStock").textContent = data.totalStock;
        document.getElementById("totalSold").textContent = data.totalSoldQuantity;
        document.getElementById("totalRemaining").textContent = data.totalRemainingStock;

    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
        document.getElementById("totalStock").textContent = "-";
        document.getElementById("totalSold").textContent = "-";
        document.getElementById("totalRemaining").textContent = "-";
    }
}

// ฟังก์ชันแสดงยอดขายตามประเภทสินค้า + สร้าง dropdown
async function loadProductsSummary() {
    try {
        const res = await fetch(API_PRODUCTS);
        if (!res.ok) throw new Error("โหลดสินค้าตามหมวดไม่สำเร็จ");

        const data = await res.json();
        const items = data.items || [];
        console.log("Items:", items);

        // แยกประเภทสินค้า
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
        });

        // สร้าง dropdown
        const summaryDiv = document.getElementById("summaryByProduct");
        summaryDiv.innerHTML = `
            <select id="productDropdown">
                ${Object.keys(productMap).map(name => `<option value="${name}">${name}</option>`).join('')}
            </select>
            <div id="productDetails"></div>
        `;

        const productDetailsDiv = document.getElementById("productDetails");

        function showProduct(name) {
            const info = productMap[name];
            productDetailsDiv.innerHTML = `
        <p>${name} - สินค้าที่ขาย: ${info.soldQuantity}, สินค้าคงเหลือ: ${info.remainingStock}</p>
    `;
        }

        // แสดงค่าเริ่มต้นทั้งหมด
        const firstProduct = Object.keys(productMap)[0];
        showProduct(firstProduct);
        // เปลี่ยนรายละเอียดเมื่อเลือก dropdown
        document.getElementById("productDropdown").addEventListener("change", (e) => {
            showProduct(e.target.value);
        });

    } catch (error) {
        console.error(error);
        document.getElementById("summaryByProduct").textContent = "โหลดข้อมูลไม่สำเร็จ";
    }
}

// เรียกใช้ทั้งสองฟังก์ชันเมื่อโหลดหน้า
document.addEventListener("DOMContentLoaded", () => {
    loadSummary();
    loadProductsSummary();
});



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
