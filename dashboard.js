const API = "https://bakery-api-1fji.onrender.com/stats/summary";
const API_BEST = "https://bakery-api-1fji.onrender.com/stats/best-sellers";

async function loadSummary() {
    try {
        const res = await fetch(API);
        if (!res.ok) throw new Error("โหลด summary ไม่สำเร็จ");

        const data = await res.json();
        console.log("Summary:", data);

        // แสดงผลบนหน้าเว็บ
        // document.getElementById("totalProducts").textContent = data.totalProducts;
        document.getElementById("totalStock").textContent = data.totalStock;
        document.getElementById("totalSold").textContent = data.totalSoldQuantity;
        document.getElementById("totalRemaining").textContent = data.totalRemainingStock;

    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
        document.getElementById("totalProducts").textContent = "โหลดข้อมูลไม่ได้";
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
            <p>ราคา: $${bestQty.price}</p>
            <img src="${bestQty.imageUrl}" alt="${bestQty.name}" width="150">
        `;

        // สินค้าขายดีที่สุดตามยอดเงิน
        const bestRev = data.bestByRevenue;
        const bestRevDiv = document.getElementById("bestRevenue");
        bestRevDiv.innerHTML = `
            <h3>ขายดีที่สุด (ยอดเงิน): ${bestRev.name}</h3>
            <p>จำนวนที่ขาย: ${bestRev.soldQuantity}</p>
            <p>ยอดขายรวม: $${bestRev.totalRevenue}</p>
            <p>ราคา: $${bestRev.price}</p>
            <img src="${bestRev.imageUrl}" alt="${bestRev.name}" width="150">
        `;

    } catch (error) {
        console.error(error);
        document.getElementById("bestQuantity").textContent = "โหลดข้อมูลไม่สำเร็จ";
        document.getElementById("bestRevenue").textContent = "โหลดข้อมูลไม่สำเร็จ";
    }
}

// เรียกฟังก์ชันเมื่อโหลดหน้า
document.addEventListener("DOMContentLoaded", loadBestSellers);


loadSummary();
