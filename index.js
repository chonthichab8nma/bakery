
const API_URL = "https://bakery-api-1fji.onrender.com/products";

const productList = document.getElementById("product-list");
// const searchInput = document.getElementById("search");
// const searchBtn = document.getElementById("search-btn");

async function loadProduct() {
    const res = await fetch(API_URL);
    const json = await res.json();
    const items = json.items;  //ดึง array จาก items


    items.forEach(product => {
        const item = document.createElement("div");
        item.className = "product-card";

        // สมมติว่า URL รูปต้องเติม path “/” หรือ base url ถ้า imagePath เป็น relative
        const imageUrl = product.imagePath.startsWith("http")
            ? product.imagePath
            : `https://bakery-api-1fji.onrender.com/${product.imagePath}`;

        item.innerHTML = `
      <img src="${imageUrl}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>ราคา: ${product.price} บาท</p>
    <button class="add-cart-btn">เพิ่มลงตระกร้า</button>
    <button class="buy-btn">ซื้อสินค้า</button>
    `;
        // เพิ่ม: event สำหรับปุ่ม "เพิ่มลงตระกร้า"
        item.querySelector(".add-cart-btn").addEventListener("click", () => {
            // เก็บข้อมูลสินค้าใน localStorage
            localStorage.setItem("cart", JSON.stringify([product]));
            window.location.href = "cart.html"; // เด้งไปหน้า cart
        });

        // เพิ่ม: event สำหรับปุ่ม "ซื้อสินค้า"
        item.querySelector(".buy-btn").addEventListener("click", () => {
            localStorage.setItem("puschases", JSON.stringify([product]));
            window.location.href = "purchases.html"; // เด้งไปหน้า puschases
        });

        productList.appendChild(item);
    });
}

loadProduct();