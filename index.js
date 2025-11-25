const API_URL = "https://bakery-api-1fji.onrender.com/products";

const productList = document.getElementById("product-list");

async function loadProduct() {
    const res = await fetch(API_URL);
    const data = await res.json();

    data.forEach(product => {
        const item = document.createElement("div");
        item.className = "product-card"

        item.innerHTML = `
            <img src="${data.image}" alt="">
            <h3>${data.name}</h3>
            <p>ราคา: ${data.price} บาท</p>
        `;

        productList.appendChild(item);

    });
    
}
loadProduct();