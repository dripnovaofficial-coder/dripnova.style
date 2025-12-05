// -----------------------------------------------------
// GLOBAL
// -----------------------------------------------------
let products = [];
let cart = JSON.parse(localStorage.getItem("cart") || "[]");
let currentSlide = 0;

// -----------------------------------------------------
// Load products.json
// -----------------------------------------------------
async function loadProducts() {
  if (products.length) return products;
  try {
    const res = await fetch("products.json");
    products = await res.json();
    return products;
  } catch (err) {
    console.error("Failed to load products.json", err);
    products = [];
    return products;
  }
}

// -----------------------------------------------------
// DISPLAY SHOP PAGE (Luxury Minimal)
// -----------------------------------------------------
function displayProductsOnly(list) {
  const container = document.getElementById("product-list");
  if (!container) return;
  container.innerHTML = "";

  list.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";

    const img = p.images?.length ? p.images[0] : "";

    card.innerHTML = `
      <img src="${img}" alt="${p.PRODUCT_NAME}">
      <h3>${escapeHtml(p.PRODUCT_NAME)}</h3>
    `;

    card.onclick = () => viewProduct(p.PRODUCT_ID);
    container.appendChild(card);
  });
}

// -----------------------------------------------------
// VIEW PRODUCT REDIRECT
// -----------------------------------------------------
function viewProduct(id) {
  localStorage.setItem("selectedProduct", id);
  window.location.href = "product.html";
}

// -----------------------------------------------------
// PRODUCT PAGE (Slider + Info + Color & Size)
// -----------------------------------------------------
function loadSingleProductSlider() {
  const id = localStorage.getItem("selectedProduct");
  const p = products.find((x) => x.PRODUCT_ID === id);

  if (!p) return console.error("Product not found", id);

  // Basic product details
  document.getElementById("product-name").innerText = p.PRODUCT_NAME;
  document.getElementById("product-type").innerText = `Type: ${p.TYPE}`;
  document.getElementById("product-price").innerText = `PKR ${p.PRICE_PKR}`;

  // Size dropdown
  const sizeSel = document.getElementById("product-size");
  sizeSel.innerHTML = "";
  p.SIZE.split(",").map((s) => s.trim()).forEach((s) => {
    const o = document.createElement("option");
    o.value = s;
    o.innerText = s;
    sizeSel.appendChild(o);
  });

  // Color dropdown
  const colorSel = document.getElementById("product-color");
  colorSel.innerHTML = "";
  p.COLOURS.split(",").map((c) => c.trim()).forEach((c) => {
    const o = document.createElement("option");
    o.value = c;
    o.innerText = c;
    colorSel.appendChild(o);
  });

  // Slider
  const slider = document.getElementById("slider-images");
  const thumbs = document.getElementById("thumbnails");

  slider.innerHTML = "";
  thumbs.innerHTML = "";

  (p.images || []).forEach((img, i) => {
    const im = document.createElement("img");
    im.src = img;
    im.alt = p.PRODUCT_NAME + " image " + (i + 1);
    slider.appendChild(im);

    const t = document.createElement("img");
    t.src = img;
    t.alt = "thumb " + (i + 1);
    t.className = i === 0 ? "active" : "";
    t.onclick = () => {
      currentSlide = i;
      updateSlider();
    };
    thumbs.appendChild(t);
  });

  currentSlide = 0;
  updateSlider();

  // Add to cart
  const addBtn = document.getElementById("add-cart-btn");
  addBtn.onclick = () => addToCart(p.PRODUCT_ID);
}

// Slider next / prev
document.addEventListener("click", function (e) {
  if (e.target.matches(".prev-btn")) {
    currentSlide--;
    updateSlider();
  }
  if (e.target.matches(".next-btn")) {
    currentSlide++;
    updateSlider();
  }
});

function updateSlider() {
  const slider = document.getElementById("slider-images");
  if (!slider) return;

  const total = slider.children.length;
  if (!total) return;

  if (currentSlide < 0) currentSlide = total - 1;
  if (currentSlide >= total) currentSlide = 0;

  slider.style.transform = `translateX(-${currentSlide * 100}%)`;

  const thumbs = document.getElementById("thumbnails")?.children;
  if (thumbs) {
    for (let i = 0; i < thumbs.length; i++) {
      thumbs[i].classList.remove("active");
    }
    thumbs[currentSlide].classList.add("active");
  }
}

// -----------------------------------------------------
// CART SYSTEM
// -----------------------------------------------------
function addToCart(id) {
  const p = products.find((x) => x.PRODUCT_ID === id);
  if (!p) return alert("Product not found");

  const existing = cart.find((i) => i.PRODUCT_ID === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...p, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart ✔");

  if (document.getElementById("cart-items")) loadCart();
}

function loadCart() {
  const c = document.getElementById("cart-items");
  const totalBox = document.getElementById("cart-total");
  if (!c) return;

  c.innerHTML = "";

  if (cart.length === 0) {
    c.innerHTML = "<p>Your cart is empty.</p>";
    if (totalBox) totalBox.innerText = "PKR 0";
    return;
  }

  let sum = 0;

  cart.forEach((item, i) => {
    sum += item.PRICE_PKR * (item.qty || 1);

    const div = document.createElement("div");
    div.className = "cart-card";
    div.innerHTML = `
      <img src="${item.images?.[0] || ""}" class="cart-img">
      <div style="flex:1">
        <h4>${escapeHtml(item.PRODUCT_NAME)}</h4>
        <p>PKR ${item.PRICE_PKR} × ${item.qty}</p>

        <div style="display:flex;gap:8px;margin-top:8px">
          <button onclick="changeQty(${i}, -1)" class="remove-btn">-</button>
          <button onclick="changeQty(${i}, 1)" class="remove-btn">+</button>
          <button onclick="removeFromCart(${i})" class="remove-btn">Remove</button>
        </div>
      </div>
    `;
    c.appendChild(div);
  });

  if (totalBox) totalBox.innerText = `PKR ${sum}`;
}

function changeQty(i, d) {
  cart[i].qty = Math.max(1, cart[i].qty + d);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function removeFromCart(i) {
  cart.splice(i, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

// -----------------------------------------------------
// UTIL
// -----------------------------------------------------
function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, (c) => {
    return (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ||
      c
    );
  });
}

// -----------------------------------------------------
// INITIALIZERS
// -----------------------------------------------------
if (document.getElementById("product-list")) {
  loadProducts().then(displayProductsOnly);
}

if (document.getElementById("slider-images")) {
  loadProducts().then(loadSingleProductSlider);
}

if (document.getElementById("cart-items")) {
  cart = JSON.parse(localStorage.getItem("cart") || "[]");
  loadProducts().then(loadCart);
}
