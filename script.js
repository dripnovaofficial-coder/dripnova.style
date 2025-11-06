/******************
 * CONFIG: Replace with your Apps Script Web App URL (after you deploy)
 ******************/
const scriptURL = "https://script.google.com/macros/s/AKfycbwcozbATSIRmopDBLtzWBoH9gCJ7uQkE0Ed1ndHn9SEdoFIrLxRkgpkEaV0a_sCOJUcPQ/exec";

/******************
 * PRODUCTS ARRAY
 * Update image filenames here when you add new products.
 * For each product, provide an array of variants (colors) with front/back image paths and a color name and color hex.
 ******************/
const products = [
  {
    id: 0,
    name: "Be Your Own Hero Hoodie",
    price: 1450,
    variants: [
      { key: "maroon", name: "Maroon", color: "#800000", front: "images/p0-maroon-front.png", back: "images/p0-maroon-back.png" },
      { key: "black",  name: "Black",  color: "#000000", front: "images/p0-black-front.png", back: "images/p0-black-back.png" },
      { key: "white",  name: "White",  color: "#ffffff", front: "images/p0-white-front.png", back: "images/p0-white-back.png" }
    ]
  },
  {
    id: 1,
    name: "Signature Street Hoodie",
    price: 1800,
    variants: [
      { key:"maroon", name:"Maroon", color:"#800000", front:"images/p1-maroon-front.png", back:"images/p1-maroon-back.png" },
      { key:"black", name:"Black", color:"#000000", front:"images/p1-black-front.png", back:"images/p1-black-back.png" },
      { key:"white", name:"White", color:"#ffffff", front:"images/p1-white-front.png", back:"images/p1-white-back.png" }
    ]
  },
  {
    id: 2,
    name: "Classic Drip Hoodie",
    price: 1650,
    variants: [
      { key:"maroon", name:"Maroon", color:"#800000", front:"images/p2-maroon-front.png", back:"images/p2-maroon-back.png" },
      { key:"black", name:"Black", color:"#000000", front:"images/p2-black-front.png", back:"images/p2-black-back.png" },
      { key:"white", name:"White", color:"#ffffff", front:"images/p2-white-front.png", back:"images/p2-white-back.png" }
    ]
  },
  {
    id: 3,
    name: "Urban Drip Hoodie",
    price: 1750,
    variants: [
      { key:"maroon", name:"Maroon", color:"#800000", front:"images/p3-maroon-front.png", back:"images/p3-maroon-back.png" },
      { key:"black", name:"Black", color:"#000000", front:"images/p3-black-front.png", back:"images/p3-black-back.png" },
      { key:"white", name:"White", color:"#ffffff", front:"images/p3-white-front.png", back:"images/p3-white-back.png" }
    ]
  },
  {
    id: 4,
    name: "Minimal Logo Hoodie",
    price: 1550,
    variants: [
      { key:"maroon", name:"Maroon", color:"#800000", front:"images/p4-maroon-front.png", back:"images/p4-maroon-back.png" },
      { key:"black", name:"Black", color:"#000000", front:"images/p4-black-front.png", back:"images/p4-black-back.png" },
      { key:"white", name:"White", color:"#ffffff", front:"images/p4-white-front.png", back:"images/p4-white-back.png" }
    ]
  }
];

/* ---------------------------
   INDEX PAGE RENDER (if present)
   --------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("productList");
  if (list) {
    // render grid
    products.forEach(p => {
      const first = p.variants[0];
      const card = document.createElement("div");
      card.className = "product";
      card.innerHTML = `
        <img src="${first.front}" alt="${escapeHtml(p.name)}" loading="lazy" />
        <h3>${escapeHtml(p.name)}</h3>
        <p>PKR ${p.price}</p>
        <button onclick="openProduct(${p.id})">View Product</button>
      `;
      // hover swap: show back on mouseenter
      const img = card.querySelector("img");
      img.addEventListener("mouseenter", () => img.src = first.back);
      img.addEventListener("mouseleave", () => img.src = first.front);
      list.appendChild(card);
    });
    return;
  }

  /* ---------------------------------------
     PRODUCT PAGE LOGIC (product.html)
     --------------------------------------- */
  const productImage = document.getElementById("productImage");
  const productNameEl = document.getElementById("productName");
  const productPriceEl = document.getElementById("productPrice");
  const colorOptions = document.getElementById("colorOptions");
  const sizeOptions = document.querySelectorAll(".size-option");
  const sizeChart = document.getElementById("sizeChartModal");

  if (productImage && productNameEl && productPriceEl) {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get("id");
    const id = idParam ? parseInt(idParam, 10) : 0;
    const product = products.find(p => p.id === id) || products[0];

    // set basic info
    productNameEl.textContent = product.name;
    productPriceEl.textContent = `PKR ${product.price}`;
    document.title = `${product.name} - DripNova`;

    // build color swatches
    colorOptions.innerHTML = "";
    product.variants.forEach((v, idx) => {
      const sw = document.createElement("div");
      sw.className = "color-swatch";
      if (idx === 0) sw.classList.add("active");
      sw.style.background = v.color;
      // attach data
      sw.dataset.front = v.front;
      sw.dataset.back = v.back;
      sw.dataset.name = v.name;
      sw.addEventListener("click", () => {
        // set active
        document.querySelectorAll(".color-swatch").forEach(s => s.classList.remove("active"));
        sw.classList.add("active");
        productImage.src = v.front;
        productImage.dataset.front = v.front;
        productImage.dataset.back = v.back;
      });
      colorOptions.appendChild(sw);
    });

    // default image = first variant front
    const first = product.variants[0];
    productImage.src = first.front;
    productImage.dataset.front = first.front;
    productImage.dataset.back = first.back;

    // hover front/back
    productImage.addEventListener("mouseenter", () => {
      if (productImage.dataset.back) productImage.src = productImage.dataset.back;
    });
    productImage.addEventListener("mouseleave", () => {
      if (productImage.dataset.front) productImage.src = productImage.dataset.front;
    });

    // sizes clickable
    sizeOptions.forEach(btn => {
      btn.addEventListener("click", () => {
        sizeOptions.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });

    // size chart
    const openChart = document.getElementById("openSizeChart");
    if (openChart) openChart.addEventListener("click", () => {
      if (sizeChart) sizeChart.style.display = "flex";
    });
    if (sizeChart) sizeChart.addEventListener("click", (e) => { if (e.target === sizeChart) sizeChart.style.display = "none"; });

    // buy button
    const buyBtn = document.getElementById("buyButton");
    if (buyBtn) buyBtn.addEventListener("click", () => {
      const activeSw = document.querySelector(".color-swatch.active");
      const colorName = activeSw ? activeSw.dataset.name : (product.variants[0].name);
      const size = document.querySelector(".size-option.active")?.dataset.size || "M";
      openCheckout(product.name, product.price, colorName, size);
    });
  }

  // checkout form submit handled below globally
});

/* ---------------------------
   HELPERS & MODAL / CHECKOUT
   --------------------------- */
function openProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

function openCheckout(name, price, color, size) {
  const modal = document.getElementById("checkoutModal");
  document.getElementById("productInfo").textContent = `🛍️ ${name} • ${color} • ${size} — PKR ${price}`;
  document.getElementById("productField").value = name;
  document.getElementById("priceField").value = price;
  document.getElementById("colorField").value = color;
  document.getElementById("sizeField").value = size;

  document.getElementById("orderForm").style.display = "block";
  document.getElementById("paymentInfo").style.display = "none";
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  const modal = document.getElementById("checkoutModal");
  if (!modal) return;
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  const form = document.getElementById("orderForm");
  if (form) form.reset();
}

function closeSizeChart() {
  const chart = document.getElementById("sizeChartModal");
  if (chart) chart.style.display = "none";
}

window.onclick = function(e) {
  const modal = document.getElementById("checkoutModal");
  if (modal && e.target === modal) closeModal();
};

/* ---------------------------
   SEND ORDER TO GOOGLE SHEETS
   --------------------------- */
document.addEventListener("submit", (e) => {
  const form = e.target;
  if (!form || form.id !== "orderForm") return;
  e.preventDefault();

  const submitBtn = form.querySelector('button[type="submit"]');
  const origText = submitBtn.textContent;
  submitBtn.textContent = "Placing order...";
  submitBtn.disabled = true;

  // Ensure color & size are included (hidden inputs)
  const color = document.getElementById("colorField")?.value || "";
  const size = document.getElementById("sizeField")?.value || "";

  // send
  fetch(scriptURL, { method: "POST", body: new FormData(form) })
    .then(res => res.json())
    .then(data => {
      if (data && data.result === "success") {
        // success UI
        form.style.display = "none";
        document.getElementById("paymentInfo").style.display = "block";
      } else {
        const msg = data && data.message ? data.message : "Unknown server error";
        alert("❌ Server error: " + msg);
      }
    })
    .catch(err => {
      console.error("Fetch error:", err);
      alert("⚠️ Network error — please try again or contact us on Instagram.");
    })
    .finally(() => {
      submitBtn.textContent = origText;
      submitBtn.disabled = false;
    });
});

/* small helper to escape text for innerHTML safety */
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

