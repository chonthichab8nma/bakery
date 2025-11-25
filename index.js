const API_URL = "https://bakery-api-1fji.onrender.com/products";
const IMAGE_BASE_URL = "https://uunyyytttawccmjtzjdz.supabase.co/storage/v1/object/public/products/";

const productList = document.getElementById("product-list");

async function loadProduct() {
    const res = await fetch(API_URL);
    const json = await res.json();
    const items = json.items;
    console.log("API Product:", items);

    items.forEach(product => {
        const item = document.createElement("div");
        item.className = "product-card";

       
        const imageUrl = `${IMAGE_BASE_URL}${product.imagePath.replace("public/", "")}`;

        item.innerHTML = `
            <img src="${imageUrl}" alt="${product.name}">
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
