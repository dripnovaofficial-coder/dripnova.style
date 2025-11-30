const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbw8IpulC-Oxf_opfeZ_Sy4_qMaUYcSNPlXHdP14pxtseAkG8fWjtjhS1_zd83eNKWsI/exec"; // Your Apps Script Web App

document.addEventListener("DOMContentLoaded", () => {
  fetch(WEBAPP_URL)
    .then(r => r.json())
    .then(products => {
      const path = location.pathname;
      if (path.includes("product.html")) renderProductPage(products);
      else if (path.includes("payment.html")) renderCart();
      else renderIndex(products);
    })
    .catch(err => console.error("Failed to fetch products:", err));
});

/* --- Shop Page --- */
function renderIndex(products) {
  const list = document.getElementById("product-list");
  if (!list) return;
  list.innerHTML = "";
  products.forEach(p => {
    const el = document.createElement("div");
    el.className = "product";
    const img = p.images[0]?.front || "";
    el.innerHTML = `
      <div class="thumb"><img src="${img}" alt="${p.name}"></div>
      <h3>${p.name}</h3>
      <p class="price">PKR ${p.price}</p>
      <button class="small btn" onclick="addToCartPage('${p.id}')">Add to Cart</button>
    `;
    el.onclick = () => location.href = `product.html?id=${encodeURIComponent(p.id)}`;
    list.appendChild(el);
  });
}

function addToCartPage(id) {
  location.href = `product.html?id=${encodeURIComponent(id)}`;
}

/* --- Product Page --- */
function renderProductPage(products) {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const product = products.find(p => p.id === id);
  if (!product) return;

  const gallery = document.getElementById("gallery");
  const info = document.getElementById("productInfo");

  // Gallery
  const mainImg = document.createElement("img");
  mainImg.src = product.images[0]?.front || "";
  mainImg.alt = product.name;
  gallery.innerHTML = `<div class="gallery-main"></div><div class="gallery-thumbs"></div>`;
  gallery.querySelector(".gallery-main").appendChild(mainImg);

  const thumbs = gallery.querySelector(".gallery-thumbs");
  product.images.forEach(imgObj => {
    const t = document.createElement("div");
    t.className = "thumb-swatch";
    const imgSrc = imgObj.front || "";
    t.innerHTML = `<img src="${imgSrc}" alt="${imgObj.color || 'default'}">`;
    t.onclick = () => mainImg.src = imgSrc;
    thumbs.appendChild(t);
  });

  // Info
  info.innerHTML = `
    <h2>${product.name}</h2>
    <p class="muted">${product.description || ''}</p>
    <div class="card">
      <div class="price">PKR ${product.price}</div>
      <label>Size:</label>
      <select id="sizeSelect">${(product.sizes || []).map(s => `<option>${s}</option>`).join('')}</select>
      <label>Color:</label>
      <select id="colorSelect">${(product.images || []).map(c => `<option>${c.color}</option>`).join('')}</select>
      <div class="actions">
        <button class="btn" onclick="addToCart('${product.id}')">Add to Cart</button>
        <a href="index.html" class="btn secondary">Back</a>
      </div>
    </div>
  `;
}

/* --- Cart --- */
function addToCart(id) {
  fetch(WEBAPP_URL)
    .then(r => r.json())
    .then(allProducts => {
      const product = allProducts.find(p => p.id === id);
      if (!product) return;

      const size = document.getElementById("sizeSelect")?.value || product.sizes[0];
      const color = document.getElementById("colorSelect")?.value || product.images[0]?.color || "default";

      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push({ ...product, size, color });
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Product added to cart!");
    });
}

function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartSummary = document.getElementById("cartSummary");
  const cartTotal = document.getElementById("cartTotal");
  if (!cartSummary) return;

  if (cart.length === 0) {
    cartSummary.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    let total = 0;
    cartSummary.innerHTML = cart.map(item => {
      total += Number(item.price || 0);
      return `<div class="card">
        <p><strong>${item.name}</strong></p>
        <p>Color: ${item.color}</p>
        <p>Size: ${item.size}</p>
        <p>Price: PKR ${item.price}</p>
      </div>`;
    }).join('');
    cartTotal.textContent = "Total: PKR " + total;
  }

  const confirmBtn = document.getElementById("confirmPayment");
  if (confirmBtn) {
    confirmBtn.onclick = () => {
      if (cart.length === 0) { alert("Cart empty."); return; }
      sessionStorage.setItem("dripnova_order", JSON.stringify(cart[cart.length - 1]));
      localStorage.removeItem("cart");
      alert("Payment confirmed! Redirecting to Thank You page.");
      location.href = "thankyou.html";
    };
  }
}
