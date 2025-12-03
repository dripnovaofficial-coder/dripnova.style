const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/dripnovaofficial-coder/dripnova.style/main/products/";
let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", () => {
  if(document.getElementById("shop")) loadShop();
  if(document.getElementById("gallery")) loadProductPage();
  if(document.getElementById("cartSummary")) renderCart();
});

// --- Load Shop Page ---
async function loadShop(){
  const res = await fetch("products.json");
  const products = await res.json();
  const shop = document.getElementById("shop");
  shop.innerHTML="";
  products.forEach(p=>{
    const firstVariant = p.variants[0];
    shop.innerHTML+=`
      <div class="product-card">
        <img src="${GITHUB_RAW_BASE+firstVariant.front}" class="product-img">
        <h3>${p.name}</h3>
        <p>Rs ${p.price}</p>
        <button onclick="viewProduct('${p.id}')">View Product</button>
      </div>
    `;
  });
}
function viewProduct(id){window.location.href="product.html?id="+encodeURIComponent(id);}

// --- Load Product Page ---
async function loadProductPage(){
  const res = await fetch("products.json");
  const products = await res.json();
  const id = new URLSearchParams(window.location.search).get("id");
  const p = products.find(x=>x.id===id);
  if(!p) return;

  let selectedVariant = p.variants[0];

  const gallery = document.getElementById("gallery");
  const info = document.getElementById("productInfo");

  function updateGallery(){
    gallery.innerHTML="";
    ["front","back","folded","hanger","pair","modelFront","modelBack"].forEach(k=>{
      if(selectedVariant[k]) gallery.innerHTML+=`<img src="${GITHUB_RAW_BASE+selectedVariant[k]}" class="detail-img">`;
    });
  }
  updateGallery();

  info.innerHTML=`
    <h2>${p.name}</h2>
    <p><b>Type:</b> ${p.type}</p>
    <p><b>Price:</b> Rs ${p.price}</p>
    <label>Size:</label>
    <select id="sizeSelect">${p.sizes.map(s=>`<option>${s}</option>`).join("")}</select>
    <label>Colour:</label>
    <select id="variantSelect">${p.variants.map(v=>`<option value="${v.color}">${v.color}</option>`).join("")}</select>
    <br><br>
    <button onclick="addToCart('${p.id}')">Add to Cart</button>
    <button onclick="openCart()">View Cart</button>
  `;

  document.getElementById("variantSelect").addEventListener("change",e=>{
    selectedVariant = p.variants.find(v=>v.color===e.target.value);
    updateGallery();
  });
}

// --- Cart ---
function addToCart(id){
  fetch("products.json").then(r=>r.json()).then(products=>{
    const p = products.find(x=>x.id===id);
    if(!p) return;
    const size = document.getElementById("sizeSelect")?.value || p.sizes[0];
    const color = document.getElementById("variantSelect")?.value || p.variants[0].color;
    const variant = p.variants.find(v=>v.color===color);
    const item = {id:p.id,name:p.name,type:p.type,size,color,price:p.price,image:variant.front};
    cart.push(item);
    localStorage.setItem("cart",JSON.stringify(cart));
    alert("Added to Cart ✅");
  });
}

function openCart(){
  document.getElementById("cart").style.display="flex";
  const list = document.getElementById("cartItems");
  list.innerHTML = cart.map((i,idx)=>`
    <div class="cart-item">
      <img src="${GITHUB_RAW_BASE+i.image}" class="cart-img">
      <div>
        <h4>${i.name}</h4>
        <p>Size: ${i.size} | Colour: ${i.color}</p>
        <p>Rs ${i.price}</p>
        <button onclick="removeFromCart(${idx})">Remove</button>
      </div>
    </div>
  `).join("");
  document.getElementById("cartTotal").innerText = cart.reduce((a,b)=>a+b.price,0);
}
function removeFromCart(i){cart.splice(i,1);localStorage.setItem("cart",JSON.stringify(cart));openCart();}
function closeCart(){document.getElementById("cart").style.display="none";}

// --- Payment Page ---
function renderCart(){
  const wrap = document.getElementById("cartSummary");
  const total = document.getElementById("cartTotal");
  if(!wrap) return;
  wrap.innerHTML="";
  let sum=0;
  cart.forEach(item=>{
    sum+=Number(item.price);
    wrap.innerHTML+=`
      <div class="card">
        <p><strong>${item.name}</strong></p>
        <p>Color: ${item.color}</p>
        <p>Size: ${item.size}</p>
        <p>Price: PKR ${item.price}</p>
      </div>
    `;
  });
  total.innerText=`Total: PKR ${sum}`;

  const btn = document.getElementById("confirmPayment");
  if(btn){
    btn.onclick=()=>{
      if(cart.length===0){alert("Cart empty ❌"); return;}
      sessionStorage.setItem("dripnova_order",JSON.stringify(cart.at(-1)));
      localStorage.removeItem("cart");
      location.href="thankyou.html";
    };
  }
}

// --- Checkout from main page ---
async function checkout(){
  if(cart.length===0){alert("Cart empty ❌");return;}
  const name=document.getElementById("cName").value;
  const email=document.getElementById("cEmail").value;
  const phone=document.getElementById("cPhone").value;
  const address=document.getElementById("cAddress").value;
  if(!name||!email||!phone||!address){alert("Please fill all details ❌");return;}
  alert("Order Placed ✅ Relax 😎");
  cart=[]; localStorage.setItem("cart","[]"); closeCart();
}
