// ========== configure your Google Apps Script web app URL here ==========
const scriptURL = "https://script.google.com/macros/s/AKfycbzwM7qWgIORf882qSXouzazkffMb3oN3uR5gr-zAoxfb1LcibX_iGNw70oDSadGDNeGyA/exec"

/* ---------- Helpers ---------- */
function openProduct(name, price) {
  window.location.href = `product.html?name=${encodeURIComponent(name)}&price=${price}`;
}
function scrollToShop() {
  document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
}

/* ---------- DOM ready ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // product page elements (exists only on product.html)
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

  // Initialize product page if present
  if (productNameEl && name && price) {
    const decodedName = decodeURIComponent(name);
    productNameEl.textContent = decodedName;
    productPriceEl.textContent = `PKR ${price}`;
    document.title = `${decodedName} — DripNova`;

    // default to maroon (images listed black, maroon, white in folder)
    productImage.src = "images/maroon front.png";
    productImage.dataset.front = "images/maroon front.png";
    productImage.dataset.back = "images/maroon back.png";

    if (buyBtn) buyBtn.onclick = () => buyNow(decodedName, price);
  }

  // front/back hover
  if (productImage) {
    productImage.addEventListener("mouseenter", () => {
      const back = productImage.dataset.back;
      if (back) productImage.src = back;
    });
    productImage.addEventListener("mouseleave", () => {
      const front = productImage.dataset.front;
      if (front) productImage.src = front;
    });
  }

  // color swatches
  document.querySelectorAll(".color-swatch").forEach((sw) => {
    sw.addEventListener("click", (e) => {
      e.stopPropagation();
      const front = sw.getAttribute("data-front");
      const back = sw.getAttribute("data-back");
      if (front) {
        productImage.src = front;
        productImage.dataset.front = front;
        productImage.dataset.back = back || front;
      }
    });
  });

  // goto payment button in modal
  if (gotoPaymentBtn) {
    gotoPaymentBtn.addEventListener("click", () => {
      const s = sessionStorage.getItem("dripnova_order");
      if (!s) {
        alert("Order not found. Please submit the order first.");
        return;
      }
      window.location.href = "payment.html";
    });
  }

  // Payment page confirm paid
  if (iPaidBtn) {
    iPaidBtn.addEventListener("click", () => {
      const s = sessionStorage.getItem("dripnova_order");
      if (!s) {
        alert("No order found.");
        window.location.href = "index.html";
        return;
      }
      // move to thank you with order still in sessionStorage
      window.location.href = "thankyou.html";
    });
  }

  // render order summary on payment page
  if (orderSummary) {
    const s = sessionStorage.getItem("dripnova_order");
    if (!s) {
      orderSummary.innerHTML = `<div class="card">No order found. Place an order first. <a href="index.html" class="btn secondary">Back to Shop</a></div>`;
    } else {
      const o = JSON.parse(s);
      orderSummary.innerHTML = `<div class="card">
        <strong>Order:</strong> ${escapeHtml(o.product)}<br>
        <strong>Size:</strong> ${escapeHtml(o.size)}<br>
        <strong>Total:</strong> PKR ${escapeHtml(String(o.price))}<br>
        <strong>Name:</strong> ${escapeHtml(o.name)}<br>
        <strong>Phone:</strong> ${escapeHtml(o.phone)}<br>
        <strong>City:</strong> ${escapeHtml(o.city)}
      </div>`;
    }
  }

  // render thank you summary
  if (thankSummary) {
    const s = sessionStorage.getItem("dripnova_order");
    if (s) {
      const o = JSON.parse(s);
      thankSummary.innerHTML = `<div class="card">
        <strong>Order:</strong> ${escapeHtml(o.product)}<br>
        <strong>Size:</strong> ${escapeHtml(o.size)}<br>
        <strong>Price:</strong> PKR ${escapeHtml(String(o.price))}<br>
        <strong>Name:</strong> ${escapeHtml(o.name)}<br>
        <strong>Phone:</strong> ${escapeHtml(o.phone)}<br>
        <strong>City:</strong> ${escapeHtml(o.city)}<br>
        <strong>Address:</strong> ${escapeHtml(o.address)}
      </div>`;
      // clear stored order after showing to avoid duplicate later
      sessionStorage.removeItem("dripnova_order");
    } else {
      thankSummary.innerHTML = `<div class="card">Order not found — contact us if you paid.</div>`;
    }
  }
}); // end DOMContentLoaded

/* ---------- open checkout modal ---------- */
function buyNow(productName, price) {
  const modal = document.getElementById("checkoutModal");
  const size = document.getElementById("sizeSelect").value;
  document.getElementById("productInfo").textContent = `🛍️ ${productName} — PKR ${price} (Size: ${size})`;
  document.getElementById("productField").value = productName;
  document.getElementById("priceField").value = price;
  document.getElementById("sizeField").value = size;

  // reset UI if reopened
  try {
    document.getElementById("orderForm").style.display = "block";
    document.getElementById("paymentInfo").style.display = "none";
  } catch (e){}

  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  const modal = document.getElementById("checkoutModal");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  try { document.getElementById("orderForm").reset(); } catch (e){}
}

/* ---------- submit order to Google Apps Script ---------- */
document.addEventListener("submit", (e) => {
  const form = e.target;
  if (!form || form.id !== "orderForm") return;
  e.preventDefault();

  const btn = form.querySelector("button[type='submit']") || form.querySelector("button");
  const origText = btn.textContent;
  btn.textContent = "Placing order...";
  btn.disabled = true;

  // POST form
  fetch(scriptURL, { method: "POST", body: new FormData(form) })
    .then(async (res) => {
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch (err) {
        throw new Error("Invalid server response: " + text);
      }
    })
    .then((data) => {
      if (data && data.result === "success") {
        // save order info to sessionStorage for payment/thankyou pages
        const fd = new FormData(form);
        const order = {
          product: fd.get("product") || "",
          price: fd.get("price") || "",
          size: fd.get("size") || "",
          name: fd.get("name") || "",
          email: fd.get("email") || "",
          phone: fd.get("phone") || "",
          city: fd.get("city") || "",
          address: fd.get("address") || "",
          timestamp: new Date().toISOString()
        };
        sessionStorage.setItem("dripnova_order", JSON.stringify(order));

        // hide form & show Proceed button
        form.style.display = "none";
        document.getElementById("paymentInfo").style.display = "block";
      } else {
        const msg = data && data.message ? data.message : "Server error while saving order.";
        alert("❌ " + msg);
        console.error("Server error:", data);
      }
      document.getElementById("iPaidBtn").addEventListener("click", () => {
  window.location.href = "thankyou.html";
});
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      alert("⚠️ Network error — please check your internet or script URL.");
    })
    .finally(() => {
      btn.textContent = origText;
      btn.disabled = false;
    });
});

/* ---------- small helper ---------- */
function escapeHtml(s){
  if (!s) return "";
  return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");
}



