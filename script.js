// ========== configure your Google Apps Script web app URL here ==========
const scriptURL = "https://script.google.com/macros/s/AKfycbwhxbVWEHaVbsgFKHaD57NmEU2IgaI-bIVenXsw9IAZ_FryWQ4mq8ctvjKLWNAwk5TROg/exec";

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

  /* ---------- Product catalog (use exact filenames in images/ folder) ---------- */
  const productCatalog = {
    "Be Your Own Hero Hoodie": {
      price: 1450,
      colors: {
        Black: { front: "images/be-your-own-hero front black.png", back: "images/be-your-own-hero back black.png" },
        Maroon: { front: "images/be-your-own-hero front maroon.png", back: "images/be-your-own-hero back maroon.png" },
        White: { front: "images/be-your-own-hero front white.png", back: "images/be-your-own-hero back white.png" }
      },
      defaultColor: "Maroon"
    },

    "Just Keep Moving Forward Hoodie": {
      price: 1600,
      colors: {
        Black: { front: "images/moving-forward-hoodie.png", back: "images/moving-forward-back.png" }
      },
      defaultColor: "Black"
    },

    "Stay Focused Break Rules": {
      price: 1299,
      colors: {
        Olive: { front: "images/stay-focused-break-rules front olive.png", back: "images/stay-focused-break-rules back olive.png" },
        Charcoal: { front: "images/stay-focused-break-rules front charcol.png", back: "images/stay-focused-break-rules back charcol.png" },
        OffWhite: { front: "images/stay-focused-break-rules front.png", back: "images/stay-focused-break-rules back.png" }
      },
      defaultColor: "Olive"
    },

    "Awesome Brother Hoodie": {
      price: 1699,
      colors: {
        Black: { front: "images/awesome-brother front.png", back: "images/awesome-brother back.png" }
      },
      defaultColor: "Black"
    },

    "Limit Your Mind Hoodie": {
      price: 1699,
      colors: {
        Black: { front: "images/your mind hoodie front.png", back: "images/your mind hoodie back.png" }
      },
      defaultColor: "Black"
    }
  };

  // Initialize product page if present
  if (productNameEl && name && price) {
    const decodedName = decodeURIComponent(name);
    productNameEl.textContent = decodedName;
    productPriceEl.textContent = `PKR ${price}`;
    document.title = `${decodedName} — DripNova`;

    const productData = productCatalog[decodedName];
    if (productData) {
      const { colors, defaultColor } = productData;
      const def = colors[defaultColor];
      productImage.src = def.front;
      productImage.dataset.front = def.front;
      productImage.dataset.back = def.back;

      // create hidden color input if not exists
      let colorInput = document.getElementById("selectedColorName");
      if (!colorInput) {
        colorInput = document.createElement("input");
        colorInput.type = "hidden";
        colorInput.name = "color";
        colorInput.id = "selectedColorName";
        document.getElementById("orderForm").appendChild(colorInput);
      }
      colorInput.value = defaultColor;

      // render color swatches dynamically (only if multiple colors)
      const colorContainer = document.getElementById("colorOptions");
      if (colorContainer) {
        colorContainer.innerHTML = "";
        const keys = Object.keys(colors);
        if (keys.length > 1) {
          keys.forEach((k) => {
            const sw = document.createElement("button");
            sw.type = "button";
            sw.className = "color-swatch";
            sw.setAttribute("aria-label", k);
            sw.title = k;
            sw.style.backgroundImage = `url(${colors[k].front})`;
            sw.style.backgroundSize = "cover";
            sw.style.backgroundPosition = "center";
            sw.addEventListener("click", () => {
              productImage.src = colors[k].front;
              productImage.dataset.front = colors[k].front;
              productImage.dataset.back = colors[k].back;
              colorInput.value = k;
            });
            colorContainer.appendChild(sw);
          });
        } else {
          // single color - show text label (not interactive)
          const onlyKey = keys[0];
          const div = document.createElement("div");
          div.textContent = onlyKey;
          div.style.marginTop = "8px";
          div.style.color = "var(--muted)";
          colorContainer.appendChild(div);
        }
      }
    } else {
      productImage.src = "images/default.png";
      productImage.dataset.front = "images/default.png";
      productImage.dataset.back = "images/default.png";
    }

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

  // Payment and iPaid navigation
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

  // render order summary on payment page
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

  // render thank you summary
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
}); // end DOMContentLoaded

/* ---------- open checkout modal ---------- */
function buyNow(productName, price) {
  const modal = document.getElementById("checkoutModal");
  const size = document.getElementById("sizeSelect").value;
  const color = (document.getElementById("selectedColorName") && document.getElementById("selectedColorName").value) || "";
  document.getElementById("productInfo").textContent = `🛍️ ${productName} — PKR ${price} (Size: ${size}, Color: ${color})`;
  document.getElementById("productField").value = productName;
  document.getElementById("priceField").value = price;
  document.getElementById("sizeField").value = size;
  if (document.getElementById("selectedColorName")) document.getElementById("selectedColorName").value = color;
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
document.addEventListener("submit", async (e) => {
  const form = e.target;
  if (!form || form.id !== "orderForm") return;
  e.preventDefault();

  const btn = form.querySelector("button[type='submit']") || form.querySelector("button");
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
      const msg = (data && data.message) ? data.message : "Server error while saving order.";
      alert("❌ " + msg);
      console.error("Server response:", data);
    }
  } catch (err) {
    alert("⚠️ Network error — please check your internet or script URL.");
    console.error("Fetch error:", err);
  } finally {
    btn.textContent = origText;
    btn.disabled = false;
  }
});

/* ---------- small helper ---------- */
function escapeHtml(s){
  if (!s) return "";
  return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");
}
