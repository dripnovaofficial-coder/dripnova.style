const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/dripnovaofficial-coder/dripnova.style/main/products/";
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let products = [];

fetch("products.json")
  .then(res => res.json())
  .then(data => {
    products = data;
    if(document.getElementById("shop")) renderShop(products);
    if(document.getElementById("gallery")) loadProductPage();
  });

// Render Shop Page
function renderShop(products){
  const shop = document.getElementById("shop");
  shop.innerHTML = "";
  products.forEach(p=>{
    const img = p.images[0].front || p.images[0].back;
    const el = document.createElement("div");
    el.className = "product-card";
    el.innerHTML = `
      <img src="${GITHUB_RAW_BASE + img}" class="product-img"/>
      <h3>${p.name}</h3>
      <p>Rs ${p.price}</p>
      <button onclick="viewProduct('${p.id}')">View Product</button>
    `;
    shop.appendChild(el);
  });
}

function viewProduct(id){ window.location.href="product.html?id="+id; }

// Load Product Page
function loadProductPage(){
  const id = new URLSearchParams(window.location.search).get("id");
  const p = products.find(x=>x.id===id);
  if(!p) return;

  const gallery = document.getElementById("gallery");
  const info = document.getElementById("productInfo");

  let mainImg = document.createElement("img");
  mainImg.src = GITHUB_RAW_BASE + (p.images[0].front || p.images[0].back);
  mainImg.className="detail-img";
  gallery.appendChild(mainImg);

  let colorSelect = `<select id="variantSelect">${p.images.map(i=>`<option value="${i.color}">${i.color}</option>`).join('')}</select>`;
  let sizeSelect = `<select id="sizeSelect">${p.sizes.map(s=>`<option>${s}</option>`).join('')}</select>`;

  info.innerHTML=`
    <h2>${p.name}</h2>
    <p><b>Price:</b> Rs ${p.price}</p>
    <p><b>Type:</b> ${p.type}</p>
    <label>Size:</label>${sizeSelect}
    <label>Color:</label>${colorSelect}
    <br/><br/>
    <button onclick="addToCart('${p.id}')">Add to Cart</button>
    <button onclick="openCart()">View Cart</button>
  `;

  document.getElementById("variantSelect").addEventListener("change", e=>{
    const selected = p.images.find(i=>i.color===e.target.value);
    mainImg.src = GITHUB_RAW_BASE + (selected.front || selected.back);
  });
}

// Add to Cart
function addToCart(id){
  const p = products.find(x=>x.id===id);
  const size = document.getElementById("sizeSelect").value;
  const color = document.getElementById("variantSelect").value;
  const variant = p.images.find(i=>i.color===color);

  const item = {id:p.id,name:p.name,type:p.type,size,color,price:p.price,image:variant.front || variant.back};
  cart.push(item);
  localStorage.setItem("cart",JSON.stringify(cart));
  alert("Added to Cart ✅");
}

// Cart functions
function openCart(){
  const cartBox=document.getElementById("cart");
  cartBox.style.display="flex";
  const list=document.getElementById("cartItems");
  list.innerHTML=cart.map((i,idx)=>`
    <div class="cart-item">
      <img src="${GITHUB_RAW_BASE + i.image}" class="cart-img"/>
      <div>
        <h4>${i.name}</h4>
        <p>Size: ${i.size} | Color: ${i.color}</p>
        <p>Rs ${i.price}</p>
        <button onclick="removeFromCart(${idx})">Remove</button>
      </div>
    </div>
  `).join("");
  document.getElementById("cartTotal").innerText = cart.reduce((a,b)=>a+b.price,0);
}

function removeFromCart(i){ cart.splice(i,1); localStorage.setItem("cart",JSON.stringify(cart)); openCart(); }
function closeCart(){ document.getElementById("cart").style.display="none"; }
