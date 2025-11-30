const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbyMOmeHrMRVzTWnPQ30XbQB0kpzckuYxIszTwlzsX675bNn-n_xeXXqiHeISYxezfZo/exec";
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/dripnovaofficial-coder/dripnova.style/main/";

document.addEventListener("DOMContentLoaded", () => {
  fetch(GITHUB_RAW_BASE + "products.json")
    .then(r => r.json())
    .then(products => {
      const page = location.pathname;

      if (page.includes("product.html")) renderProductPage(products);
      else if (page.includes("payment.html")) renderCart();
      else renderIndex(products);
    })
    .catch(err => console.error("Fetch error:", err));
});

/* --- SHOP PAGE --- */
function renderIndex(products) {
  const list = document.getElementById("product-list");
  if (!list) return;
  list.innerHTML = "";

  products.forEach(p => {
    const el = document.createElement("div");
    el.className = "product";
    el.innerHTML = `
      <div class="thumb"><img src="${p.images[0]?.front ? GITHUB_RAW_BASE + p.images[0].front : "placeholder.jpg"}" alt="${p.name}"></div>
      <h3>${p.name}</h3>
      <p class="price">PKR ${p.price}</p>
      <button class="small btn" onclick="addToCart('${p.id}')">Add to Cart</button>
    `;

    el.onclick = (e) => {
      if (e.target.tagName !== "BUTTON")
      location.href = `product.html?id=${encodeURIComponent(p.id)}`;
    };
    list.appendChild(el);
  });
}

/* --- PRODUCT DETAIL PAGE --- */
function renderProductPage(products) {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const product = products.find(p => p.id === id);
  if (!product) return;

  const gallery = document.getElementById("gallery");
  const info = document.getElementById("productInfo");

  gallery.innerHTML = `<div class="gallery-main"></div><div class="gallery-thumbs"></div>`;
  const mainWrap = gallery.querySelector(".gallery-main");
  const mainImg = document.createElement("img");
  mainImg.src = GITHUB_RAW_BASE + (product.images[0]?.front || "placeholder.jpg");
  mainWrap.appendChild(mainImg);

  const thumbs = gallery.querySelector(".gallery-thumbs");
  product.images.forEach(img => {
    const t = document.createElement("div");
    t.className = "thumb-swatch";
    t.innerHTML = `<img src="${GITHUB_RAW_BASE + img.front}">`;
    t.onclick = () => mainImg.src = GITHUB_RAW_BASE + img.front;
    thumbs.appendChild(t);
  });

  info.innerHTML = `
    <h2>${product.name}</h2>
    <div class="card">
      <div class="price">PKR ${product.price}</div>
      <label>Size:</label>
      <select id="sizeSelect">${product.sizes.map(s => `<option>${s}</option>`).join('')}</select>

      <label>Color:</label>
      <select id="colorSelect">${product.images.map(i => `<option>${i.color}</option>`).join('')}</select>

      <div class="actions">
        <button class="btn" onclick="addToCart('${product.id}')">Add to Cart</button>
        <a href="index.html" class="btn secondary">Back</a>
      </div>
    </div>
  `;
}

/* --- CART FUNCTIONS --- */
function addToCart(id) {
  fetch(GITHUB_RAW_BASE + "products.json")
    .then(r => r.json())
    .then(products => {
      const product = products.find(p => p.id === id);
      if (!product) return;

      const size = document.getElementById("sizeSelect")?.value || product.sizes[0];
      const color = document.getElementById("colorSelect")?.value || product.images[0].color;

      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push({ ...product, size, color });
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("✅ Added to Cart!");
    });
}

function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const wrap = document.getElementById("cartSummary");
  const total = document.getElementById("cartTotal");

  if (!wrap) return;
  wrap.innerHTML = "";

  let sum = 0;

  cart.forEach(item => {
    sum += Number(item.price);
    wrap.innerHTML += `
      <div class="card">
        <p><strong>${item.name}</strong></p>
        <p>Color: ${item.color}</p>
        <p>Size: ${item.size}</p>
        <p>Price: PKR ${item.price}</p>
      </div>`;
  });

  total.innerText = `Total: PKR ${sum}`;

  const btn = document.getElementById("confirmPayment");
  if (btn) {
    btn.onclick = () => {
      if (cart.length === 0) { alert("Cart empty ❌"); return; }
      sessionStorage.setItem("dripnova_order", JSON.stringify(cart.at(-1)));
      localStorage.removeItem("cart");
      location.href = "thankyou.html";
    };
  }
}

/* --- ORDER FORM SUBMISSION --- */
function openOrderModal(productId) {
  const modal = document.getElementById("orderModal");
  const wrap = document.getElementById("orderFormWrap");
  modal.style.display = "flex";
  wrap.innerHTML = `
    <h2>Place Order</h2>
    <input placeholder="Name" id="orderName"/>
    <input placeholder="Phone" id="orderPhone"/>
    <textarea placeholder="Address" id="orderAddress"></textarea>
    <button class="btn" onclick="submitOrder('${productId}')">Confirm Order</button>
  `;
}

function closeModal() {
  document.getElementById("orderModal").style.display = "none";
}

function submitOrder(id) {
  const order = {
    id,
    name: document.getElementById("orderName").value,
    phone: document.getElementById("orderPhone").value,
    address: document.getElementById("orderAddress").value,
    price: document.getElementById("sizeSelect")?.value || ""
  };

fetch(WEBAPP_URL, {
  method: "POST",
  body: JSON.stringify(order)
}).then(()=> location.href = "thankyou.html");
}
