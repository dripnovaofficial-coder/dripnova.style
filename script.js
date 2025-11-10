// script.js — loads products.json, renders index and product pages, handles modal + order post
const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzDw2aXgirPrCdtxscrAM8K0t4hs9NRcK5jXdqJ26KYaz9jtOD25MCAXzXDzAIAV0SwvQ/exec"; // <- set this to your deployed Apps Script web app URL
const PRODUCTS_JSON = "products.json";

document.addEventListener("DOMContentLoaded", () => {
  const isProductPage = location.pathname.endsWith("product.html") || location.search.includes("product=");
  fetch(PRODUCTS_JSON).then(r => r.json()).then(products => {
    if (isProductPage) renderProductPage(products);
    else renderIndex(products);
  }).catch(err => {
    console.error("Failed loading products:", err);
    // optionally show a friendly message
  });
});

/* ---------- Index ---------- */
function renderIndex(products) {
  const list = document.getElementById("product-list");
  if (!list) return;
  list.innerHTML = "";
  products.forEach(p => {
    const el = document.createElement("article");
    el.className = "product";
    el.onclick = () => location.href = `product.html?id=${encodeURIComponent(p.id)}`;
    el.innerHTML = `
      <div class="thumb">
        <img src="${p.images[0].front}" alt="${escapeHtml(p.name)}">
      </div>
      <h3>${escapeHtml(p.name)}</h3>
      <p class="price">PKR ${p.price}</p>
      <button class="small" onclick="event.stopPropagation(); location.href='product.html?id=${encodeURIComponent(p.id)}'">View</button>
    `;
    list.appendChild(el);
  });
}

/* ---------- Product page ---------- */
function renderProductPage(products) {
  const params = new URLSearchParams(location.search);
  const id = params.get("id") || params.get("product");
  if (!id) {
    document.getElementById("product-detail").innerHTML = "<p>Product not found.</p>";
    return;
  }
  const product = products.find(p => p.id === id);
  if (!product) {
    document.getElementById("product-detail").innerHTML = "<p>Product not found.</p>";
    return;
  }

  const gallery = document.getElementById("gallery");
  const info = document.getElementById("productInfo");

  // gallery
  const galleryMain = document.createElement("div");
  galleryMain.className = "gallery-main";
  const mainImg = document.createElement("img");
  mainImg.src = product.images[0].front;
  mainImg.alt = product.name;
  galleryMain.appendChild(mainImg);

  const thumbs = document.createElement("div");
  thumbs.className = "gallery-thumbs";

  // create thumb for each color variant (use front image)
  product.images.forEach(imgObj => {
    const t = document.createElement("div");
    t.className = "thumb-swatch";
    const im = document.createElement("img");
    im.src = imgObj.front;
    im.alt = product.name + " " + imgObj.color;
    im.style.width = "100%";
    t.appendChild(im);
    t.onclick = () => { mainImg.src = imgObj.front; };
    thumbs.appendChild(t);
  });

  gallery.appendChild(galleryMain);
  gallery.appendChild(thumbs);

  // info
  info.innerHTML = `
    <h2>${escapeHtml(product.name)}</h2>
    <p class="muted">${escapeHtml(product.description || "")}</p>
    <div class="card">
      <div class="price">PKR ${product.price}</div>
      <label class="label">Choose color</label>
      <div id="colorOptions" class="color-options"></div>
      <label class="label">Size</label>
      <select id="sizeSelect" class="input">
        ${product.sizes.map(s => `<option value="${s}">${s}</option>`).join("")}
      </select>
      <div class="actions">
        <button class="btn" id="order-btn">Order Now</button>
        <a href="index.html" class="btn secondary">Back</a>
      </div>
    </div>
  `;

  // populate swatches
  const colorWrap = document.getElementById("colorOptions");
  product.images.forEach((imgObj, idx) => {
    const sw = document.createElement("div");
    sw.className = "thumb-swatch";
    sw.style.width = "44px";
    sw.style.height = "44px";
    sw.title = imgObj.color;
    sw.innerHTML = `<img src="${imgObj.front}" alt="${imgObj.color}" style="width:100%;height:100%;object-fit:cover">`;
    sw.onclick = () => {
      mainImg.src = imgObj.front;
      selectedColor = imgObj.color;
      // visual active state:
      [...colorWrap.children].forEach(c => c.style.boxShadow = "");
      sw.style.boxShadow = "0 0 0 3px rgba(0,0,0,0.08)";
    };
    colorWrap.appendChild(sw);
  });

  // default selection
  let selectedColor = product.images[0].color;
  colorWrap.children[0].style.boxShadow = "0 0 0 3px rgba(0,0,0,0.08)";

  document.getElementById("order-btn").addEventListener("click", () => {
    openOrderModal(product, selectedColor);
  });
}

/* ---------- Order modal / form ---------- */
function openOrderModal(product, selectedColor) {
  const modal = document.getElementById("orderModal");
  modal.setAttribute("aria-hidden", "false");
  const wrap = document.getElementById("orderFormWrap");
  wrap.innerHTML = `
    <h3 id="orderTitle">Order — ${escapeHtml(product.name)}</h3>
    <form id="orderForm" class="card">
      <input class="input" name="product" readonly value="${escapeHtml(product.name)}" />
      <input class="input" name="color" readonly value="${escapeHtml(selectedColor)}" />
      <input class="input" name="size" id="orderSize" value="${product.sizes[0]}" />
      <input class="input" name="price" readonly value="${product.price}" />
      <input class="input" name="name" placeholder="Full name" required />
      <input class="input" name="phone" placeholder="Phone number" required />
      <input class="input" name="city" placeholder="City" required />
      <textarea class="input" name="address" placeholder="Address" required></textarea>
      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px">
        <button type="button" class="btn" onclick="submitOrder()">Place order</button>
        <button type="button" class="btn secondary" onclick="closeModal()">Cancel</button>
      </div>
      <div id="orderMsg" style="margin-top:8px;color:#333"></div>
    </form>
  `;
  // sync size select (if present)
  const sizeSelect = document.getElementById("sizeSelect");
  const orderSize = document.getElementById("orderSize");
  if (sizeSelect && orderSize) {
    orderSize.value = sizeSelect.value || orderSize.value;
    sizeSelect.addEventListener("change", () => orderSize.value = sizeSelect.value);
  }
}

function closeModal(){
  const modal = document.getElementById("orderModal");
  modal.setAttribute("aria-hidden", "true");
  document.getElementById("orderFormWrap").innerHTML = "";
}

/* ---------- submit to Apps Script ---------- */
function submitOrder(){
  const form = document.querySelector("#orderForm");
  const msg = document.getElementById("orderMsg");
  if (!form) return;
  const data = {};
  new FormData(form).forEach((v,k) => data[k] = v);
  // small validation
  if (!data.name || !data.phone || !data.address) {
    msg.textContent = "Please fill required fields.";
    return;
  }
  msg.textContent = "Placing order...";
  fetch(WEBAPP_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  }).then(r => r.json())
    .then(res => {
      if (res && res.success) {
        msg.innerHTML = `✅ Order received. Reference: <strong>${escapeHtml(res.id || res.reference || "")}</strong><br/>We will contact you soon.`;
        // optionally redirect to thank-you
        setTimeout(() => { closeModal(); location.href = "thankyou.html"; }, 1600);
      } else {
        msg.textContent = "Network error — please try again or contact us.";
        console.warn("order error", res);
      }
    }).catch(e => {
      msg.textContent = "Network error — please try again.";
      console.error(e);
    });
}

/* ---------- utils ---------- */
function escapeHtml(str = "") {
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}

