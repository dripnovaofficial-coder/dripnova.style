const SHEET_URL = "https://script.google.com/macros/s/AKfycbxympv_30sMFi5mV_G_tmvS3AtFZUTe-6NhUSiM8YV1VGdjoq8Xyv7c_EFRrLIk4AuJ6Q/exec";

function openProduct(name, price) {
  localStorage.setItem("dripnova_product", JSON.stringify({ name, price }));
  window.location = "product.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const productPage = document.querySelector(".product-detail");
  if (!productPage) return;

  const stored = localStorage.getItem("dripnova_product");
  if (!stored) return;

  const p = JSON.parse(stored);

  const colors = {
    "Be Your Own Hero": ["black", "maroon", "white"],
    "Stay Focused Break Rules": ["off white", "olive", "charcol"],
    "Just Keep Moving Forward": ["black"],
    "Your Mind Hoodie": ["black"],
    "Awesome Brother Hoodie": ["black"]
  };

  const gallery = document.getElementById("gallery");
  const info = document.getElementById("info");

  const colorSet = colors[p.name] || ["black"];
  const initialColor = colorSet[0];

  gallery.innerHTML = `
    <img id="frontImg" src="images/${fileName(p.name, initialColor, "front")}" alt="front">
    <img id="backImg" src="images/${fileName(p.name, initialColor, "back")}" alt="back">
  `;

  info.innerHTML = `
    <h2>${p.name}</h2>
    <p class="price">PKR ${p.price}</p>
    <label class="label">Select Color:</label>
    <div class="color-options">
      ${colorSet.map(c => `<div class="color-swatch" data-color="${c}" title="${c}" style="background:#222"></div>`).join("")}
    </div>
    <label class="label">Select Size:</label>
    <select id="size">
      <option>S</option><option>M</option><option>L</option><option>XL</option>
    </select>
    <button class="btn" onclick="orderNow('${p.name}',${p.price})">Order Now</button>
  `;

  document.querySelectorAll(".color-swatch").forEach(sw => {
    sw.addEventListener("click", e => {
      const col = e.target.dataset.color;
      document.getElementById("frontImg").src = `images/${fileName(p.name, col, "front")}`;
      document.getElementById("backImg").src = `images/${fileName(p.name, col, "back")}`;
    });
  });
});

function fileName(name, color, side) {
  name = name.toLowerCase().replaceAll(" ", "-");
  if (name === "stay-focused-break-rules" && color !== "off white")
    return `${name} ${side} ${color} .png`;
  if (name === "be-your-own-hero")
    return `${color} ${side}.png`;
  return `${name} ${side}.png`;
}

function orderNow(product, price) {
  const size = document.getElementById("size").value;
  const colorEl = document.querySelector(".color-swatch.active");
  const color = colorEl ? colorEl.dataset.color : "default";

  const name = prompt("Enter your name:");
  const phone = prompt("Enter your phone number:");
  const city = prompt("Enter your city:");
  const address = prompt("Enter your address:");

  if (!name || !phone || !address) return alert("⚠️ Please fill all details.");

  const order = { product, price, size, color, name, phone, city, address };

  fetch(SHEET_URL, {
    method: "POST",
    body: JSON.stringify(order),
    headers: { "Content-Type": "application/json" }
  })
    .then(r => r.json())
    .then(res => {
      if (res.result === "success") {
        sessionStorage.setItem("dripnova_order", JSON.stringify({ ...order, orderId: res.orderId }));
        window.location = "thankyou.html";
      } else alert("❌ Error saving order. Please try again.");
    })
    .catch(() => alert("❌ Network error — please try again."));
}
