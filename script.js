const PRODUCTS_URL = 'products.json';

/* ---------------- helpers ---------------- */
async function loadProducts() {
  const r = await fetch(PRODUCTS_URL);
  if (!r.ok) throw new Error('Failed to fetch products.json');
  const data = await r.json();
  return data; // expect array
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
      <img src="${escapeHtml(thumb)}" alt="${escapeHtml(p.PRODUCT_NAME)}">
      <h3>${escapeHtml(p.PRODUCT_NAME)}</h3>
      <p>${escapeHtml(p.TYPE)}</p>
      <p class="price">PKR ${p.PRICE_PKR}</p>
      <a class="btn" href="product.html?id=${encodeURIComponent(p.PRODUCT_ID)}">View Product</a>
    `;
    grid.appendChild(card);
  });
}

/* ---------------- Utility: pick front image ---------------- */
function pickFrontImage(images) {
  if (!images || !images.length) return null;
  // prefer explicit front images
  let found = images.find((i) => /front/i.test(i));
  if (found) return found;
  // fallback to any image
  return images[0];
}

/* normalize string for matching: remove non-alphanum and lowercase */
function norm(s = '') {
  return String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
}

/* front/back token check (using normalized filename) */
function containsFrontToken(n) {
  return /front|fron|fold|model|hanger|pair/.test(n);
}
function containsBackToken(n) {
  return /back|rear/.test(n);
}

/* ---------------- Product page rendering ---------------- */
async function renderProductPage() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if (!id) return;

  const decodedID = decodeURIComponent(id);

  const data = await loadProducts();
  const product = data.find((p) => p.PRODUCT_ID === decodedID);
  if (!product) {
    const container = document.getElementById('product-container') || document.body;
    if (container) container.innerHTML = '<p>Product not found. <a href="index.html">Back to shop</a></p>';
    return;
  }

  // Ensure images array exists
  product.images = product.images || [];

  // elements
  const mainImg = document.getElementById('product-image'); // single main image fallback
  const thumbs = document.getElementById('thumbnails');
  const sizeContainer = document.getElementById('sizes');
  const colorContainer = document.getElementById('colors');
  const titleEl = document.getElementById('p-title');
  const priceEl = document.getElementById('price');

  if (titleEl) titleEl.textContent = product.PRODUCT_NAME;
  if (priceEl) priceEl.textContent = `PKR ${product.PRICE_PKR}`;

  // render thumbnails (initial: all images)
  function renderThumbnails(list) {
    if (!thumbs) return;
    thumbs.innerHTML = '';
    (list || product.images).forEach((img) => {
      const t = document.createElement('img');
      t.src = img;
      t.className = 'thumbnail';
      t.alt = product.PRODUCT_NAME;
      t.onclick = () => {
        if (mainImg) mainImg.src = img;
      };
      thumbs.appendChild(t);
    });
  }

  renderThumbnails(product.images);
  if (mainImg) mainImg.src = pickFrontImage(product.images) || product.images[0] || '';

  /* ---------- Sizes ---------- */
  if (sizeContainer) {
    sizeContainer.innerHTML = '';
    // support product.SIZE as array or comma string
    const sizes = Array.isArray(product.SIZE) ? product.SIZE : (String(product.SIZE || '').split(',').map(s => s.trim()).filter(Boolean));
    sizes.forEach((s) => {
      const el = document.createElement('div');
      el.className = 'size';
      el.textContent = s;
      el.tabIndex = 0;
      el.onclick = () => {
        document.querySelectorAll('.size').forEach(x => x.classList.remove('selected'));
        el.classList.add('selected');
      };
      el.onkeypress = (e) => { if (e.key === 'Enter') el.click(); };
      sizeContainer.appendChild(el);
    });
    // auto-select first size (optional)
    const firstSize = sizeContainer.querySelector('.size');
    if (firstSize) firstSize.classList.add('selected');
  }

  /* ---------- Colors & color-based image switching ---------- */
  if (colorContainer) {
    colorContainer.innerHTML = '';
    // support COLOURS as array or comma string
    const colours = Array.isArray(product.COLOURS) ? product.COLOURS : (String(product.COLOURS || '').split(',').map(c => c.trim()).filter(Boolean));

    // Build a lookup: normalizedColor -> related images
    const imagesNorm = (product.images || []).map(i => ({ orig: i, norm: norm(i) }));

    const colorMap = {}; // normalizedColor -> {colorName, images:[...], front, back}
    colours.forEach((c) => {
      const colorName = String(c).trim();
      const nColor = norm(colorName);
      const related = imagesNorm.filter(obj => obj.norm.includes(nColor)).map(o => o.orig);

      // If nothing matched by exact substring, attempt looser matching:
      // e.g., "sky blue" -> "skyblue" already handled by norm; but also handle 'grey' / 'gray'
      if (related.length === 0 && (nColor === 'grey' || nColor === 'gray')) {
        // match any grey/gray occurrences
        const alt = imagesNorm.filter(o => o.norm.includes('grey') || o.norm.includes('gray')).map(o => o.orig);
        if (alt.length) related.push(...alt);
      }

      // fallback: if still nothing, attempt partial match by color first token
      if (related.length === 0) {
        const firstToken = nColor.split('')[0]; // fallback no-op
      }

      // pick front/back from related
      let front = null;
      let back = null;
      if (related.length) {
        const relatedNorm = related.map(i => ({ orig: i, norm: norm(i) }));
        front = (relatedNorm.find(r => containsFrontToken(r.norm)) || relatedNorm[0])?.orig || null;
        back = (relatedNorm.find(r => containsBackToken(r.norm)) || relatedNorm.find(r => containsFrontToken(r.norm) === false)?.orig) || null;
      }

      colorMap[nColor] = {
        colorName,
        images: related,
        front,
        back
      };
    });

    // If some colors had no related images, we will still show color swatch, but colorMap entry images will be empty.
    colours.forEach((c) => {
      const colorName = String(c).trim();
      const nColor = norm(colorName);
      const el = document.createElement('div');
      el.className = 'colour';
      el.textContent = colorName;
      el.title = colorName;
      el.tabIndex = 0;

      // small visual background if color known (best-effort)
      try {
        const css = guessColorCss(colorName);
        if (css) el.style.background = css;
      } catch (e) {}

      el.onclick = () => {
        // set selection visually
        document.querySelectorAll('.colour').forEach(x => x.classList.remove('selected'));
        el.classList.add('selected');

        // determine images for this color
        const entry = colorMap[nColor] || { images: [], front: null, back: null };
        const relatedImages = (entry.images && entry.images.length) ? entry.images : product.images.slice();

        // prefer front image (prefer explicit front token)
        const frontImg = entry.front || relatedImages.find(i => /front/i.test(i)) || relatedImages[0];
        const backImg = entry.back || relatedImages.find(i => /back/i.test(i)) || relatedImages.find(i => !/front|back/i.test(i));

        // update main image: prefer front
        if (mainImg && frontImg) {
          mainImg.src = frontImg;
        } else if (mainImg && relatedImages.length) {
          mainImg.src = relatedImages[0];
        }

        // update thumbnails to show only related images (if any) else all
        renderThumbnails(relatedImages);
      };
      el.onkeypress = (e) => { if (e.key === 'Enter') el.click(); };
      colorContainer.appendChild(el);
    });

    // auto-select first color if exists
    const firstColor = colorContainer.querySelector('.colour');
    if (firstColor) firstColor.classList.add('selected');
    // simulate click to populate thumbs/main image according to first color
    if (firstColor) firstColor.click();
  }

  /* ---------- Add to Cart ---------- */
  const addBtn = document.getElementById('add-to-cart');
  if (addBtn) {
    addBtn.onclick = () => {
      const selectedSize = document.querySelector('.size.selected')?.textContent || '';
      const selectedColor = document.querySelector('.colour.selected')?.textContent || '';
      if (!selectedSize) {
        alert('Please select a size.');
        return;
      }
      if (!selectedColor) {
        alert('Please select a colour.');
        return;
      }

      const cart = JSON.parse(localStorage.getItem('drip_cart') || '[]');

      // choose an image representing selected color if possible
      const selColorNorm = norm(selectedColor);
      const colorImages = (product.images || []).filter(i => norm(i).includes(selColorNorm));
      const chosenImage = colorImages[0] || product.images[0] || '';

      cart.push({
        id: product.PRODUCT_ID,
        name: product.PRODUCT_NAME,
        price: product.PRICE_PKR,
        size: selectedSize,
        color: selectedColor,
        image: chosenImage
      });
      localStorage.setItem('drip_cart', JSON.stringify(cart));
      updateCartCount();
      alert('Added to cart');
    };
  }
}

/* ---------------- Utilities ---------------- */
function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, function (m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
  });
}

/* best-effort CSS for small color dots (optional) */
function guessColorCss(name) {
  if (!name) return '';
  const n = name.toLowerCase().replace(/\s+/g, '');
  const map = {
    black: '#0b0b0b',
    white: '#ffffff',
    grey: '#8b8b8b',
    gray: '#8b8b8b',
    maroon: '#800000',
    chocolate: '#7b3f00',
    brown: '#6b3e26',
    red: '#c62828',
    navy: '#0b3d91',
    skyblue: '#87ceeb',
    sky: '#87ceeb',
    green: '#2e7d32',
    olive: '#6b8e23',
    charcoal: '#3b3b3b',
    army: '#4b5320',
    offwhite: '#f3f1ea'
  };
  return map[n] || '';
}

/* ---------------- Run ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  try {
    if (document.getElementById('product-container')) {
      renderProductPage();
    }
  } catch (e) {
    console.error('renderProductPage error', e);
  }
  try {
    if (document.getElementById('product-grid')) {
      renderHomeProducts();
    }
  } catch (e) {
    console.error('renderHomeProducts error', e);
  }
  updateCartCount();
});
