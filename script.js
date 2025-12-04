let cart = JSON.parse(localStorage.getItem("cart")) || [];

async function loadProducts() {
  const container = document.getElementById("products-container");
  if (!container) return;
  container.innerHTML = "";

  const res = await fetch("products.json");
  const products = await res.json();

  products.forEach(p => {
    const img = p.images[0];
    const div = document.createElement("div");
    div.className = "product-card border p-2 rounded-xl shadow";
    div.innerHTML = `
      <img src="${img}" class="w-full rounded-xl">
      <h3 class="text-lg font-bold mt-2">${p.name}</h3>
      <p class="text-md">💰 ${p.currency} ${p.price}</p>
      <p class="text-sm">Sizes: ${p.sizes.join(", ")}</p>
      <p class="text-sm">Colors: ${p.colors.join(", ")}</p>
      <button class="bg-black text-white px-4 py-1 rounded-xl mt-2" onclick="addToCart('${p.id}')">
        Add to Cart
      </button>
    `;
    container.appendChild(div);
  });
}

function addToCart(id) {
  fetch("products.json")
    .then(res => res.json())
    .then(products => {
      const p = products.find(x => x.id === id);
      cart.push(p);
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Added to Cart ✅");
    });
}

function loadCart() {
  const container = document.getElementById("cart-container");
  if (!container) return;
  container.innerHTML = "";
  let total = 0;

  cart.forEach((p,i) => {
    total += p.price;
    container.innerHTML += `
      <div class="cart-item border-b pb-2">
        <img src="${p.images[0]}" class="w-20 rounded-xl">
        <div>
          <h3>${p.name}</h3>
          <p>${p.currency} ${p.price}</p>
          <button onclick="removeFromCart(${i})">Remove</button>
        </div>
      </div>
    `;
  });

  document.getElementById("cart-total").innerText = `PKR ${total}`;
}

function removeFromCart(i) {
  cart.splice(i,1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

if (document.getElementById("products-container")) loadProducts();
if (document.getElementById("cart-container")) loadCart();
