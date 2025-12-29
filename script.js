let products = [];
let cart = JSON.parse(localStorage.getItem("drip_cart")) || [];

/* LOAD PRODUCTS */
async function loadProducts() {
  const res = await fetch("products.json");
  products = await res.json();
}

/* CART COUNT */
function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (el) el.textContent = cart.length;
}

/* SAVE CART */
function saveCart() {
  localStorage.setItem("drip_cart", JSON.stringify(cart));
  updateCartCount();
}

/* ================= HOME & PRODUCTS PAGE ================= */
async function renderProducts(gridId) {
  await loadProducts();
  const grid = document.getElementById(gridId);
  if (!grid) return;

  grid.innerHTML = "";
  products.forEach(p => {
    const firstColor = Object.keys(p.colors)[0];
    const img = p.colors[firstColor][0];

    grid.innerHTML += `
      <div class="product-item">
        <a href="product.html?id=${p.id}">
          <img src="${img}">
          <h3>${p.name}</h3>
          <p>PKR ${p.price}</p>
        </a>
      </div>
    `;
  });
}

/* ================= PRODUCT PAGE ================= */
async function renderProductPage() {
  await loadProducts();
  const id = new URLSearchParams(location.search).get("id");
  const p = products.find(x => x.id === id);
  if (!p) return alert("Product not found");

  document.getElementById("p-title").textContent = p.name;
  document.getElementById("price").textContent = `PKR ${p.price}`;

  let selectedColor = Object.keys(p.colors)[0];
  let selectedSize = p.sizes[0];

  const mainImg = document.getElementById("productImage");
  const thumbs = document.getElementById("thumbnails");
  const colorsEl = document.getElementById("colors");
  const sizesEl = document.getElementById("sizes");

  function renderImages() {
    mainImg.src = p.colors[selectedColor][0];
    thumbs.innerHTML = "";
    p.colors[selectedColor].forEach(img => {
      const t = document.createElement("img");
      t.src = img;
      t.onclick = () => mainImg.src = img;
      thumbs.appendChild(t);
    });
  }

  colorsEl.innerHTML = "";
  Object.keys(p.colors).forEach(c => {
    const b = document.createElement("button");
    b.textContent = c;
    b.onclick = () => {
      selectedColor = c;
      document.querySelectorAll(".color-option").forEach(x=>x.classList.remove("selected"));
      b.classList.add("selected");
      renderImages();
    };
    b.className = "color-option";
    colorsEl.appendChild(b);
  });

  sizesEl.innerHTML = "";
  p.sizes.forEach(s => {
    const b = document.createElement("button");
    b.textContent = s;
    b.onclick = () => {
      selectedSize = s;
      document.querySelectorAll(".size-option").forEach(x=>x.classList.remove("selected"));
      b.classList.add("selected");
    };
    b.className = "size-option";
    sizesEl.appendChild(b);
  });

  document.getElementById("add-to-cart").onclick = () => {
    cart.push({
      id: p.id,
      name: p.name,
      price: p.price,
      size: selectedSize,
      color: selectedColor,
      image: p.colors[selectedColor][0]
    });
    saveCart();
    alert("Added to cart");
  };

  colorsEl.firstChild.classList.add("selected");
  sizesEl.firstChild.classList.add("selected");
  renderImages();
}

/* ================= CART PAGE ================= */
function renderCartPage() {
  const box = document.getElementById("cart-items");
  if (!box) return;

  box.innerHTML = "";
  if (!cart.length) {
    box.innerHTML = "<p>Your cart is empty</p>";
    return;
  }

  cart.forEach((i, idx) => {
    box.innerHTML += `
      <div class="cart-item">
        <img src="${i.image}">
        <div>
          <h4>${i.name}</h4>
          <p>${i.size} | ${i.color}</p>
          <p>PKR ${i.price}</p>
          <button onclick="removeItem(${idx})">Remove</button>
        </div>
      </div>
    `;
  });
}

function removeItem(i) {
  cart.splice(i,1);
  saveCart();
  renderCartPage();
}

/* AUTO */
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  if (document.getElementById("product-grid")) renderProducts("product-grid");
  if (document.getElementById("productGrid")) renderProducts("productGrid");
  if (document.getElementById("p-title")) renderProductPage();
  if (document.getElementById("cart-items")) renderCartPage();
});
