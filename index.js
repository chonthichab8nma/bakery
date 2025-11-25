
const API_URL = "https://api.allorigins.win/raw?url=https://bakery-api-1fji.onrender.com/products";

const productList = document.getElementById("product-list");

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
    `;

    productList.appendChild(item);
  });
}

loadProduct();