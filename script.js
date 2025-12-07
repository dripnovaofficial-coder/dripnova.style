const PRODUCTS_URL = 'products.json';

/* ---------------- helpers ---------------- */
async function loadProducts() {
  const r = await fetch(PRODUCTS_URL);
  const data = await r.json();
  return data; // data is an array
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('drip_cart') || '[]');
  const el = document.getElementById('cart-count');
  if (el) el.textContent = cart.length;
}

/* ---------------- Home page rendering ---------------- */
async function renderHomeProducts() {
  const data = await loadProducts();
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  grid.innerHTML = '';

  data.slice(0, 12).forEach((p) => {
    const thumb = pickFrontImage(p.images) || p.images[0] || '';
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${thumb}" alt="${escapeHtml(p.PRODUCT_NAME)}">
      <h3>${escapeHtml(p.PRODUCT_NAME)}</h3>
      <p>${escapeHtml(p.TYPE)}</p>
      <p class="price">PKR ${p.PRICE_PKR}</p>
      <a class="btn" href="product.html?id


/* ---------------- Utility: pick front image ---------------- */
function pickFrontImage(images) {
  if (!images || !images.length) return null;
  let found = images.find((i) => /front/i.test(i));
  if (found) return found;
  return images[0];
}

/* ---------------- Product page rendering ---------------- */
async function renderProductPage() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if (!id) return;

  const data = await loadProducts();
  const product = data.find((p) => p.PRODUCT_ID === id);
  if (!product) {
    document.getElementById('product-container').innerHTML =
      '<p>Product not found. <a href="index.html">Back to shop</a></p>';
    return;
  }

  const mainImg = document.getElementById('product-image');
  mainImg.src = product.images[0];

  document.getElementById('p-title').textContent = product.PRODUCT_NAME;
  document.getElementById('price').textContent = `PKR ${product.PRICE_PKR}`;

  // Thumbnails
  const thumbs = document.getElementById('thumbnails');
  thumbs.innerHTML = '';
  product.images.forEach((img) => {
    const t = document.createElement('img');
    t.src = img;
    t.className = 'thumbnail';
    t.onclick = () => (mainImg.src = img);
    thumbs.appendChild(t);
  });

  // Sizes
  const sizeContainer = document.getElementById('sizes');
  sizeContainer.innerHTML = '';
  product.SIZE.split(',').forEach((s) => {
    const el = document.createElement('div');
    el.className = 'size';
    el.textContent = s.trim();
    sizeContainer.appendChild(el);
  });

  // Colors
  const colorContainer = document.getElementById('colors');
  colorContainer.innerHTML = '';
  product.COLOURS.split(',').forEach((c) => {
    const el = document.createElement('div');
    el.className = 'colour';
    el.textContent = c.trim();
    colorContainer.appendChild(el);
  });

  // Add to Cart
  document.getElementById('add-to-cart').onclick = function () {
    const selectedSize =
      document.querySelector('.size.selected')?.textContent || '';
    const selectedColor =
      document.querySelector('.colour.selected')?.textContent || '';
    const cart = JSON.parse(localStorage.getItem('drip_cart') || '[]');
    cart.push({
      id: product.PRODUCT_ID,
      name: product.PRODUCT_NAME,
      price: product.PRICE_PKR,
      size: selectedSize,
      color: selectedColor,
      image: product.images[0],
    });
    localStorage.setItem('drip_cart', JSON.stringify(cart));
    updateCartCount();
    alert('Added to cart');
  };

  // Make size/color selectable
  document.querySelectorAll('.size').forEach((el) => {
    el.onclick = () => {
      document.querySelectorAll('.size').forEach((s) => s.classList.remove('selected'));
      el.classList.add('selected');
    };
  });
  document.querySelectorAll('.colour').forEach((el) => {
    el.onclick = () => {
      document.querySelectorAll('.colour').forEach((c) => c.classList.remove('selected'));
      el.classList.add('selected');
      // Optional: change main image based on color
      const color = el.textContent.toLowerCase();
      const match = product.images.find((i) =>
        i.toLowerCase().includes(color.replace(/\s/g, ''))
      );
      if (match) mainImg.src = match;
    };
  });
}

/* ---------------- Utilities ---------------- */
function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, function (m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
  });
}

/* ---------------- Run ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('product-container')) {
    renderProductPage();
  }
  if (document.getElementById('product-grid')) {
    renderHomeProducts();
  }
  updateCartCount();
});
