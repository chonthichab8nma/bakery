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
                    onclick="editProduct('${product.id}','${product.name}',${product.price},'${product.imagePath}',${product.remainingStock})">
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
    const remainingStock = Number(document.getElementById("remainingStock").value);

    const product = { name, price, imagePath, remainingStock};

    await fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(product)
    });

    alert("เพิ่มสินค้าเรียบร้อย!");
    loadProducts();
}

// ----------- EDIT PRODUCT -------------
let editId = null; // เก็บ id ที่กำลังแก้ไข

function editProduct(id, name, price, imagePath, remainingStock) {
    editId = id;

    //  ใส่ข้อมูลลง input ของ popup
    document.getElementById("editName").value = name;
    document.getElementById("editPrice").value = price;
    document.getElementById("editStock").value = remainingStock;
    document.getElementById("editImage").value = imagePath.split("-").pop(); 


    //  เปิด popup
    document.getElementById("editModal").style.display = "block";
}

//  ปุ่มปิด popup
document.getElementById("closeModal").onclick = () => {
    document.getElementById("editModal").style.display = "none";
};

//  ปุ่มบันทึก
document.getElementById("saveEdit").onclick = async () => {

    const newName = document.getElementById("editName").value;
    const newPrice = Number(document.getElementById("editPrice").value);
    const newStock = Number(document.getElementById("editStock").value);
    const imageFile = document.getElementById("editImage").value.trim();

    // สร้างชื่อไฟล์ใหม่
    const newImagePath = "products/" + Date.now() + "-" + imageFile;

    const updateData = {
        name: newName,
        price: newPrice,
        remainingStock: newStock,
        imagePath: newImagePath
    };

    await fetch(`${API_URL}/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
    });

    alert("แก้ไขรายการสำเร็จ!");

    document.getElementById("editModal").style.display = "none";

    loadProducts(); // โหลดรายการใหม่
};


