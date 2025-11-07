// put your deployed web app URL here (your Apps Script /exec)
const scriptURL = "https://script.google.com/macros/s/AKfycbx4cW4aNtmLKC2PZS2aGGuSXXCCIuWeMnejWd3JvRLXNWLn5okpJgX6y6shtVtuxluLiw/exec";

/* ---------- Common helpers ---------- */
function openProduct(name, price) {
  // navigate to product page with query params
  window.location.href = `product.html?name=${encodeURIComponent(name)}&price=${price}`;
}
function scrollToShop() {
  document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
}

/* ---------- Product page init & interactions ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // product page code only runs if elements exist
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");
  const price = params.get("price");
  const productNameEl = document.getElementById("productName");
  const productPriceEl = document.getElementById("productPrice");
  const productImage = document.getElementById("productImage");
  const buyBtn = document.getElementById("buyButton");
  const gotoPaymentBtn = document.getElementById("gotoPaymentBtn");

  // if we're on product page
  if (productNameEl && name && price) {
    const decodedName = decodeURIComponent(name);
    productNameEl.textContent = decodedName;
    productPriceEl.textContent = `PKR ${price}`;
    document.title = `${decodedName} — DripNova`;

    // default show maroon as requested (images folder order is black, maroon, white)
    productImage.src = "images/maroon front.png";
    productImage.dataset.front = "images/maroon front.png";
    productImage.dataset.back = "images/maroon back.png";

    // wire buy button
    buyBtn.onclick = () => {
      buyNow(decodedName, price);
    };
  }

  // image hover front/back
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
    sw.addEventListener("click", () => {
      const front = sw.getAttribute("data-front");
      const back = sw.getAttribute("data-back");
      if (front) {
        productImage.src = front;
        productImage.dataset.front = front;
        productImage.dataset.back = back || front;
      }
    });
  });

  // proceed to payment button in modal
  if (gotoPaymentBtn) {
    gotoPaymentBtn.addEventListener("click", () => {
      // expects order is stored in sessionStorage by earlier POST success
      const s = sessionStorage.getItem("dripnova_order");
      if (!s) {
        alert("Order not found. Please submit the order form first.");
        return;
      }
      window.location.href = "payment.html";
    });
  }

  // Payment page actions
  const iPaidBtn = document.getElementById("iPaidBtn");
  if (iPaidBtn) {
    iPaidBtn.addEventListener("click", () => {
      // user confirms they paid — show thank you page (keep order for display)
      const s = sessionStorage.getItem("dripnova_order");
      if (!s) {
        alert("No order found.");
        window.location.href = "index.html";
        return;
      }
      window.location.href = "thankyou.html";
    });
  }

  // On thankyou page: show order info (if any) and clear storage
  const thankSummary = document.getElementById("thankSummary");
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
      // clear storage after showing
      sessionStorage.removeItem("dripnova_order");
    } else {
      thankSummary.innerHTML = "<div class='card'>No order found. If you already paid, contact us on Instagram.</div>";
    }
  }

  // Payment page: show order summary
  const orderSummary = document.getElementById("orderSummary");
  if (orderSummary) {
    const s = sessionStorage.getItem("dripnova_order");
    if (!s) {
      orderSummary.innerHTML = `<div class="card">No order found. Please place an order first.<br><a href="index.html" class="btn secondary">Back to Shop</a></div>`;
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
});

/* ---------- Checkout modal open/close and submission ---------- */
function buyNow(productName, price) {
  const modal = document.getElementById("checkoutModal");
  const size = document.getElementById("sizeSelect").value;
  document.getElementById("productInfo").textContent = `🛍️ ${productName} — PKR ${price} (Size: ${size})`;
  document.getElementById("productField").value = productName;
  document.getElementById("priceField").value = price;
  document.getElementById("sizeField").value = size;

  // reset UI
  document.getElementById("orderForm").style.display = "block";
  document.getElementById("paymentInfo").style.display = "none";

  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  const modal = document.getElementById("checkoutModal");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  try { document.getElementById("orderForm").reset(); } catch (e){}
}

/* ---------- Submit order to Google Apps Script ---------- */
document.addEventListener("submit", (e) => {
  const form = e.target;
  if (form && form.id === "orderForm") {
    e.preventDefault();
    const btn = form.querySelector("button[type='submit']") || form.querySelector("button");
    const orig = btn.textContent;
    btn.textContent = "Placing order...";
    btn.disabled = true;

    // send form data
    fetch(scriptURL, { method: "POST", body: new FormData(form) })
      .then(async (res) => {
        // attempt safe parse
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch (err) {
          throw new Error("Invalid server response: " + text);
        }
      })
      .then((data) => {
        if (data && data.result === "success") {
          // Save order details in sessionStorage for Payment page
          const formData = new FormData(form);
          const order = {
            product: formData.get("product") || "",
            price: formData.get("price") || "",
            size: formData.get("size") || "",
            name: formData.get("name") || "",
            email: formData.get("email") || "",
            phone: formData.get("phone") || "",
            city: formData.get("city") || "",
            address: formData.get("address") || "",
            timestamp: new Date().toISOString()
          };
          sessionStorage.setItem("dripnova_order", JSON.stringify(order));

          // Hide form, show payment info and button
          form.style.display = "none";
          document.getElementById("paymentInfo").style.display = "block";
        } else {
          const m = (data && data.message) ? data.message : "Server error";
          alert("❌ Could not save order: " + m);
          console.error("Server:", data);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        alert("⚠️ Network error — please check your internet or script URL.");
      })
      .finally(() => {
        btn.textContent = orig;
        btn.disabled = false;
      });
  }
});

/* ---------- helper escape ---------- */
function escapeHtml(s) {
  if (!s) return "";
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'", "&#39;");
}
