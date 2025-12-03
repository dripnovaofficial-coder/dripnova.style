const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/YOUR_REPO/main/products/";
let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("products.json")
    .then(res=>res.json())
    .then(products=>{
      const page = location.pathname;
      if(page.includes("product.html")) loadProductPage(products);
      else loadShop(products);
    });
});

function loadShop(products){
  const shop = document.getElementById("shop");
  shop.innerHTML="";
  products.forEach(p=>{
    const el=document.createElement("div");
    el.className="product-card";
    const img = p.images[0].front || "";
    el.innerHTML=`<img src="${GITHUB_RAW_BASE+img}" class="product-img">
                  <h3>${p.name}</h3>
                  <p>Rs ${p.price}</p>
                  <button onclick="viewProduct('${p.id}')">View Product</button>`;
    shop.appendChild(el);
  });
}

function viewProduct(id){location.href="product.html?id="+encodeURIComponent(id);}

function loadProductPage(products){
  const id = new URLSearchParams(location.search).get("id");
  const p = products.find(x=>x.id===id);
  if(!p)return;
  const gallery=document.getElementById("gallery");
  const info=document.getElementById("productInfo");
  let mainImg = document.createElement("img");
  mainImg.src = GITHUB_RAW_BASE + p.images[0].front;
  mainImg.className="detail-img";
  gallery.appendChild(mainImg);

  let thumbs = document.createElement("div"); thumbs.className="gallery-thumbs";
  p.images.forEach(img=>{
    const t=document.createElement("div"); t.className="thumb-swatch";
    t.innerHTML=`<img src="${GITHUB_RAW_BASE+img.front}">`;
    t.onclick=()=>mainImg.src=GITHUB_RAW_BASE+img.front;
    thumbs.appendChild(t);
  });
  gallery.appendChild(thumbs);

  info.innerHTML=`
    <h2>${p.name}</h2>
    <p><b>Type:</b> ${p.type}</p>
    <p><b>Price:</b> Rs ${p.price}</p>
    <label>Size:</label>
    <select id="sizeSelect">${p.sizes.map(s=>`<option>${s}</option>`).join("")}</select>
    <label>Color:</label>
    <select id="colorSelect">${p.images.map(i=>`<option value="${i.color}">${i.color}</option>`).join("")}</select>
    <button onclick="addToCart('${p.id}')">Add to Cart</button>
    <button onclick="openCart()">View Cart</button>
  `;
  document.getElementById("colorSelect").addEventListener("change", e=>{
    const imgObj = p.images.find(v=>v.color===e.target.value);
    mainImg.src = GITHUB_RAW_BASE + imgObj.front;
  });
}

function addToCart(id){
  fetch("products.json").then(res=>res.json()).then(products=>{
    const p=products.find(x=>x.id===id); if(!p)return;
    const size=document.getElementById("sizeSelect")?.value||p.sizes[0];
    const color=document.getElementById("colorSelect")?.value||p.images[0].color;
    const variant=p.images.find(v=>v.color===color);
    cart.push({id:p.id,name:p.name,type:p.type,size,color,price:p.price,image:variant.front});
    localStorage.setItem("cart",JSON.stringify(cart));
    alert("✅ Added to Cart!");
  });
}

function openCart(){
  const modal=document.getElementById("cart"); modal.style.display="flex";
  const list=document.getElementById("cartItems");
  list.innerHTML = cart.map((i,idx)=>`
    <div class="cart-item">
      <img src="${GITHUB_RAW_BASE+i.image}" class="cart-img"/>
      <div>
        <h4>${i.name}</h4>
        <p>Size: ${i.size} | Color: ${i.color}</p>
        <p>Rs ${i.price}</p>
        <button onclick="removeFromCart(${idx})">Remove</button>
      </div>
    </div>`).join("");
  document.getElementById("cartTotal").innerText=cart.reduce((a,b)=>a+b.price,0);
}

function removeFromCart(i){cart.splice(i,1);localStorage.setItem("cart",JSON.stringify(cart));openCart();}
function closeCart(){document.getElementById("cart").style.display="none";}

function checkout(){
  if(cart.length===0){alert("Cart empty ❌");return;}
  localStorage.setItem("lastOrder",JSON.stringify(cart));
  cart=[]; localStorage.setItem("cart",JSON.stringify(cart)); closeCart();
  location.href="thankyou.html";
}
