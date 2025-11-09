// === DripNova script (final) ===
// Apps Script endpoint (use the exact URL you provided)
const scriptURL = "https://script.google.com/macros/s/AKfycbxympv_30sMFi5mV_G_tmvS3AtFZUTe-6NhUSiM8YV1VGdjoq8Xyv7c_EFRrLIk4AuJ6Q/exec";

/*
 Product image mapping.
 Filenames must match exactly what's inside your images/ folder (spaces included).
 Update these paths only if you rename image files.
*/
const CATALOG = {
  "Be Your Own Hero": {
    price: 1699,
    colors: {
      "Black": { front: "images/black front.png", back: "images/black back.png" },
      "Maroon": { front: "images/maroon front.png", back: "images/maroon back.png" },
      "White": { front: "images/white front.png", back: "images/white back.png" }
    }
  },

  "Just Keep Moving Forward": {
    price: 1699,
    colors: {
      "Default": { front: "images/moving-forward-hoodie.png", back: "images/moving-forward-hoodie.png" }
    }
  },

  "Stay Focused Break Rules": {
    price: 1699,
    colors: {
      "Off White": { front: "images/stay-focused-break-rules front.png", back: "images/stay-focused-break-rules back.png" },
      "Olive": { front: "images/stay-focused-break-rules front olive .png", back: "images/stay-focused-break-rules back olive .png" },
      "Charcol": { front: "images/stay-focused-break-rules front charcol .png", back: "images/stay-focused-break-rules back charcol .png" }
    }
  },

  "Your Mind Hoodie": {
    price: 1299,
    colors: {
      "Default": { front: "images/your mind hoodie front.png", back: "images/your mind hoodie back.png" }
    }
  },

  "Awesome Brother Hoodie": {
    price: 1299,
    colors: {
      "Default": { front: "images/awesome-brother front.png", back: "images/awesome-brother back.png" }
    }
  }
};

/* ---------- Helpers ---------- */
function openProduct(name, price) {
  // store product key & price in session to avoid querystring filename/case issues
  sessionStorage.setItem("dripnova_product", JSON.stringify({ name, price }));
  window.location.href = "product.html";
}
function scrollToShop() {
  document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
}

/* ---------- DOM ready actions ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // product page initialization
  const productNameEl = document.getElementById("productName");
  if (productNameEl) initProductPage();

  // modal form handling (works on product page)
  document.addEventListener("submit", async (e) => {
    const form = e.target;
    if (!form || form.id !== "orderForm") return;
    e.preventDefault();

    const submitBtn = form.querySelector("button[type='submit']");
    const origText = submitBtn.textContent;
    submitBtn.textContent = "Placing order...";
    submitBtn.disabled = true;

    // send as form data (compatible with most Apps Script doPost handlers)
    const fd = new FormData(form);

    try {
      const res = await fetch(scriptURL, { method: "POST", body: fd });
      const text = await res.text();
      // attempt JSON parse if possible
      let data;
      try { data = JSON.parse(text); } catch (err) { data = null; }

      if (res.ok && data && data.result === "success") {
        // combine order data for thank you
        const order = Object.fromEntries(fd.entries());
        order.price = order.price || document.getElementById("priceField").value;
        order.orderId = data.orderId || "(pending)";
        sessionStorage.setItem("dripnova_order", JSON.stringify(order));

        // show payment proceed
        form.style.display = "none";
        document.getElementById("paymentInfo").style.display = "block";
      } else {
        // fallback: show server response text (useful for debugging)
        alert("❌ Error saving order. Server response: " + text);
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Network error — please check your internet or script URL.");
    } finally {
      submitBtn.textContent = origText;
      submitBtn.disabled = false;
    }
  });

  // goto payment button (in modal)
  const gotoPaymentBtn = document.getElementById("gotoPaymentBtn");
  if (gotoPaymentBtn) {
    gotoPaymentBtn.addEventListener("click", () => {
      const s = sessionStorage.getItem("dripnova_order");
      if (!s) return alert("Order not found. Please submit the order first.");
      window.location.href = "payment.html";
    });
  }
});

/* ---------- Product page initializer ---------- */
function initProductPage() {
  const saved = sessionStorage.getItem("dripnova_product");
  if (!saved) { // if none, redirect back to shop
    setTimeout(() => window.location.href = "index.html", 2000);
    return;
  }

  const productObj = JSON.parse(saved);
  const productKey = productObj.name;
  const productCfg = CATALOG[productKey];
  if (!productCfg) {
    document.getElementById("productName").textContent = productKey;
    return;
  }

  // set name and price
  document.getElementById("productName").textContent = productKey;
  document.getElementById("productPrice").textContent = `PKR ${productCfg.price}`;
  document.getElementById("productField").value = productKey;
  document.getElementById("priceField").value = productCfg.price;

  // color swatches
  const colorContainer = document.getElementById("colorOptions");
  colorContainer.innerHTML = "";
  const colorKeys = Object.keys(productCfg.colors);
  const defaultColor = colorKeys[0];

  // create hidden color field
  const colorField = document.getElementById("colorField");
  colorField.value = defaultColor;

  colorKeys.forEach((ck) => {
    const sw = document.createElement("button");
    sw.type = "button";
    sw.className = "color-swatch";
    sw.title = ck;
    // show front image as swatch bg if exists
    const imgPath = productCfg.colors[ck].front;
    sw.style.backgroundImage = `url('${imgPath}')`;
    sw.addEventListener("click", () => {
      setProductImage(productCfg.colors[ck].front, productCfg.colors[ck].back);
      colorField.value = ck;
    });
    colorContainer.appendChild(sw);
  });

  // set initial image
  setProductImage(productCfg.colors[defaultColor].front, productCfg.colors[defaultColor].back);

  // buy button opens modal and fills fields
  const buyBtn = document.getElementById("buyButton");
  if (buyBtn) {
    buyBtn.addEventListener("click", () => {
      const size = document.getElementById("sizeSelect").value;
      const qty = document.getElementById("qtySelect").value;
      document.getElementById("sizeField").value = size;
      document.getElementById("quantityField").value = qty;
      document.getElementById("productInfo").textContent = `🛍️ ${productKey} — PKR ${productCfg.price} (Size: ${size}, Qty: ${qty})`;
      // open modal
      const modal = document.getElementById("checkoutModal");
      modal.style.display = "flex";
      modal.setAttribute("aria-hidden", "false");
    });
  }

  // close modal by .close button
  document.querySelectorAll(".close").forEach(btn => {
    btn.addEventListener("click", closeModal);
  });
}

/* ---------- image helper ---------- */
function setProductImage(front, back) {
  const img = document.getElementById("productImage");
  img.src = front;
  img.dataset.front = front;
  img.dataset.back = back || front;

  // hover behavior
  img.onmouseenter = () => { if (img.dataset.back) img.src = img.dataset.back; };
  img.onmouseleave = () => { if (img.dataset.front) img.src = img.dataset.front; };
}

/* ---------- close modal ---------- */
function closeModal() {
  const modal = document.getElementById("checkoutModal");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  try { document.getElementById("orderForm").reset(); } catch (e) {}
}
