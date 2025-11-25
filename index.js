const API_URL = "https://bakery-api-1fji.onrender.com/products";


const productList = document.getElementById("product-list");
function getImageUrl(path) {
    const BASE = "https://uunyyytttawccmjtzjdz.supabase.co/storage/v1/object/";

     return BASE + (path.replace("public/", "products/"));
}


async function loadProduct() {
    const res = await fetch(API_URL);
    const json = await res.json();
    const items = json.items;

    for (const index in items) {
    const product = items[index];

    const item = document.createElement("div");
    item.className = "product-card";

    const imageUrl = getImageUrl(product.imagePath);
    console.log("Image URL:", imageUrl);

    item.innerHTML = `
        <img src="${imageUrl}">
        <h3>${product.name}</h3>
        <p>ราคา: ${product.price} $</p>
        <p>คลัง: ${product.remainingStock ?? 0} ชิ้น</p>
        <button class="add-cart-btn">เพิ่มลงตะกร้า</button>
        <button class="buy-btn">ซื้อสินค้า</button>
    `;

    // ⭐ เพิ่มลงตะกร้า
    item.querySelector(".add-cart-btn").addEventListener("click", () => {

        if (product.remainingStock <= 0) {
            alert("สินค้านี้หมดแล้ว!");
            return; 
        }

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingItem = cart.find(i => i.id === product.id);

        if (existingItem) {
            if (existingItem.quantity >= product.remainingStock) {
                alert("จำนวนเกินสต็อกที่มีอยู่!");
                return;
            }
            existingItem.quantity++;
        } else {
            cart.push({
                ...product,
                quantity: 1,
                image: imageUrl,
                remainingStock: product.remainingStock
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert("เพิ่มสินค้าลงตะกร้าแล้ว!");
    });

    // ⭐ ซื้อสินค้า
    item.querySelector(".buy-btn").addEventListener("click", () => {

        if (product.remainingStock <= 0) {
            alert("สินค้านี้หมดแล้ว!");
            return;
        }

        const buyItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            imagePath: product.imagePath,
            remainingStock: product.remainingStock
        };

        localStorage.setItem("purchases", JSON.stringify([buyItem]));
        window.location.href = "purchases.html";
    });

    productList.appendChild(item);
}

}

loadProduct();
