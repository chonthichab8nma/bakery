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

    items.forEach(product => {
        const item = document.createElement("div");
        item.className = "product-card";

        const imageUrl = getImageUrl(product.imagePath);
        console.log("Image URL:", imageUrl);

        item.innerHTML = `
            <img src="${imageUrl}">
            <h3>${product.name}</h3>
            <p>ราคา: ${product.price} บาท</p>
            <button class="add-cart-btn">เพิ่มลงตระกร้า</button>
            <button class="buy-btn">ซื้อสินค้า</button>
        `;

        // เพิ่มลงตะกร้า
        item.querySelector(".add-cart-btn").addEventListener("click", () => {
            const cartItem = {
                ...product,
                quantity: 1,
                image: imageUrl
            };
            localStorage.setItem("cart", JSON.stringify([cartItem]));
            window.location.href = "cart.html";
        });

        // ซื้อสินค้า
        item.querySelector(".buy-btn").addEventListener("click", () => {
            const buyItem = {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                imagePath: product.imagePath,
                image: imageUrl
            };
            localStorage.setItem("purchases", JSON.stringify([buyItem]));
            window.location.href = "purchases.html";
        });

        productList.appendChild(item);
    });
}

loadProduct();
