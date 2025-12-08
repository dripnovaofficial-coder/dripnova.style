// ========================
// GLOBAL VARIABLES
// ========================
let products = [];
let cart = JSON.parse(localStorage.getItem('drip_cart')) || [];

// Load products.json
async function loadProducts() {
  const res = await fetch('products.json');
  products = await res.json();
}

// ========================
// CART FUNCTIONS
// ========================
function saveCart() {
  localStorage.setItem('drip_cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  if (countEl) countEl.textContent = cart.length;
}

function addToCart(product, selectedSize, selectedColor) {
  cart.push({
    id: product.PRODUCT_ID,
    name: product.PRODUCT_NAME,
    price: product.PRICE_PKR,
    size: selectedSize,
    color: selectedColor,
    image: product.images.find(img => img.toLowerCase().includes(selectedColor.toLowerCase()))
  });
  saveCart();
  alert('Added to cart!');
}

// ========================
// HOME PAGE
// ========================
async function renderHomeProducts() {
  await loadProducts();
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  grid.innerHTML = '';

  products.forEach(product => {
    const firstImg = product.images[0];
    const item = document.createElement('div');
    item.classList.add('product-item');
    item.innerHTML = `
      <a href="product.html?id=${product.PRODUCT_ID}">
        <img src="${firstImg}" alt="${product.PRODUCT_NAME}">
        <h3>${product.PRODUCT_NAME}</h3>
        <p>PKR ${product.PRICE_PKR}</p>
      </a>
    `;
    grid.appendChild(item);
  });
}

// ========================
// PRODUCT PAGE
// ========================
async function renderProductPage() {
  await loadProducts();
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const product = products.find(p => p.PRODUCT_ID === id);
  if (!product) {
    alert('Product not found');
    return;
  }

  // Title & Price
  const titleEl = document.getElementById('p-title');
  const priceEl = document.getElementById('price');
  if (titleEl) titleEl.textContent = product.PRODUCT_NAME;
  if (priceEl) priceEl.textContent = 'PKR ' + product.PRICE_PKR;

  // Sizes
  const sizesEl = document.getElementById('sizes');
  if (sizesEl) {
    sizesEl.innerHTML = '';
    product.SIZE.split(',').forEach(size => {
      const btn = document.createElement('button');
      btn.textContent = size;
      btn.classList.add('size-option');
      btn.addEventListener('click', () => {
        document.querySelectorAll('.size-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
      sizesEl.appendChild(btn);
    });
  }

  // Colors
  const colorsEl = document.getElementById('colors');
  if (colorsEl) {
    colorsEl.innerHTML = '';
    product.COLOURS.split(',').forEach(color => {
      const btn = document.createElement('button');
      btn.textContent = color;
      btn.classList.add('color-option');
      btn.addEventListener('click', () => {
        document.querySelectorAll('.color-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        updateMainImage(color, product);
      });
      colorsEl.appendChild(btn);
    });
  }

  // Thumbnails
  const thumbsEl = document.getElementById('thumbnails');
  if (thumbsEl) {
    thumbsEl.innerHTML = '';
    product.images.forEach(img => {
      const thumb = document.createElement('img');
      thumb.src = img;
      thumb.classList.add('thumb');
      thumb.addEventListener('click', () => {
        const mainImg = document.getElementById('productImage');
        if (mainImg) mainImg.src = img;
      });
      thumbsEl.appendChild(thumb);
    });
  }

  // Main Image
  updateMainImage(product.COLOURS.split(',')[0], product);

  // Add to Cart
  const addBtn = document.getElementById('add-to-cart');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const selectedSize = document.querySelector('.size-option.selected')?.textContent;
      const selectedColor = document.querySelector('.color-option.selected')?.textContent;
      if (!selectedSize || !selectedColor) {
        alert('Please select size and color');
        return;
      }
      addToCart(product, selectedSize, selectedColor);
    });
  }
}

function updateMainImage(color, product) {
  const mainImg = document.getElementById('productImage');
  if (mainImg) {
    const img = product.images.find(i => i.toLowerCase().includes(color.toLowerCase()));
    if (img) mainImg.src = img;
  }
}

// ========================
// CART PAGE
// ========================
function renderCartPage() {
  const container = document.getElementById('cart-items');
  if (!container) return;
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty</p>';
    return;
  }

  cart.forEach((item, index) => {
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h4>${item.name}</h4>
        <p>Size: ${item.size} | Color: ${item.color}</p>
        <p>PKR ${item.price}</p>
        <button class="remove-btn" data-index="${index}">Remove</button>
      </div>
    `;
    container.appendChild(div);
  });

  // Remove button
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.getAttribute('data-index');
      cart.splice(idx, 1);
      saveCart();
      renderCartPage();
    });
  });

  // Clear Cart
  const clearBtn = document.getElementById('clear-cart');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      cart = [];
      saveCart();
      renderCartPage();
    });
  }

  // Go to Checkout
  const checkoutBtn = document.getElementById('go-checkout');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      window.location.href = 'checkout.html';
    });
  }
}

// ========================
// CHECKOUT PAGE
// ========================
function renderCheckout() {
  const container = document.getElementById('checkout-items');
  if (!container) return;
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty</p>';
    return;
  }

  cart.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('checkout-item');
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h4>${item.name}</h4>
        <p>Size: ${item.size} | Color: ${item.color}</p>
        <p>PKR ${item.price}</p>
      </div>
    `;
    container.appendChild(div);
  });

  // Payment radio logic
  const prepaid = document.querySelector('input[value="PREPAID"]');
  const cod = document.querySelector('input[value="COD"]');
  const prepaidDetails = document.getElementById('prepaid-details');

  if (prepaid && cod && prepaidDetails) {
    [prepaid, cod].forEach(radio => {
      radio.addEventListener('change', () => {
        prepaidDetails.style.display = prepaid.checked ? 'block' : 'none';
      });
    });
  }

  // Confirm Order
  const confirmBtn = document.getElementById('confirm-order');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      alert('Order Confirmed! Thank you for shopping with DripNova.');
      cart = [];
      saveCart();
      window.location.href = 'index.html';
    });
  }
}

// ========================
// AUTO DETECT PAGE
// ========================
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  if (document.getElementById('product-grid')) renderHomeProducts();
  if (document.getElementById('p-title')) renderProductPage();
  if (document.getElementById('cart-items')) renderCartPage();
  if (document.getElementById('checkout-items')) renderCheckout();
});
