const SHEET_URL = "https://script.google.com/macros/s/AKfycbxympv_30sMFi5mV_G_tmvS3AtFZUTe-6NhUSiM8YV1VGdjoq8Xyv7c_EFRrLIk4AuJ6Q/exec";

// 🧭 Navigate to product
function openProduct(name, price) {
  localStorage.setItem("dripnova_product", JSON.stringify({ name, price }));
  window.location = "product.html";
}

// 🧥 Product detail page
document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");
  const info = document.getElementById("info");
  if (!gallery || !info) return;

  const stored = localStorage.getItem("dripnova_product");
  if (!stored) {
    info.innerHTML = "<p>⚠️ Product not found.</p>";
    return;
  }

  const p = JSON.parse(stored);

  const colorOptions = {
    "Be Your Own Hero": ["black", "maroon", "white"],
    "Stay Focused Break Rules": ["off white", "olive", "charcol"],
    "Just Keep Moving Forward": ["black"],
    "Your Mind Hoodie": ["black"],
    "Awesome Brother Hoodie": ["black"]
  };

  const colors = colorOptions[p.name] || ["black"];
  const defaultColor = colors[0];

  // Initial gallery
  gallery.innerHTML = `
    <img id="frontImg" src="images/${getImage(p.name, defaultColor, 'front')}" alt="front" />
    <img id="backImg" src="images/${getImage(p.name, defaultColor, 'back')}" alt="back" />
  `;

  // Info + Color Options
  info.innerHTML = `
    <h2>${p.name}</h2>
    <p class="price">PKR ${p.price}</p>

    <label class="label">Select Color:</label>
    <div class="color-options">
      ${colors
        .map(c => `<div class="color-swatch" data-color="${c}" title="${c}" style="background:#222"></div>`)
        .join("")}
    </div>

    <label class="label">Select Size:</label>
    <select id="size">
      <option value="S">S</option>
      <option value="M">M</option>
      <option value="L">L</option>
      <option value="XL">XL</option>
    </select>

    <button class="btn" id="orderBtn">Order Now</button>
  `;

  // Make colors clickable
  document.querySelectorAll(".color-swatch").forEach(sw => {
    sw.addEventListener("click", e => {
      document.querySelectorAll(".color-swatch").forEach(s => s.classList.remove("active"));
      e.target.classList.add("active");

      const c = e.target.dataset.color;
      document.getElementById("frontImg").src = `images/${getImage(p.name, c, "front")}`;
      document.getElementById("backImg").src = `images/${getImage(p.name, c, "back")}`;
    });
  });

  // Default active color
  document.querySelector(".color-swatch").classList.add("active");

  // Order Now
  document.getElementById("orderBtn").addEventListener("click", () => {
    const size = document.getElementById("size").value;
    const color = document.querySelector(".color-swatch.active")?.dataset.color || defaultColor;

    const name = prompt("Enter your name:");
    const phone = prompt("Enter your phone number:");
    const city = prompt("Enter your city:");
    const address = prompt("Enter your address:");

    if (!name || !phone || !address) {
      alert("⚠️ Please fill all details before ordering.");
      return;
    }

    const order = { product: p.name, price: p.price, size, color, name, phone, city, address };

    fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    })
      .then(r => r.json())
      .then(res => {
        if (res.result === "success") {
          sessionStorage.setItem("dripnova_order", JSON.stringify({ ...order, orderId: res.orderId }));
          window.location = "thankyou.html";
        } else {
          alert("❌ Error saving order. Please try again.");
        }
      })
      .catch(() => alert("❌ Network error — please try again."));
  });
});

// 🖼️ Function to match image file names properly
function getImage(name, color, side) {
  const n = name.toLowerCase().replaceAll(" ", "-");
  if (n === "stay-focused-break-rules" && color !== "off white") {
    return `${n} ${side} ${color} .png`;
  }
  if (n === "be-your-own-hero") {
    return `${color} ${side}.png`;
  }
  return `${n} ${side}.png`;
}
