const SHEET_URL = "https://script.google.com/macros/s/AKfycbxympv_30sMFi5mV_G_tmvS3AtFZUTe-6NhUSiM8YV1VGdjoq8Xyv7c_EFRrLIk4AuJ6Q/exec";

function openProduct(name, price) {
  localStorage.setItem("dripnova_product", JSON.stringify({ name, price }));
  window.location = "product.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");
  const info = document.getElementById("info");
  if (!gallery || !info) return;

  const data = JSON.parse(localStorage.getItem("dripnova_product") || "{}");
  if (!data.name) {
    info.innerHTML = "<p>Product not found.</p>";
    return;
  }

  const { name, price } = data;
  const colors = getColors(name);
  const defaultColor = colors[0];

  // Load main product images
  gallery.innerHTML = `
    <img class="front" id="frontImg" src="${getImage(name, defaultColor, 'front')}" alt="front" />
    <img class="back" id="backImg" src="${getImage(name, defaultColor, 'back')}" alt="back" />
  `;

  // Product info and Order Now button
  info.innerHTML = `
    <h2>${name}</h2>
    <p class="price">PKR ${price}</p>

    <label>Select Color:</label>
    <div class="color-options">
      ${colors.map(c => `<div class="color-swatch" data-color="${c}" title="${c}" style="background:${colorToHex(c)}"></div>`).join('')}
    </div>

    <label>Size:</label>
    <select id="size">
      <option value="S">S</option>
      <option value="M">M</option>
      <option value="L">L</option>
      <option value="XL">XL</option>
    </select>

    <button id="orderNow" class="btn">Order Now</button>

    <form id="orderForm">
      <input type="text" id="name" placeholder="Full Name" required>
      <input type="text" id="phone" placeholder="Phone Number" required>
      <input type="text" id="city" placeholder="City" required>
      <input type="text" id="address" placeholder="Full Address" required>
      <button type="submit" class="btn">Place Order</button>
      <div class="status" id="status"></div>
    </form>
  `;

  // color switching
  document.querySelectorAll(".color-swatch").forEach(s => {
    s.addEventListener("click", e => {
      document.querySelectorAll(".color-swatch").forEach(sw => sw.classList.remove("active"));
      e.target.classList.add("active");
      const c = e.target.dataset.color;
      document.getElementById("frontImg").src = getImage(name, c, 'front');
      document.getElementById("backImg").src = getImage(name, c, 'back');
    });
  });
  document.querySelector(".color-swatch").classList.add("active");

  // Show form when clicking Order Now
  document.getElementById("orderNow").addEventListener("click", () => {
    document.getElementById("orderForm").classList.add("active");
    document.getElementById("orderNow").style.display = "none";
  });

  // Form submit logic
  const form = document.getElementById("orderForm");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const btn = form.querySelector("button");
    const status = document.getElementById("status");
    btn.disabled = true;
    status.textContent = "Submitting order...";

    const order = {
      product: name,
      price,
      color: document.querySelector(".color-swatch.active").dataset.color,
      size: document.getElementById("size").value,
      name: document.getElementById("name").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      city: document.getElementById("city").value.trim(),
      address: document.getElementById("address").value.trim()
    };

    try {
      const res = await fetch(SHEET_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
      });
      const result = await res.json();
      if (result.result === "success") {
        window.location = "thankyou.html";
      } else {
        status.textContent = "⚠️ Something went wrong. Try again.";
      }
    } catch {
      status.textContent = "❌ Network error — please try again.";
    } finally {
      btn.disabled = false;
    }
  });
});

function getColors(name) {
  const map = {
    "Be Your Own Hero": ["black", "maroon", "white"],
    "Stay Focused Break Rules": ["off white", "olive", "charcol"],
    "Just Keep Moving Forward": ["black"],
    "Your Mind Hoodie": ["black"],
    "Awesome Brother Hoodie": ["black"]
  };
  return map[name] || ["black"];
}

// Match your image names in /images/
function getImage(name, color, side) {
  const cleaned = name.toLowerCase().replaceAll(" ", "-");
  if (color === "off white") color = "off-white";
  return `images/${cleaned}-${color}-${side}.png`;
}

function colorToHex(color) {
  const map = {
    black: "#000",
    maroon: "#800000",
    white: "#fff",
    olive: "#808000",
    charcol: "#36454F",
    "off white": "#f8f8f8"
  };
  return map[color] || "#ccc";
}
