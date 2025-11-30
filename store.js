const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/dripnovaofficial-coder/dripnova.style/main/";

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Load shop
async function loadShop() {
  const res = await fetch(GITHUB_RAW_BASE + "products.json");
  const products = await res.json();
  renderShop(products);
}

function renderShop(products) {
  const shop = document.getElementById("shop");
  shop.innerHTML = "";
  products.forEach(p => {
    const firstImage = p.variants[0]?.images?.front || "";
    shop.innerHTML += `
      <div class="product-card">
        <img src="${GITHUB_RAW_BASE + firstImage}" class="product-img"/>
        <h3>${p.name}</h3>
        <p>Rs ${p.price}</p>
        <button onclick="viewProduct('${p.id}')">View Product</button>
      </div>
    `;
  });
}

function viewProduct(id) {
  window.location.href = "product.html?id=" + encodeURIComponent(id);
}

// Load product page
async function loadProductPage() {
  const res = await fetch(GITHUB_RAW_BASE + "products.json");
  const products = await res.json();
  const id = new URLSearchParams(window.location.search).get("id");
  const p = products.find(x => x.id === id);
  if (!p) return;

  let selectedVariant = p.variants[0] || {};
  const gallery = document.getElementById("gallery");
  const info = document.getElementById("productInfo");

  function updateGallery() {
    gallery.innerHTML = "";
    if (selectedVariant.images) {
      if (selectedVariant.images.front) gallery.innerHTML += `<img src="${GITHUB_RAW_BASE + selectedVariant.images.front}" class="detail-img"/>`;
      if (selectedVariant.images.back) gallery.innerHTML += `<img src="${GITHUB_RAW_BASE + selectedVariant.images.back}" class="detail-img"/>`;
      if (selectedVariant.images.folded) gallery.innerHTML += `<img src="${GITHUB_RAW_BASE + selectedVariant.images.folded}" class="detail-img"/>`;
    }
  }

  updateGallery();

  info.innerHTML = `
    <h2>${p.name}</h2>
    <p><b>Type:</b> ${p.type}</p>
    <p><b>Price:</b> Rs ${p.price}</p>
    <p>${p.description}</p>

    <label>Size:</label>
    <select id="sizeSelect">${p.sizes.map(s => `<option>${s}</option>`).join("")}</select>

    <label>Colour:</label>
    <select id="variantSelect">${p.variants.map(v => `<option value="${v.color}">${v.color}</option>`)}</select>

    <br/><br/>
    <button onclick="addToCart('${p.id}')">Add to Cart</button>
    <button onclick="openCart()">View Cart</button>
  `;

  document.getElementById("variantSelect").addEventListener("change", e => {
    selectedVariant = p.variants.find(v => v.color === e.target.value);
    updateGallery();
  });
}

// Add to cart
async function addToCart(id) {
  const res = await fetch(GITHUB_RAW_BASE + "products.json");
  const products = await res.json();
  const p = products.find(x => x.id === id);
  if (!p) return;

  const size = document.getElementById("sizeSelect").value;
  const color = document.getElementById("variantSelect").value;
  const variant = p.variants.find(v => v.color === color);

  const item = {
    id: p.id,
    name: p.name,
    type: p.type,
    size,
    color,
    price: p.price,
    image: variant?.images?.front || ""
  };

  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to Cart ✅");
}

// Cart UI
function openCart() {
  const cartBox = document.getElementById("cart");
  cartBox.style.display = "flex";

  const list = document.getElementById("cartItems");
  list.innerHTML = cart.map((i,idx) => `
    <div class="cart-item">
      <img src="${GITHUB_RAW_BASE + i.image}" class="cart-img"/>
      <div>
        <h4>${i.name}</h4>
        <p>Size: ${i.size} | Colour: ${i.color}</p>
        <p>Rs ${i.price}</p>
        <button onclick="removeFromCart(${idx})">Remove</button>
      </div>
    </div>
  `).join("");

  document.getElementById("cartTotal").innerText = cart.reduce((a,b) => a + b.price,0);
}

function removeFromCart(i) {
  cart.splice(i,1);
  localStorage.setItem("cart", JSON.stringify(cart));
  openCart();
}

function closeCart() {
  document.getElementById("cart").style.display = "none";
}

// Checkout → Google Sheets
async function checkout() {
  if (cart.length === 0) return alert("Cart empty ❌");

  const name = document.getElementById("cName").value;
  const email = document.getElementById("cEmail").value;
  const phone = document.getElementById("cPhone").value;
  const address = document.getElementById("cAddress").value;

  if (!name || !email || !phone || !address) return alert("Please fill all details ❌");

  const order = {
    customer: {name,email,phone,address},
    items: cart,
    total: cart.reduce((a,b)=>a+b.price,0),
    date: new Date().toLocaleString()
  };

  await fetch("YOUR_GOOGLE_WEB_APP_URL", {method: "POST", body: JSON.stringify(order)});
  alert("Order Placed ✅ Relax 😎");
  cart = [];
  localStorage.setItem("cart","[]");
  closeCart();
}
