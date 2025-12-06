let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Load all products from products.json
async function loadProducts() {
  const res = await fetch('products.json');
  products = await res.json();
}

// Render products on Home Page
function renderHomeProducts() {
  loadProducts().then(() => {
    const container = document.getElementById('product-grid');
    container.innerHTML = '';

    products.forEach((product, index) => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <a href="product.html?id=${index}">
          <img src="${product.images[0]}" alt="${product.PRODUCT_NAME}">
          <h3>${product.PRODUCT_NAME}</h3>
          <p>PKR ${product.PRICE_PKR}</p>
        </a>
      `;
      container.appendChild(card);
    });
  });
}

// Render a single product on Product Page
function renderProductPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (id === null) return;

  loadProducts().then(() => {
    const product = products[id];
    if (!product) return;

    const wrap = document.getElementById('product-wrap');
    wrap.innerHTML = `
      <div class="product-detail-card">
        <div class="product-detail-images">
          ${product.images.map(img => `<img src="${img}" alt="${product.PRODUCT_NAME}">`).join('')}
        </div>
        <div class="product-detail-info">
          <h2>${product.PRODUCT_NAME}</h2>
          <p>Type: ${product.TYPE}</p>
          <p>Sizes: ${product.SIZE}</p>
          <p>Colours: ${product.COLOURS}</p>
          <p>Price: PKR ${product.PRICE_PKR}</p>
          <form onsubmit="addToCart(event, ${id})">
            <input type="text" name="customerName" placeholder="Your Name" required>
            <input type="email" name="customerEmail" placeholder="Your Email" required>
            <button type="submit">Add to Cart</button>
          </form>
        </div>
      </div>
    `;
  });
}

// Add product to cart
function addToCart(event, index) {
  event.preventDefault();
  const product = products[index];
  const form = event.target;
  const customerName = form.customerName.value;
  const customerEmail = form.customerEmail.value;

  cart.push({
    product,
    customerName,
    customerEmail
  });

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert('Product added to cart!');
  form.reset();
}

// Update cart badge
function updateCartCount() {
  const el = document.getElementById('cart-count');
  if(el) el.textContent = cart.length;
}
