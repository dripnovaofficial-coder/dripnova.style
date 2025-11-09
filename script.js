// ========== configure your Google Apps Script web app URL here ==========
const scriptURL ="https://script.google.com/macros/s/AKfycbxpP6ulAJ_P7xWAvff_RXfezgy80etvyyt56ONPdGFnqLvsFDAoNnBr3rfc8ToOePIveA/exec";

/* ---------- Helpers ---------- */
function openProduct(name, price) {
  window.location.href = `product.html?name=${encodeURIComponent(name)}&price=${price}`;
}
function scrollToShop() {
  document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
}

/* ---------- DOM ready ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");
  const price = params.get("price");
  const productNameEl = document.getElementById("productName");
  const productPriceEl = document.getElementById("productPrice");
  const productImage = document.getElementById("productImage");
  const buyBtn = document.getElementById("buyButton");
  const gotoPaymentBtn = document.getElementById("gotoPaymentBtn");
  const iPaidBtn = document.getElementById("iPaidBtn");
  const orderSummary = document.getElementById("orderSummary");
  const thankSummary = document.getElementById("thankSummary");

  // Product page init
  if (productNameEl && name && price) {
    const decodedName = decodeURIComponent(name);
    productNameEl.textContent = decodedName;
    productPriceEl.textContent = `PKR ${price}`;
    document.title = `${decodedName} — DripNova`;

    productImage.src = "images/maroon front.png";
    productImage.dataset.front = "images/maroon front.png";
    productImage.dataset.back = "images/maroon back.png";

    // Default color
    document.getElementById("selectedColorName")?.remove();
    const hiddenColor = document.createElement("input");
    hiddenColor.type = "hidden";
    hiddenColor.name = "color";
    hiddenColor.id = "selectedColorName";
    hiddenColor.value = "Maroon";
    document.getElementById("orderForm").appendChild(hiddenColor);

    if (buyBtn) buyBtn.onclick = () => buyNow(decodedName, price);
  }

  // Hover front/back
  if (productImage) {
    productImage.addEventListener("mouseenter", () => {
      if (productImage.dataset.back) productImage.src = productImage.dataset.back;
    });
    productImage.addEventListener("mouseleave", () => {
      if (productImage.dataset.front) productImage.src = productImage.dataset.front;
    });
  }

  // Color swatches
  document.querySelectorAll(".color-swatch").forEach((sw) => {
    sw.addEventListener("click", (e) => {
      e.stopPropagation();
      const front = sw.getAttribute("data-front");
      const back = sw.getAttribute("data-back");
      const colorName = sw.getAttribute("aria-label");
      if (front) {
        productImage.src = front;
        productImage.dataset.front = front;
        productImage.dataset.back = back || front;
      }
      document.getElementById("selectedColorName").value = colorName;
    });
  });

  // Payment navigation
  if (gotoPaymentBtn) {
    gotoPaymentBtn.addEventListener("click", () => {
      if (!sessionStorage.getItem("dripnova_order")) {
        alert("Order not found. Please submit the order first.");
        return;
      }
      window.location.href = "payment.html";
    });
  }

  if (iPaidBtn) {
    iPaidBtn.addEventListener("click", () => {
      if (!sessionStorage.getItem("dripnova_order")) {
        alert("No order found.");
        window.location.href = "index.html";
        return;
      }
      window.location.href = "thankyou.html";
    });
  }

  // Render order summary
  if (orderSummary) {
    const s = sessionStorage.getItem("dripnova_order");
    if (!s) {
      orderSummary.innerHTML = `<div class="card">No order found. Place an order first. <a href="index.html" class="btn secondary">Back to Shop</a></div>`;
    } else {
      const o = JSON.parse(s);
      orderSummary.innerHTML = `<div class="card">
        <strong>Order:</strong> ${escapeHtml(o.product)}<br>
        <strong>Color:</strong> ${escapeHtml(o.color)}<br>
        <strong>Size:</strong> ${escapeHtml(o.size)}<br>
        <strong>Total:</strong> PKR ${escapeHtml(String(o.price))}<br>
        <strong>Name:</strong> ${escapeHtml(o.name)}<br>
        <strong>Phone:</strong> ${escapeHtml(o.phone)}<br>
        <strong>City:</strong> ${escapeHtml(o.city)}
      </div>`;
    }
  }

  // Thankyou summary
  if (thankSummary) {
    const s = sessionStorage.getItem("dripnova_order");
    if (s) {
      const o = JSON.parse(s);
      thankSummary.innerHTML = `<div class="card">
        <h2 class="text-xl font-semibold mb-2">✅ Order Confirmed!</h2>
        <p><strong>Order ID:</strong> ${escapeHtml(o.orderId || "(pending)")} </p>
        <p><strong>Product:</strong> ${escapeHtml(o.product)}</p>
        <p><strong>Color:</strong> ${escapeHtml(o.color)}</p>
        <p><strong>Size:</strong> ${escapeHtml(o.size)}</p>
        <p><strong>Price:</strong> PKR ${escapeHtml(String(o.price))}</p>
        <p><strong>Name:</strong> ${escapeHtml(o.name)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(o.phone)}</p>
        <p><strong>City:</strong> ${escapeHtml(o.city)}</p>
        <p><strong>Address:</strong> ${escapeHtml(o.address)}</p>
        <hr class="my-3" />
        <p>Our team will contact you shortly to confirm your order. 💬</p>
      </div>`;
      sessionStorage.removeItem("dripnova_order");
    } else {
      thankSummary.innerHTML = `<div class="card">Order not found — contact us if you paid.</div>`;
    }
  }
});

/* ---------- Checkout modal ---------- */
function buyNow(productName, price) {
  const modal = document.getElementById("checkoutModal");
  const size = document.getElementById("sizeSelect").value;
  const color = document.getElementById("selectedColorName").value;
  document.getElementById("productInfo").textContent = `🛍️ ${productName} — PKR ${price} (Size: ${size}, Color: ${color})`;
  document.getElementById("productField").value = productName;
  document.getElementById("priceField").value = price;
  document.getElementById("sizeField").value = size;
  document.getElementById("selectedColorName").value = color;
  document.getElementById("orderForm").style.display = "block";
  document.getElementById("paymentInfo").style.display = "none";
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  const modal = document.getElementById("checkoutModal");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  try {
    document.getElementById("orderForm").reset();
  } catch (e) {}
}

/* ---------- Submit to Google Sheets ---------- */
document.addEventListener("submit", async (e) => {
  const form = e.target;
  if (!form || form.id !== "orderForm") return;
  e.preventDefault();

  const btn = form.querySelector("button[type='submit']");
  const origText = btn.textContent;
  btn.textContent = "Placing order...";
  btn.disabled = true;

  try {
    const res = await fetch(scriptURL, { method: "POST", body: new FormData(form) });
    const data = await res.json();

    if (res.ok && data.result === "success") {
      const fd = new FormData(form);
      const order = Object.fromEntries(fd.entries());
      order.timestamp = new Date().toISOString();
      order.orderId = data.orderId || "";
      sessionStorage.setItem("dripnova_order", JSON.stringify(order));
      form.style.display = "none";
      document.getElementById("paymentInfo").style.display = "block";
    } else {
      alert("❌ Error saving order. Please try again.");
    }
  } catch (err) {
    alert("⚠️ Network error — please check your internet or script URL.");
    console.error(err);
  } finally {
    btn.textContent = origText;
    btn.disabled = false;
  }
});

/* ---------- Escape helper ---------- */
function escapeHtml(s) {
  if (!s) return "";
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}



