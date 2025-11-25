const API_URL = "https://bakery-api-1fji.onrender.com/products";

// ----------- LOAD PRODUCTS -------------
async function loadProducts() {
    const res = await fetch(API_URL);
    const data = await res.json();

    const list = document.getElementById("product-list");
    list.innerHTML = "";

    data.items.forEach(product => {

        const div = document.createElement("div");
        div.className = "product-item";

        div.innerHTML = `
            <div class="product-info">
                <strong>${product.name}</strong>
                ราคา: ${product.price} $<br>
                สต็อก: ${product.remainingStock ?? 0} ชิ้น            
            </div>

            <div class="product-actions">
                <button class="edit-btn" 
                    onclick="editProduct('${product.id}','${product.name}',${product.price},'${product.imagePath}',${product.stock})">
                    แก้ไข
                </button>

                <button class="delete-btn" onclick="deleteProduct('${product.id}')">
                    ลบ
                </button>
            </div>
        `;

        list.appendChild(div);
    });
}

loadProducts();

// ----------- ADD PRODUCT -------------
async function addProduct() {
    const name = document.getElementById("name").value;
    const price = Number(document.getElementById("price").value);
    const imagePath = document.getElementById("imagePath").value;
    const totalStock = Number(document.getElementById("totalStock").value);

    const product = { name, price, imagePath, totalStock};

    await fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(product)
    });

    alert("เพิ่มสินค้าเรียบร้อย!");
    loadProducts();
}

// ----------- EDIT PRODUCT -------------
function editProduct(id, name, price, imagePath, totalStock) {
    const newName = prompt("แก้ไขชื่อสินค้า", name);
    const newPrice = prompt("แก้ไขราคา", price);
    const newImagePath = prompt("แก้ไขรูปภาพ", imagePath);
    const newTotalStock = prompt("แก้ไขสต็อก", totalStock);

    if (!newName || !newPrice) return;

    fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            name: newName,
            price: Number(newPrice),
            imagePath: newImagePath,
            totalStock: Number(newTotalStock)
        })
    })
    .then(() => {
        alert("แก้ไขสำเร็จ!");
        loadProducts();
    });
}

