// PRODUCT DATA
const productImages = {
  "Be Your Own Hero": {
    black: "images/black front.png",
    maroon: "images/maroon front.png",
    white: "images/white front.png"
  },
  "Stay Focused Break Rules": {
    olive: "images/stay-focused-break-rules front olive .png",
    charcol: "images/stay-focused-break-rules front charcol .png",
    white: "images/stay-focused-break-rules front.png"
  },
  "Just Keep Moving Forward": {
    black: "images/moving-forward-hoodie.png"
  },
  "Your Mind Hoodie": {
    black: "images/your mind hoodie front.png"
  },
  "Awesome Brother Hoodie": {
    black: "images/awesome-brother front.png"
  }
};

// ✅ Show Product Info
function openProduct(name, price) {
  localStorage.setItem("productName", name);
  localStorage.setItem("productPrice", price);
  window.location.href = "product.html";
}

// ✅ On product page load
window.addEventListener("DOMContentLoaded", () => {
  const name = localStorage.getItem("productName");
  const price = localStorage.getItem("productPrice");

  if (name && price) {
    document.getElementById("product-name").textContent = name;
    document.getElementById("product-price").textContent = "PKR " + price;
    updateProductImage();
  }
});

// ✅ Update image when color changes
function updateProductImage() {
  const name = localStorage.getItem("productName");
  const color = document.getElementById("color-select").value;
  const img = document.getElementById("product-img");

  if (productImages[name] && productImages[name][color]) {
    img.src = productImages[name][color];
  } else {
    img.src = "dripnova-logo.png"; // fallback
  }
}

// ✅ Show order form only when clicking "Order Now"
function showOrderForm() {
  document.getElementById("order-form").classList.remove("hidden");
  document.getElementById("order-btn").style.display = "none";
}

// ✅ Smooth popup message
function showPopup(message, isError = false) {
  const popup = document.getElementById("popup");
  popup.textContent = message;
  popup.className = "popup " + (isError ? "error" : "success");
  popup.classList.remove("hidden");
  setTimeout(() => popup.classList.add("hidden"), 2500);
}

// ✅ Submit order to Google Apps Script
// replace SHEET_URL with your actual script URL
const SHEET_URL = "https://script.google.com/macros/s/AKfycbxympv_30sMFi5mV_G_tmvS3AtFZUTe-6NhUSiM8YV1VGdjoq8Xyv7c_EFRrLIk4AuJ6Q/exec";

async function submitOrder(e) {
  e.preventDefault();
  const statusEl = document.getElementById("status");
  statusEl.textContent = "Submitting order...";

  const data = {
    product: localStorage.getItem("productName"),
    price: localStorage.getItem("productPrice"),
    color: document.getElementById("color-select").value,
    size: document.getElementById("size-select").value,
    name: document.getElementById("name").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    address: document.getElementById("address").value.trim()
  };

  // Basic client-side validation
  if (!data.product || !data.name || !data.phone || !data.address) {
    statusEl.textContent = "⚠️ Please complete all required fields.";
    return;
  }

  try {
    const res = await fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      mode: "cors"
    });

    const text = await res.text();                  // raw server response for debugging
    let json;
    try { json = JSON.parse(text); } catch(e){ json = null; }

    console.log("SubmitOrder: HTTP", res.status, res.statusText, "raw:", text, "json:", json);

    if (!res.ok) {
      statusEl.textContent = `⚠️ Server returned ${res.status} ${res.statusText}`;
      return;
    }

    // Prefer well-formed JSON { result: "success" } from server
    if (json && json.result === "success") {
      statusEl.textContent = "✅ Order placed. Redirecting...";
      // optionally store order and redirect to thankyou
      sessionStorage.setItem("dripnova_order", JSON.stringify({ ...data, orderId: json.orderId || null }));
      setTimeout(()=> window.location.href = "thankyou.html", 800);
      return;
    }

    // If server returned text-based success message, check that
    if (typeof text === "string" && /success/i.test(text)) {
      statusEl.textContent = "✅ Order placed (text success). Redirecting...";
      sessionStorage.setItem("dripnova_order", JSON.stringify({ ...data }));
      setTimeout(()=> window.location.href = "thankyou.html", 800);
      return;
    }

    // Otherwise show server message to help debug
    statusEl.textContent = "⚠️ Server response: " + (json?.message || text.slice(0,200));
  } catch (err) {
    console.error("submitOrder error:", err);
    statusEl.textContent = "❌ Network error — please check your connection or script URL.";
  }
}
