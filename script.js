// GLOBAL
let products = [];
let cart = JSON.parse(localStorage.getItem("cart")||"[]");
let currentSlide = 0;

// Load products.json
async function loadProducts(){
  if(products.length) return products; // already loaded
  try{
    const res = await fetch("products.json");
    products = await res.json();
    return products;
  }catch(err){
    console.error("Failed to load products.json", err);
    products = [];
    return products;
  }
}

/* ---------------- SHOP / FILTERS ---------------- */
function setupFilters(){
  const types = [...new Set(products.map(p=>p.TYPE))];
  const colors = [...new Set(products.flatMap(p=>p.COLOURS.split(",").map(s=>s.trim())))];
  const sizes = [...new Set(products.flatMap(p=>p.SIZE.split(",").map(s=>s.trim())))];

  const tSel = document.getElementById("filter-type");
  const cSel = document.getElementById("filter-color");
  const sSel = document.getElementById("filter-size");
  if(!tSel) return;

  types.forEach(t=>{ const o=document.createElement("option"); o.value=t; o.innerText=t; tSel.appendChild(o);});
  colors.forEach(c=>{ const o=document.createElement("option"); o.value=c; o.innerText=c; cSel.appendChild(o);});
  sizes.forEach(s=>{ const o=document.createElement("option"); o.value=s; o.innerText=s; sSel.appendChild(o);});
  displayProducts(products);
}

function displayProducts(list){
  const container = document.getElementById("product-list");
  if(!container) return;
  container.innerHTML = "";
  list.forEach(p=>{
    const card = document.createElement("div");
    card.className = "product-card";
    const img = (p.images && p.images.length>0) ? p.images[0] : "";
    card.innerHTML = `
      <img src="${img}" alt="${escapeHtml(p.PRODUCT_NAME)}">
      <h3>${escapeHtml(p.PRODUCT_NAME)}</h3>
      <p>PKR ${p.PRICE_PKR}</p>
      <p style="color:#aaa;font-size:13px">${escapeHtml(p.COLOURS)}</p>
      <button class="view-btn btn" onclick="viewProduct('${p.PRODUCT_ID}')">View Product</button>
    `;
    container.appendChild(card);
  });
}

function applyFilters(){
  const t = document.getElementById("filter-type").value;
  const c = document.getElementById("filter-color").value;
  const s = document.getElementById("filter-size").value;
  const filtered = products.filter(p=>{
    return (!t || p.TYPE===t) &&
           (!c || p.COLOURS.split(",").map(x=>x.trim()).includes(c)) &&
           (!s || p.SIZE.split(",").map(x=>x.trim()).includes(s));
  });
  displayProducts(filtered);
}

/* ---------------- VIEW PRODUCT + SLIDER ---------------- */

function viewProduct(id){
  localStorage.setItem("selectedProduct", id);
  window.location.href = "product.html";
}

function loadSingleProductSlider(){
  const id = localStorage.getItem("selectedProduct");
  const p = products.find(x=>x.PRODUCT_ID === id);
  if(!p){ console.warn("Product not found:", id); return; }

  const slider = document.getElementById("slider-images");
  const thumbs = document.getElementById("thumbnails");
  if(!slider) return;

  slider.innerHTML = ""; thumbs.innerHTML = "";
  (p.images||[]).forEach((img, i)=>{
    const im = document.createElement("img");
    im.src = img;
    im.alt = p.PRODUCT_NAME + " image " + (i+1);
    slider.appendChild(im);

    const t = document.createElement("img");
    t.src = img;
    t.alt = "thumb " + (i+1);
    t.onclick = ()=>{ currentSlide = i; updateSlider(); };
    t.className = i===0 ? "active" : "";
    thumbs.appendChild(t);
  });

  document.getElementById("product-name").innerText = p.PRODUCT_NAME;
  document.getElementById("product-type").innerText = `Type: ${p.TYPE}`;
  document.getElementById("product-sizes").innerText = `Sizes: ${p.SIZE}`;
  document.getElementById("product-colors").innerText = `Colors: ${p.COLOURS}`;
  document.getElementById("product-price").innerText = `PKR ${p.PRICE_PKR}`;

  const addBtn = document.getElementById("add-cart-btn");
  addBtn.onclick = ()=> addToCart(p.PRODUCT_ID);

  currentSlide = 0; updateSlider();
}

document.addEventListener("click", function(e){
  if(e.target.matches(".prev-btn")){ currentSlide--; updateSlider(); }
  if(e.target.matches(".next-btn")){ currentSlide++; updateSlider(); }
});

function updateSlider(){
  const slider = document.getElementById("slider-images");
  if(!slider) return;
  const total = slider.children.length; if(total===0) return;
  if(currentSlide<0) currentSlide = total-1;
  if(currentSlide>=total) currentSlide = 0;
  slider.style.transform = `translateX(-${currentSlide*100}%)`;
  const thumbs = document.getElementById("thumbnails")?.children;
  if(thumbs){
    for(let i=0;i<thumbs.length;i++) thumbs[i].classList.remove("active");
    thumbs[currentSlide].classList.add("active");
  }
}

// New Shop page renderer (image + name only)
function displayProductsOnly(list){
  const container = document.getElementById("product-list");
  if(!container) return;
  container.innerHTML = "";
  list.forEach(p=>{
    const card = document.createElement("div");
    card.className = "product-card";
    const img = (p.images && p.images.length>0) ? p.images[0] : "";
    card.innerHTML = `
      <img src="${img}" alt="${p.PRODUCT_NAME}">
      <h3>${p.PRODUCT_NAME}</h3>
    `;
    card.onclick = ()=> viewProduct(p.PRODUCT_ID);
    container.appendChild(card);
  });
}

/* ---------------- CART ---------------- */

function addToCart(id){
  const p = products.find(x=>x.PRODUCT_ID===id);
  if(!p) return alert("Product not found");
  // check if exists, increase qty if so
  const existing = cart.find(i=>i.PRODUCT_ID===id);
  if(existing) existing.qty = (existing.qty||1) + 1;
  else cart.push({...p, qty:1});
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart ✅");
  // update cart view if on cart page
  if(document.getElementById("cart-items")) loadCart();
}

function loadCart(){
  const c = document.getElementById("cart-items");
  const totalBox = document.getElementById("cart-total");
  if(!c) return;
  c.innerHTML = "";
  if(!cart.length){ c.innerHTML = "<p>Your cart is empty.</p>"; if(totalBox) totalBox.innerText = "PKR 0"; return; }
  let sum=0;
  cart.forEach((item, i)=>{
    sum += (item.PRICE_PKR * (item.qty||1));
    const div = document.createElement("div");
    div.className = "cart-card";
    div.innerHTML = `
      <img src="${item.images && item.images[0] || ''}" class="cart-img" alt="${escapeHtml(item.PRODUCT_NAME)}">
      <div style="flex:1">
        <h4>${escapeHtml(item.PRODUCT_NAME)}</h4>
        <p>PKR ${item.PRICE_PKR} × ${item.qty||1}</p>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button onclick="changeQty(${i}, -1)" class="remove-btn">-</button>
          <button onclick="changeQty(${i}, 1)" class="remove-btn">+</button>
          <button onclick="removeFromCart(${i})" class="remove-btn">Remove</button>
        </div>
      </div>
    `;
    c.appendChild(div);
  });
  if(totalBox) totalBox.innerText = `PKR ${sum}`;
}

function changeQty(index, delta){
  cart[index].qty = Math.max(1, (cart[index].qty||1) + delta);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function removeFromCart(i){
  cart.splice(i,1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

/* ---------------- UTIL ---------------- */

function escapeHtml(s){ return String(s||"").replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;" })[c]); }

/* ---------------- INITIALIZERS ---------------- */
// If shop page loaded, load products and show them
if(document.getElementById("product-list")){
  loadProducts().then(displayProductsOnly);
}
// If product page loaded, ensure products loaded and then init
if(document.getElementById("slider-images")){
  loadProducts().then(loadSingleProductSlider);
}
// If cart page loaded
if(document.getElementById("cart-items")){
  // ensure we have fresh cart (from localStorage)
  cart = JSON.parse(localStorage.getItem("cart")||"[]");
  loadProducts().then(loadCart);
}
