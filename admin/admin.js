const API_URL = "https://bakery-api-1fji.onrender.com/products";

// ---------------- LOAD PRODUCTS ----------------
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
                สต็อกทั้งหมด: ${product.totalStock ?? 0} ชิ้น <br>
                ขายไปแล้ว: ${product.soldQuantity ?? 0} ชิ้น <br>
                คงเหลือ: ${product.remainingStock ?? 0} ชิ้น
            </div>

            <div class="product-actions">
                <button class="edit-btn"
                    onclick="editProduct('${product.id}','${product.name}',${product.price},'${product.imagePath}',${product.totalStock})">
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


// ---------------- ADD PRODUCT ----------------
async function addProduct() {
    const name = document.getElementById("name").value;
    const price = Number(document.getElementById("price").value);
    const imagePath = document.getElementById("imagePath").value;
    const totalStock = Number(document.getElementById("totalStock").value);

    const product = { name, price, imagePath, totalStock };

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
    });

    alert("เพิ่มสินค้าเรียบร้อย!");
    loadProducts();
}


// EDIT PRODUCT POPUP 

function editProduct(id, name, price, imagePath, totalStock) {
    editId = id;

    document.getElementById("editName").value = name;
    document.getElementById("editPrice").value = price;
    document.getElementById("editStock").value = totalStock;
    document.getElementById("editImage").value = imagePath.split("-").pop();

    document.getElementById("editModal").style.display = "block";
}


// ปิด popup
document.getElementById("closeModal").onclick = () => {
    document.getElementById("editModal").style.display = "none";
};


//  SAVE EDIT
document.getElementById("saveEdit").onclick = async () => {
    const newName = document.getElementById("editName").value;
    const newPrice = Number(document.getElementById("editPrice").value);
    const newTotalStock = Number(document.getElementById("editStock").value);
    const newFile = document.getElementById("editImage").value.trim();

    // ถ้ามีการแก้ไขชื่อรูป
    const newImagePath = newFile
        ? `products/${Date.now()}-${newFile}`
        : undefined;

    const updateData = {
        name: newName,
        price: newPrice,
        totalStock: newTotalStock
    };

    if (newImagePath) updateData.imagePath = newImagePath;

    console.log("ส่งข้อมูลแก้ไข:", updateData);

    await fetch(`${API_URL}/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
    });

    alert("แก้ไขเสร็จแล้ว!");

    document.getElementById("editModal").style.display = "none";

    loadProducts();
};


// DELETE 
async function deleteProduct(id) {
    if (!confirm("คุณต้องการลบสินค้านี้หรือไม่?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            alert("ลบสินค้าไม่สำเร็จ!");
            return;
        }

        alert("ลบสินค้าเรียบร้อย!");
        loadProducts(); // โหลดรายการใหม่หลังจากลบสำเร็จ
    } 
    catch (err) {
        console.error("ลบสินค้า error:", err);
        alert("เกิดข้อผิดพลาด ไม่สามารถลบสินค้าได้");
    }
}

