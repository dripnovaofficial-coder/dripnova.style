// === DripNova Store Script ===

// ✅ Google Apps Script URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz7TnyR4DRNpWuE2cz_wFjvib_E2xH6E0QA332Dkw4b9bWmOQARAEZn2pWu7Tyx8gw7ow/exec";

// === Product Catalog ===
const products = [
  {
    name: "Be Your Own Hero Hoodie",
    price: 1299,
    colors: {
      black: { front: "images/black front.png", back: "images/black back.png" },
      maroon: { front: "images/maroon front.png", back: "images/maroon back.png" },
      white: { front: "images/white front.png", back: "images/white back.png" }
    }
  },
  {
    name: "Stay Focused Break Rules Hoodie",
    price: 1699,
    colors: {
      "off white": { front: "images/stay-focused-break-rules front.png", back: "images/stay-focused-break-rules back.png" },
      olive: { front: "images/stay-focused-break-rules front olive .png", back: "images/stay-focused-break-rules back olive .png" },
      charcoal: { front: "images/stay-focused-break-rules front charcol .png", back: "images/stay-focused-break-rules back charcol .png" }
    }
  },
  {
    name: "Just Keep Moving Forward Hoodie",
    price: 1699,
    colors: {
      default: { front: "images/moving-forward-hoodie.png", back: "images/moving-forward-hoodie.png" }
    }
  },
  {
    name: "Your Mind Hoodie",
    price: 1299,
    colors: {
      default: { front: "images/your mind hoodie front.png", back: "images/your mind hoodie back.png" }
    }
  },
  {
    name: "Awesome Brother Hoodie",
    price: 1299,
    colors: {
      default: { front: "images/awesome-brother front.png", back: "images/awesome-brother back.png" }
    }
  }
];

// === Product Detail Page Handling ===
function openProduct(name, price) {
  const product = products.find(p => p.name === name);
  if (!product) return alert("Product not found!");

  sessionStorage.setItem("dripnova_product", JSON.stringify(product));
  window.location.href = "product.html";
}

// === On Product Page Load ===
document.addEventListener("DOMContentLoaded", () => {
  const detailContainer = document.querySelector(".product-detail");
  if (!detailContainer) return; // Not on product page

  const productData = JSON.parse(sessionStorage.getItem("dripnova_product"));
  if (!productData) return;

  const firstColor = Object.keys(productData.colors)[0];
  const colorData = productData.colors[firstColor];

  detailContainer.innerHTML = `
    <div class="product-gallery">
      <img id="mainImage" src="${colorData.front}" alt="${productData.name}">
    </div>
    <div class="product-info">
      <h2>${productData.name}</h2>
      <p class="price">PKR ${productData.price}</p>
      <label class="label">Color:</label>
      <div class="color-options">
        ${Object.keys(productData.colors).map(c => `
          <div class="color-swatch" title="${c}" style="background-image:url('${productData.colors[c].front}')" onclick="selectColor('${c}')"></div>
        `).join("")}
      </div>
      <label class="label">Size:</label>
      <select id="size">
        <option value="Small">Small</option>
        <option value="Medium">Medium</option>
        <option value="Large">Large</option>
        <option value="XL">XL</option>
      </select>
      <div class="actions">
        <button class="btn" onclick="buyNow('${productData.name}', ${productData.price})">Buy Now</button>
      </div>
    </div>
  `;

  window.currentProduct = productData;
  window.currentColor = firstColor;
});

// === Color Selection ===
function selectColor(color) {
  const img = document.getElementById("mainImage");
  if (!img || !window.currentProduct) return;

  const selected = window.currentProduct.colors[color];
  img.src = selected.front;
  window.currentColor = color;
}

// === Buy Now ===
function buyNow(name, price) {
  const size = document.getElementById("size").value;
  const color = window.currentColor || "-";

  sessionStorage.setItem(
    "dripnova_checkout",
    JSON.stringify({ name, price, size, color })
  );
  window.location.href = "checkout.html";
}

// === Checkout Page ===
if (window.location.pathname.includes("checkout.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    const data = JSON.parse(sessionStorage.getItem("dripnova_checkout"));
    if (!data) return;

    const summary = document.getElementById("orderSummary");
    if (summary) {
      summary.innerHTML = `
        <p><strong>Product:</strong> ${data.name}</p>
        <p><strong>Color:</strong> ${data.color}</p>
        <p><strong>Size:</strong> ${data.size}</p>
        <p><strong>Price:</strong> PKR ${data.price}</p>
      `;
    }

    const form = document.getElementById("orderForm");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const obj = Object.fromEntries(formData.entries());
      const order = { ...data, ...obj };

      try {
        const res = await fetch(SCRIPT_URL, {
          method: "POST",
          body: JSON.stringify(order),
          headers: { "Content-Type": "application/json" }
        });
        const result = await res.json();
        if (result.result === "success") {
          order.orderId = result.orderId || "(Pending)";
          sessionStorage.setItem("dripnova_order", JSON.stringify(order));
          window.location.href = "thankyou.html";
        } else {
          alert("❌ Error saving order. Please try again.");
        }
      } catch (err) {
        alert("⚠️ Network error — please check your internet or script URL.");
      }
    });
  });
}
