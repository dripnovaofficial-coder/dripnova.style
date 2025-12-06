// script.js
const PRODUCTS_URL = 'products.json';

/* ---------------- helpers ---------------- */
async function loadProducts(){
  const r = await fetch(PRODUCTS_URL);
  const data = await r.json();
  return data;
}

function updateCartCount(){
  const cart = JSON.parse(localStorage.getItem('drip_cart')||'[]');
  const el = document.getElementById('cart-count');
  if(el) el.textContent = cart.length;
}

/* ---------------- Home page rendering ---------------- */
async function renderHomeProducts(){
  const data = await loadProducts();
  const grid = document.getElementById('product-grid');
  if(!grid) return;
  grid.innerHTML = '';

  data.slice(0, 12).forEach(p => {
    const thumb = pickFrontImage(p.images) || p.images[0] || '';
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${thumb}" alt="${escapeHtml(p.PRODUCT_NAME)}">
      <h3>${escapeHtml(p.PRODUCT_NAME)}</h3>
      <p>${escapeHtml(p.TYPE)}</p>
      <p class="price">PKR ${p.PRICE_PKR}</p>
      <a class="btn" href="product.html?id=${encodeURIComponent(p.PRODUCT_ID)}">View Product</a>
    `;
    grid.appendChild(card);
  });
}

/* ---------------- Utility: pick front image ---------------- */
function pickFrontImage(images){
  if(!images || !images.length) return null;
  let found = images.find(i=>/front/i.test(i));
  if(found) return found;
  found = images.find(i=>/FRONT/i.test(i));
  if(found) return found;
  return images[0];
}

/* ---------------- Product page rendering ---------------- */
async function renderProductPage(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id') || params.get('product') || params.get('PRODUCT_ID');
  if(!id) {
    const w = document.getElementById('product-wrap');
    if(w) w.innerHTML = '<p>No product specified. <a href="index.html">Back to shop</a></p>';
    return;
  }

  const data = await loadProducts();
  const product = data.find(p => p.PRODUCT_ID === id);
  if(!product){
    const w = document.getElementById('product-wrap');
    if(w) w.innerHTML = '<p>Product not found. <a href="index.html">Back to shop</a></p>';
    return;
  }

  const wrap = document.getElementById('product-wrap');
  wrap.innerHTML = `
    <div class="left">
      <img id="main-image" class="main-image" src="${pickFrontImage(product.images)}" alt="">
      <div class="carousel-controls">
        <button id="prev-image" class="btn">‹</button>
        <div id="thumbs" class="thumbs"></div>
        <button id="next-image" class="btn">›</button>
      </div>
    </div>
    <div class="right">
      <h1>${escapeHtml(product.PRODUCT_NAME)}</h1>
      <p>${escapeHtml(product.TYPE)} • <strong>PKR ${product.PRICE_PKR}</strong></p>
      <p>Sizes</p>
      <select id="size-select" class="select">${product.SIZE.split(',').map(s=>`<option value="${s.trim()}">${s.trim()}</option>`).join('')}</select>
      <p>Colors</p>
      <div id="color-row" class="color-row"></div>
      <div style="margin-top:14px">
        <button id="add-to-cart" class="btn">Add to Cart</button>
      </div>
    </div>
  `;

  const colorNames = product.COLOURS.split(',').map(c=>c.trim());
  const imagesByColor = {};
  colorNames.forEach(col => {
    imagesByColor[col] = filterImagesForColor(product.images, col);
  });
  colorNames.forEach(col=>{
    if(!imagesByColor[col] || imagesByColor[col].length === 0){
      imagesByColor[col] = product.images.slice();
    }
  });

  const colorRow = document.getElementById('color-row');
  colorNames.forEach((c, idx) => {
    const dot = document.createElement('button');
    dot.className = 'color-dot';
    dot.title = c;
    dot.dataset.color = c;
    dot.style.background = colorToCss(c);
    dot.dataset.idx = idx;
    colorRow.appendChild(dot);

    dot.addEventListener('click', () => {
      selectColor(c);
    });
  });

  const thumbsContainer = document.getElementById('thumbs');
  const mainImage = document.getElementById('main-image');
  let currentColor = colorNames[0] || Object.keys(imagesByColor)[0];
  let currentImages = imagesByColor[currentColor];
  let currentIndex = 0;

  function renderThumbs(){
    thumbsContainer.innerHTML = '';
    currentImages.forEach((src,i)=>{
      const t = document.createElement('img');
      t.src = src;
      t.className = 'thumb';
      if(i===currentIndex) t.classList.add('selected');
      t.addEventListener('click', () => {
        currentIndex = i;
        mainImage.src = currentImages[currentIndex];
        renderThumbs();
      });
      thumbsContainer.appendChild(t);
    });
  }

  function selectColor(color){
    currentColor = color;
    currentImages = imagesByColor[color] && imagesByColor[color].length? imagesByColor[color] : product.images;
    currentIndex = 0;
    mainImage.src = currentImages[0];
    renderThumbs();
    document.querySelectorAll('.color-dot').forEach(d=>{
      d.style.outline = (d.dataset.color===color) ? `3px solid rgba(0,255,127,0.8)` : 'none';
    });
  }

  selectColor(currentColor);

  const prevBtn = document.getElementById('prev-image');
  const nextBtn = document.getElementById('next-image');
  if(prevBtn && nextBtn){
    prevBtn.addEventListener('click', ()=>{
      currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
      mainImage.src = currentImages[currentIndex];
      renderThumbs();
    });
    nextBtn.addEventListener('click', ()=>{
      currentIndex = (currentIndex + 1) % currentImages.length;
      mainImage.src = currentImages[currentIndex];
      renderThumbs();
    });
  }

  let touchStartX = 0;
  let touchEndX = 0;
  mainImage.addEventListener('touchstart', (e)=>{ touchStartX = e.changedTouches[0].screenX; });
  mainImage.addEventListener('touchend', (e)=>{
    touchEndX = e.changedTouches[0].screenX;
    if(touchEndX + 40 < touchStartX){ if(nextBtn) nextBtn.click(); }
    else if(touchEndX > touchStartX + 40){ if(prevBtn) prevBtn.click(); }
  });

  const addBtn = document.getElementById('add-to-cart');
  if(addBtn){
    addBtn.addEventListener('click', ()=>{
      const size = document.getElementById('size-select').value;
      const cart = JSON.parse(localStorage.getItem('drip_cart')||'[]');
      cart.push({
        id: product.PRODUCT_ID,
        name: product.PRODUCT_NAME,
        price: product.PRICE_PKR,
        size,
        color: currentColor,
        image: currentImages[0]
      });
      localStorage.setItem('drip_cart', JSON.stringify(cart));
      updateCartCount();
      alert('Added to cart');
    });
  }
}

/* ---------------- Color detection helpers ---------------- */
function filterImagesForColor(images, color){
  if(!images || !images.length) return [];
  const c = color.replace(/\s+/g,'').toLowerCase();
  const matches = images.filter(src => {
    try{
      const name = src.split('/').pop().toLowerCase();
      return name.includes(c) || name.includes(color.toLowerCase().replace(/\s+/g,''));
    }catch(e){ return false; }
  });
  if(matches.length) return matches;
  const altMatches = images.filter(src => {
    const n = src.toLowerCase();
    if(c==='grey' || c==='gray'){
      return n.includes('grey') || n.includes('gray');
    }
    return n.includes(c.split(' ')[0]);
  });
  return altMatches;
}

function colorToCss(name){
  const map = {
    'black':'#0b0b0b','white':'#ffffff','grey':'#8b8b8b','gray':'#8b8b8b',
    'maroon':'#800000','chocolate':'#7b3f00','brown':'#6b3e26','red':'#c62828',
    'navy':'#0b3d91','sky blue':'#87ceeb','skyblue':'#87ceeb','green':'#2e7d32',
    'olive':'#6b8e23','charcoal':'#3b3b3b','army':'#4b5320','off white':'#f3f1ea'
  };
  return map[name.toLowerCase()] || name || '#ddd';
}

/* ---------------- Cart page rendering ---------------- */
async function renderCartPage(){
  const cartWrap = document.getElementById('cart-items');
  if(!cartWrap) return;
  const cart = JSON.parse(localStorage.getItem('drip_cart')||'[]');
  if(cart.length === 0){
    cartWrap.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }
  cartWrap.innerHTML = '';
  let total = 0;
  cart.forEach((item, idx) => {
    total += Number(item.price||0);
    const div = document.createElement('div');
    div.style.background = '#111';
    div.style.padding = '10px';
    div.style.borderRadius = '8px';
    div.style.marginBottom = '10px';
    div.innerHTML = `
      <div style="display:flex;gap:12px;align-items:center">
        <img src="${item.image}" style="width:84px;height:84px;object-fit:cover;border-radius:6px"/>
        <div>
          <div style="font-weight:700">${escapeHtml(item.name)}</div>
          <div style="color:#bbb">Size: ${escapeHtml(item.size)} • Color: ${escapeHtml(item.color)}</div>
          <div style="margin-top:8px;font-weight:700">PKR ${item.price}</div>
        </div>
        <div style="margin-left:auto">
          <button class="btn remove-btn" data-idx="${idx}">Remove</button>
        </div>
      </div>
    `;
    cartWrap.appendChild(div);
  });
  const totalDiv = document.createElement('div');
  totalDiv.style.marginTop = '16px';
  totalDiv.innerHTML = `<h3>Total: PKR ${total}</h3>`;
  cartWrap.appendChild(totalDiv);

  // attach removal handlers
  document.querySelectorAll('#cart-items .remove-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const idx = Number(btn.dataset.idx);
      const cart = JSON.parse(localStorage.getItem('drip_cart')||'[]');
      cart.splice(idx,1);
      localStorage.setItem('drip_cart', JSON.stringify(cart));
      renderCartPage();
      updateCartCount();
    });
  });
}

/* ---------------- Orders: create & store ---------------- */
function createOrder({customer, method, items}){
  const orders = JSON.parse(localStorage.getItem('drip_orders')||'{}');
  const id = generateOrderId();
  const order = {
    id,
    customer,
    method,
    items,
    status: 'Placed',
    created: Date.now()
  };
  orders[id] = order;
  localStorage.setItem('drip_orders', JSON.stringify(orders));
  return id;
}

function getOrder(id){
  const orders = JSON.parse(localStorage.getItem('drip_orders')||'{}');
  return orders[id] || null;
}

function generateOrderId(){
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2,7);
  return `DN-${t}-${r}`.toUpperCase();
}

/* ---------------- Checkout summary (payment page) ---------------- */
async function renderCheckoutSummary(){
  const wrap = document.getElementById('checkout-summary');
  if(!wrap) return;
  const cart = JSON.parse(localStorage.getItem('drip_cart')||'[]');
  if(cart.length === 0){
    wrap.innerHTML = '<p>Your cart is empty. <a href="index.html">Shop now</a></p>';
    return;
  }
  let total = 0;
  wrap.innerHTML = cart.map(i=>{
    total += Number(i.price||0);
    return `<div style="background:#111;padding:10px;border-radius:8px;margin-bottom:8px;display:flex;gap:12px;align-items:center">
      <img src="${i.image}" style="width:64px;height:64px;object-fit:cover;border-radius:6px"/>
      <div>
        <div style="font-weight:700">${escapeHtml(i.name)}</div>
        <div style="color:#bbb">Size: ${escapeHtml(i.size)} • Color: ${escapeHtml(i.color)}</div>
        <div style="margin-top:6px">PKR ${i.price}</div>
      </div>
    </div>`;
  }).join('') + `<div style="margin-top:8px"><strong>Total: PKR ${total}</strong></div>`;
}

/* ---------------- Utilities ---------------- */
function escapeHtml(s){
  return String(s||'').replace(/[&<>"']/g, function(m){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
  });
}
