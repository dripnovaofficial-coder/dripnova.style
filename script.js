const PRODUCTS_JSON = "https://script.google.com/macros/s/AKfycbwCpqcS-jr4ixKyz-odcTsJ9qfI_bkwERG2rFAZsHWgiQ_gjSJYxgOzuZJZf61hFfSr/exec";

document.addEventListener("DOMContentLoaded", () => {
  fetch(PRODUCTS_JSON)
    .then(r => r.json())
    .then(products => {
      const path = location.pathname;
      if (path.includes("product.html")) renderProductPage(products);
      else renderIndex(products);
    }).catch(e => console.error(e));
});

/* --- Shop Page --- */
function renderIndex(products) {
  const list = document.getElementById("product-list");
  if (!list) return;
  list.innerHTML = "";
  products.forEach(p => {
    const el = document.createElement("div");
    el.className = "product";
    el.innerHTML = `
      <div class="thumb"><img src="${p.images[0].front}" alt="${p.name}"></div>
      <h3>${p.name}</h3>
      <p class="price">PKR ${p.price}</p>
      <button class="small btn" onclick="addToCartPage('${p.id}')">View</button>
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

  gallery.innerHTML = `<div class="gallery-main"><img src="${product.images[0].front}" alt="${product.name}"></div><div class="gallery-thumbs"></div>`;
  const mainImg = gallery.querySelector("img");
  const thumbs = gallery.querySelector(".gallery-thumbs");

  product.images.forEach(imgObj => {
    const t = document.createElement("div");
    t.className = "thumb-swatch";
    t.innerHTML = `<img src="${imgObj.front}" alt="${imgObj.color}">`;
    t.onclick = () => mainImg.src = imgObj.front;
    thumbs.appendChild(t);
  });

  info.innerHTML = `
    <h2>${product.name}</h2>
    <p class="muted">${product.description}</p>
    <div class="card">
      <div class="price">PKR ${product.price}</div>
      <label>Size:</label>
      <select id="sizeSelect">${product.sizes.map(s=>`<option>${s}</option>`).join('')}</select>
      <label>Color:</label>
      <select id="colorSelect">${product.images.map(c=>`<option>${c.color}</option>`).join('')}</select>
      <div class="actions">
        <button class="btn" onclick="addToCart('${product.id}')">Add to Cart</button>
        <a href="index.html" class="btn secondary">Back</a>
      </div>
    </div>
  `;
}

/* --- Cart --- */
function addToCart(id){
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const size = document.getElementById("sizeSelect")?.value || "";
  const color = document.getElementById("colorSelect")?.value || "";
  fetch(PRODUCTS_JSON)
    .then(r => r.json())
    .then(allProducts => {
      const product = allProducts.find(p => p.id===id);
      if(!product) return;
      cart.push({...product, size, color});
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Product added to cart!");
    });
}
