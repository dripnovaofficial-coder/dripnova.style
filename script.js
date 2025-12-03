const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/dripnovaofficial-coder/dripnova.style/main/products/";
let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch(GITHUB_RAW_BASE + "products.json");
  const products = await res.json();

  if (document.getElementById("shop")) renderShop(products);
  if (document.getElementById("productInfo")) loadProductPage(products);
});

function renderShop(products) {
  const shop = document.getElementById("shop");
  shop.innerHTML = "";

  products.forEach(p => {
    const img = p.images[0]?.front || "placeholder.jpg";
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <img src="${GITHUB_RAW_BASE + img}" class="product-img"/>
      <h3>${p.name}</h3>
      <p>Rs ${p.price}</p>
      <button onclick="viewProduct('${p.id}')">View Product</button>
    `;
    shop.appendChild(div);
  });
}

function viewProduct(id) {
  location.href = `product.html?id=${encodeURIComponent(id)}`;
}

/* PRODUCT PAGE */
function loadProductPage(products) {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const product = products.find(p => p.id === id);
  if (!product) return;

  const gallery = document.getElementById("gallery");
  const info = document.getElementById("productInfo");

  gallery.innerHTML = `<img src="${GITHUB_RAW_BASE + product.images[0].front}" class="detail-img">`;

  info.innerHTML = `
    <h2>${product.name}</h2>
    <p>Type: ${product.type}</p>
    <p>Price: Rs ${product.price}</p>

    <label>Size:</label>
    <select id="sizeSelect">${product.sizes.map(s => `<option>${s}</option>`).join("")}</select>

    <label>Color:</label>
    <select id="colorSelect">${product.images.map(i => `<option>${i.color}</option>`).join("")}</select>

    <button onclick="addToCart('${product.id}')">Add to Cart</button>
  `;
}

/* CART FUNCTIONS */
function addToCart(id) {
  fetch(GITHUB_RAW_BASE + "products.json")
    .then(res => res.json())
    .then(products => {
      const product = products.find(p => p.id === id);
      const size = document.getElementById("sizeSelect")?.value || product.sizes[0];
      const color = document.getElementById("colorSelect")?.value || product.images[0].color;
      const variant = product.images.find(v => v.color === color);

      cart.push({
        id: product.id,
        name: product.name,
        size,
        color,
        price: product.price,
        image: variant.front
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("✅ Added to Cart!");
    });
}

function openCart() {
  const modal = document.getElementById("cart");
  modal.style.display = "flex";

  const list = document.getElementById("cartItems");
  list.innerHTML = cart.map((i, idx) => `
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

  document.getElementById("cartTotal").innerText = "Total: Rs " + cart.reduce((a,b)=>a+b.price,0);
}

function removeFromCart(idx) {
  cart.splice(idx,1);
  localStorage.setItem("cart", JSON.stringify(cart));
  openCart();
}

function closeCart() {
  document.getElementById("cart").style.display = "none";
}

function checkout() {
  alert("Checkout functionality not yet linked!"); 
}
