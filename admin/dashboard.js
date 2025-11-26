const API = "https://bakery-api-1fji.onrender.com/stats/summary";
const API_BEST = "https://bakery-api-1fji.onrender.com/stats/best-sellers";
const API_BEST_SELL = "https://bakery-api-1fji.onrender.com/sales";
const API_PRODUCTS = "https://bakery-api-1fji.onrender.com/products";

// สรุปยอดรวม
async function loadSummary() {
    try {
        const res = await fetch(API);
        if (!res.ok) throw new Error("โหลด summary ไม่สำเร็จ");
        const data = await res.json();

        document.getElementById("totalStock").textContent = data.totalStock;
        document.getElementById("totalSold").textContent = data.totalSoldQuantity;
        document.getElementById("totalRemaining").textContent = data.totalRemainingStock;
    } catch (error) {
        console.error(error);
        document.getElementById("totalStock").textContent = "-";
        document.getElementById("totalSold").textContent = "-";
        document.getElementById("totalRemaining").textContent = "-";
    }
}

// แสดงรายละเอียดสินค้าทั้งหมด + dropdown
async function loadProductsSummary() {
    try {
        const res = await fetch(API_PRODUCTS);
        if (!res.ok) throw new Error("โหลดสินค้าตามหมวดไม่สำเร็จ");
        const data = await res.json();
        const items = data.items || [];

        const productMap = {};
        items.forEach(item => {
            const name = item.name || "Unknown";
            if (!productMap[name]) {
                productMap[name] = {
                    totalStock: item.totalStock || 0,
                    soldQuantity: item.soldQuantity || 0,
                    remainingStock: (item.totalStock || 0) - (item.soldQuantity || 0),
                    price: item.price || 0
                };
            }
        });

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
              <div class="product-card">
                    <p class="product-name">${name}</p>
                    <div class="stock-summary">
                        <div class="summary-box">Total <span>${info.totalStock}</span></div>
                        <div class="summary-box">Sold <span>${info.soldQuantity}</span></div>
                        <div class="summary-box">Remaining <span>${info.remainingStock}</span></div>
                    </div>
             </div>
            `;
        }

        showProduct(Object.keys(productMap)[0]);

        document.getElementById("productDropdown").addEventListener("change", e => {
            showProduct(e.target.value);
        });

    } catch (error) {
        console.error(error);
        document.getElementById("summaryByProduct").textContent = "โหลดข้อมูลไม่สำเร็จ";
    }
}

// สินค้าขายดีที่สุด
// สินค้าขายดีที่สุด (แยกตามจำนวน + รายได้)
async function loadBestSellers() {
    try {
        const res = await fetch(API_BEST);
        if (!res.ok) throw new Error("โหลดสินค้าขายดีไม่สำเร็จ");
        const data = await res.json();

        const bestQty = data.bestByQuantity;
        const bestRev = data.bestByRevenue;

        // แสดงสินค้าขายดีที่สุดตามจำนวน
        document.getElementById("bestQuantity").innerHTML = `
        <p>จำนวนมากที่สุด</p>
            <div class="summary-box">
            <p class="product-name">${bestQty.name}</p>
                <div class="summary-grid">
                    <div class="label">ขายไปแล้ว</div>
                    <div class="label">ราคา</div>
                    <div class="value">${bestQty.soldQuantity} ชิ้น</div>
                    <div class="value">$${bestQty.price}</div>
                </div>
            </div>
        `;

        // แสดงสินค้าขายดีที่สุดตามรายได้
        document.getElementById("bestRevenue").innerHTML = `
        <p>รายได้สูงสุด</p>
            <div class="summary-box">
            <p class="product-name">${bestRev.name}</p>
                <div class="summary-grid-3">
                    <div class="label">ขายไปแล้ว</div>
                    <div class="label">ราคา</div>
                    <div class="label">ยอดขายรวม</div>

                    <div class="value">${bestRev.soldQuantity} ชิ้น</div>
                    <div class="value">$${bestRev.price}</div>
                    <div class="value">$${bestRev.totalRevenue}</div>
                </div>
        `;

    } catch (error) {
        console.error(error);
        document.getElementById("bestQuantity").textContent = "โหลดข้อมูลไม่สำเร็จ";
        document.getElementById("bestRevenue").textContent = "โหลดข้อมูลไม่สำเร็จ";
    }
}


// ยอดขายรวมตามจำนวนและรายได้
async function fetchSales() {
    try {
        const res = await fetch(API_BEST_SELL);
        const data = await res.json();
        const salesArray = data.items || [];
        if (salesArray.length === 0) return;

        const productMap = {};
        salesArray.forEach(sale => {
            if (!productMap[sale.productName]) productMap[sale.productName] = { quantity: 0, revenue: 0 };
            productMap[sale.productName].quantity += sale.quantity;
            productMap[sale.productName].revenue += sale.totalAmount;
        });

        const labels = Object.keys(productMap);
        const quantities = Object.values(productMap).map(info => info.quantity);
        const revenues = Object.values(productMap).map(info => info.revenue);

        // Pie chart - ยอดขายตามจำนวน
        new Chart(document.getElementById("chartByQuantity"), {
            type: "pie",
            data: {
                labels: labels,
                datasets: [{
                    data: quantities,
                    backgroundColor: labels.map(() => `hsl(${Math.random() * 360}, 70%, 70%)`)
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'right' }
                }
            }
        });

        // Pie chart - ยอดขายตามรายได้
        new Chart(document.getElementById("chartByRevenue"), {
            type: "pie",
            data: {
                labels: labels,
                datasets: [{
                    data: revenues,
                    backgroundColor: labels.map(() => `hsl(${Math.random() * 360}, 70%, 70%)`)
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'right' }
                }
            }
        });

    } catch (err) {
        console.error(err);
    }
}


// โหลดทั้งหมดเมื่อหน้าโหลด
document.addEventListener("DOMContentLoaded", () => {
    loadSummary();
    loadProductsSummary();
    loadBestSellers();
    fetchSales();
});
