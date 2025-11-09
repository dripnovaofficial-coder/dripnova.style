// ========== Google Apps Script URL ==========
const scriptURL = "https://script.google.com/macros/s/AKfycbwhxbVWEHaVbsgFKHaD57NmEU2IgaI-bIVenXsw9IAZ_FryWQ4mq8ctvjKLWNAwk5TROg/exec";

/* ---------- Helpers ---------- */
function openProduct(name, price) {
  window.location.href = `product.html?name=${encodeURIComponent(name)}&price=${price}`;
}

function scrollToShop() {
  document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
}

/* ---------- Product Image Map ---------- */
const PRODUCT_IMAGES = {
  "Be Your Own Hero Hoodie": {
    colors: {
      Black: {
        front: "images/be-your-own-hero-hoodie front black.png",
        back: "images/be-your-own-hero-hoodie back black.png"
      },
      Maroon: {
        front: "images/be-your-own-hero-hoodie front maroon.png",
        back: "images/be-your-own-hero-hoodie back maroon.png"
      },
      White: {
        front: "images/be-your-own-hero-hoodie front white.png",
        back: "images/be-your-own-hero-hoodie back white.png"
      }
    }
  },

  "Just Keep Moving Forward Hoodie": {
    colors: {
      Black: {
        front: "images/moving-forward-hoodie.png",
        back: "images/moving-forward-hoodie.png"
      }
    }
  },

  "Stay Focused Break Rules Hoodie": {
    colors: {
      "Off White": {
        front: "images/stay-focused-break-rules front off white.png",
        back: "images/stay-focused-break-rules back off white.png"
      },
      Olive: {
        front: "images/stay-focused-break-rules front olive.png",
        back: "images/stay-focused-break-rules back olive.png"
      },
      Charcol: {
        front: "images/stay-focused-break-rules front charcol.png",
        back: "images/stay-focused-break-rules back charcol.png"
      }
    }
  },

  "Limit Your Mind Hoodie": {
    colors: {
      Black: {
        front: "images/your-mind-hoodie front.png",
        back: "images/your-mind-hoodie back.png"
      }
    }
  },

  "Awesome Brother Hoodie": {
    colors: {
      Black: {
        front: "images/awesome-brother front.png",
        back: "images/awesome-brother back.png"
      }
    }
  }
};

/* ---------- DOM Ready ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const name = decodeURIComponent(params.get("name") || "");
  const price = params.get("price") || "";
  const productImage = document.getElementById("productImage");
  const colorOptions = document.getElementById("colorOptions");
  const productNameEl = document.getElementById("productName");
  const productPriceEl = document.getElementById("productPrice");

  if (productNameEl && PRODUCT_IMAGES[name]) {
    productNameEl.textContent = name;
    productPriceEl.textContent = `PKR ${price}`;
    document.title = `${name} — DripNova`;

    const productData = PRODUCT_IMAGES[name];
    const defaultColor = Object.keys(productData.colors)[0];
    updateProductImage(name, defaultColor);

    // Create color swatches
    if (colorOptions) {
      colorOptions.innerHTML = "";
      for (const colorName in productData.colors) {
        const swatch = document.createElement("div");
        swatch.className = "color-swatch";
        swatch.title = colorName;
        swatch.style.background = colorName.toLowerCase();
        swatch.addEventListener("click", () => {
          updateProductImage(name, colorName);
          document.getElementById("selectedColorName").value = colorName;
        });
        colorOptions.appendChild(swatch);
      }
    }

    const colorField = document.createElement("input");
    colorField.type = "hidden";
    colorField.name = "color";
    colorField.id = "selectedColorName";
    colorField.value = defaultColor;
    document.getElementById("orderForm").appendChild(colorField);
  }

  // Hover change
  if (productImage) {
    productImage.addEventListener("mouseenter", () => {
      if (productImage.dataset.back) productImage.src = productImage.dataset.back;
    });
    productImage.addEventListener("mouseleave", () => {
      if (productImage.dataset.front) productImage.src = productImage.dataset.front;
    });
  }
});

/* ---------- Image Switch ---------- */
function updateProductImage(productName, colorName) {
  const data = PRODUCT_IMAGES[productName]?.colors[colorName];
  if (!data) return;
  const productImage = document.getElementById("productImage");
  productImage.src = data.front;
  productImage.dataset.front = data.front;
  productImage.dataset.back = data.back;
}

/* ---------- Checkout ---------- */
function buyNow(productName, price) {
  const modal = document.getElementById("checkoutModal");
  const size = document.getElementById("sizeSelect").value;
  const color = document.getElementById("selectedColorName").value;

  document.getElementById("productInfo").textContent =
    `🛍️ ${productName} — PKR ${price} (Size: ${size}, Color: ${color})`;

  document.getElementById("productField").value = productName;
  document.getElementById("priceField").value = price;
  document.getElementById("sizeField").value = size;
  document.getElementById("selectedColorName").value = color;

  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  const modal = document.getElementById("checkoutModal");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  try { document.getElementById("orderForm").reset(); } catch (e) {}
}

/* ---------- Submit to Google Sheets ---------- */
document.addEventListener("submit", async (e) => {
  const form = e.target;
  if (form.id !== "orderForm") return;
  e.preventDefault();

  const btn = form.querySelector("button[type='submit']");
  const origText = btn.textContent;
  btn.textContent = "Placing order...";
  btn.disabled = true;

  try {
    const res = await fetch(scriptURL, { method: "POST", body: new FormData(form) });
    if (!res.ok) throw new Error("Bad response");
    const data = await res.json();

    if (data.result === "success") {
      const fd = new FormData(form);
      const order = Object.fromEntries(fd.entries());
      order.timestamp = new Date().toISOString();
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
