const repoBase = "products-images/"; // ✅ Local folder OR GitHub folder

// Load Products
async function loadProducts() {
  const container = document.getElementById("products-container");
  if (!container) return;

  container.innerHTML = "<p>Loading products…</p>";

  try {
    const res = await fetch("products.json");
    const products = await res.json();
    container.innerHTML = "";

    products.forEach(product => {
      const imgURL = product.IMAGES && product.IMAGES.length > 0 ? product.IMAGES[0] : "";
      const card = document.createElement("div");
      card.className = "product-card";

      card.innerHTML = `
        <img src="${imgURL}" alt="${product.PRODUCT_NAME}">
        <h3>${product.PRODUCT_NAME}</h3>
        <p>PKR ${product.PRICE}</p>
        <p>Sizes: ${product.SIZE}</p>
        <p>Colours: ${product.COLOURS}</p>

        <button onclick='addToCart("${product.PRODUCT_ID}", "${product.PRODUCT_NAME}", ${product.PRICE}, "${imgURL}")'>
          Add to Cart
        </button>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.error("Error loading products:", err);
    container.innerHTML = "<p>❌ Failed to load products</p>";
  }
}

// Cart system
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(id, name, price, img) {
  cart.push({ id, name, price, img });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("✅ Added to cart!");
}

// Load Cart
function loadCart() {
  const container = document.getElementById("cart-container");
  const totalBox = document.getElementById("cart-total");
  if (!container) return;

  container.innerHTML = "";
  let total = 0;

  cart.forEach((item, i) => {
    total += Number(item.price);

    container.innerHTML += `
      <div class="cart-item">
        <img src="${item.img}" class="cart-img">
        <p>${item.name} — PKR ${item.price}</p>
        <button onclick="removeItem(${i})">Remove</button>
      </div>
    `;
  });

  totalBox.innerText = `Total: PKR ${total}`;
}

function removeItem(i) {
  cart.splice(i, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}
