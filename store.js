const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/dripnovaofficial-coder/dripnova.style/main/";

let productsData = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch(GITHUB_RAW_BASE + "products.json");
    productsData = await res.json();
    const page = location.pathname;

    if (page.includes("product.html")) renderProductPage();
    else renderShop();
    renderCart(); // update cart on load
  } catch (err) {
    console.error("Error loading products:", err);
  }
});

function renderShop() {
  const shop = document.getElementById("shop");
  if (!shop) return;
  shop.innerHTML = "";

  productsData.forEach(p => {
    const img = p.images[0]?.front || "";
    const el = document.createElement("div");
    el.className = "product-card";
    el.innerHTML = `
      <img src="${GITHUB_RAW_BASE + img}" class="product-img"/>
      <h3>${p.name}</h3>
      <p>Rs ${p.price}</p>
      <button onclick="viewProduct('${p.id}')">View Product</button>
    `;
    shop.appendChild(el);
  });
}

function viewProduct(id) {
  window.location.href = "product.html?id=" + encodeURIComponent(id);
}

function renderProductPage() {
  const id = new URLSearchParams(location.search).get("id");
  const product = productsData.find(p => p.id === id);
  if (!product) return;

  const gallery = document.getElementById("gallery");
  const info = document.getElementById("productInfo");
  gallery.innerHTML = `<img src="${GITHUB_RAW_BASE + product.images[0].front}" class="detail-img" id="mainImg"/>`;

  info.innerHTML = `
    <h2>${product.name}</h2>
    <p><b>Type:</b> ${product.type}</p>
    <p><b>Price:</b> Rs ${product.price}</p>
    <label>Size:</label>
    <select id="sizeSelect">${product.sizes.map(s=>`<option>${s}</option>`).join("")}</select>
    <label>Colour:</label>
    <select id="colorSelect">${product.images.map(i=>`<option>${i.color}</option>`).join("")}</select>
    <button onclick="addToCart('${product.id}')">Add to Cart</button>
    <button onclick="openCart()">View Cart</button>
  `;

  document.getElementById("colorSelect").addEventListener("change", e => {
    const color = e.target.value;
    const imgObj = product.images.find(i => i.color === color);
    document.getElementById("mainImg").src = GITHUB_RAW_BASE + imgObj.front;
  });
}

function addToCart(id) {
  const product = productsData.find(p => p.id === id);
  if (!product) return;
  const size = document.getElementById("sizeSelect")?.value || product.sizes[0];
  const color = document.getElementById("colorSelect")?.value || product.images[0].color;
  const image = product.images.find(i => i.color === color)?.front || product.images[0].front;

  cart.push({id: product.id, name: product.name, size, color, price: product.price, image});
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("✅ Added to Cart!");
  renderCart();
}

function openCart() {
  document.getElementById("cart").style.display = "flex";
  renderCart();
}

function closeCart() {
  document.getElementById("cart").style.display = "none";
}

function renderCart() {
  const list = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  if (!list || !totalEl) return;

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

  totalEl.innerText = cart.reduce((a,b)=>a+b.price,0);
}

function removeFromCart(i) {
  cart.splice(i,1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function checkout() {
  if (cart.length === 0) return alert("Cart empty ❌");
  const name = document.getElementById("cName").value;
  const email = document.getElementById("cEmail").value;
  const phone = document.getElementById("cPhone").value;
  const address = document.getElementById("cAddress").value;

  if (!name || !email || !phone || !address) return alert("Please fill all details ❌");

  const order = {customer:{name,email,phone,address}, items:cart, total:cart.reduce((a,b)=>a+b.price,0)};
  console.log("Order placed:", order);
  cart = [];
  localStorage.setItem("cart","[]");
  closeCart();
  alert("Order placed ✅");
}
