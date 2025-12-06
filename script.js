// --- Load all products for product page grid ---
function loadAllProducts() {
  fetch('products.json')
    .then(res => res.json())
    .then(products => {
      const list = document.getElementById('product-list');
      list.innerHTML = ''; // clear old content

      products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
          <img src="${product.image}" alt="${product.name}" class="product-image">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-price">${product.price}</p>
          <button onclick="viewProduct(${product.id})">View</button>
        `;
        list.appendChild(card);
      });
    })
    .catch(err => console.error('Error loading products:', err));
}

// --- View single product detail ---
function renderProductPage() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  if (!productId) return; // No single product to show

  fetch('products.json')
    .then(res => res.json())
    .then(products => {
      const product = products.find(p => p.id == productId);
      if (!product) return;

      const wrap = document.getElementById('product-wrap');
      wrap.innerHTML = `
        <div class="product-detail-card">
          <img src="${product.image}" alt="${product.name}" class="product-detail-image">
          <div class="product-detail-info">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p class="product-price">${product.price}</p>
            <form onsubmit="addToCart(event, ${product.id})">
              <input type="text" name="name" placeholder="Your Name" required>
              <input type="number" name="quantity" value="1" min="1">
              <button type="submit">Add to Cart</button>
            </form>
          </div>
        </div>
      `;
    })
    .catch(err => console.error('Error loading product:', err));
}

// --- Handle "View" button click ---
function viewProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

// --- Cart management ---
function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function updateCartCount() {
  const count = getCart().reduce((acc, item) => acc + item.quantity, 0);
  document.getElementById('cart-count').textContent = count;
}

function addToCart(event, productId) {
  event.preventDefault();
  const form = event.target;
  const name = form.name.value;
  const quantity = parseInt(form.quantity.value);

  fetch('products.json')
    .then(res => res.json())
    .then(products => {
      const product = products.find(p => p.id == productId);
      if (!product) return;

      const cart = getCart();
      const existing = cart.find(item => item.id == productId);

      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({ id: productId, name: product.name, price: product.price, quantity });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      alert('Product added to cart!');
      form.reset();
    });
}
