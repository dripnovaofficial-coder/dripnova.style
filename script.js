const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/dripnovaofficial-coder/dripnova.style/main/products/";
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// PRODUCTS DATA (paste here your 13 products in correct JSON format)
const products = [
  {
    "id": "#0001",
    "name": "AUSTRONATS",
    "type": "HOODIE",
    "sizes": ["S","M","L","XL","XXL"],
    "images": [
      {"color":"BLACK","back":"astronauts-black-back.jpg","folded":"astronauts-black-folded.jpg","front":"astronauts-black-front.jpg"},
      {"color":"WHITE","back":"astronauts-white-back.jpg","folded":"astronauts-white-folded.jpg","front":"astronauts-white-front.jpg"}
    ],
    "price": 1299
  },
  {
    "id": "#0002",
    "name": "AWESOME BROTHER",
    "type": "HOODIE",
    "sizes": ["S","M","L","XL","XXL"],
    "images": [
      {"color":"BLACK","back":"awesome-brother-back.png","front":"awesome-brother-front.png"}
    ],
    "price": 1299
  }
  // add the rest of your products here...
];

document.addEventListener("DOMContentLoaded", () => {
  renderShop(products);
});

// --- SHOP PAGE ---
function renderShop(products) {
  const shop = document.getElementById("shop");
  shop.innerHTML = "";
  products.forEach(p => {
    const img = p.images[0]?.front || "";
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <img src="${GITHUB_RAW_BASE + img}" class="product-img"/>
      <h3>${p.name}</h3>
      <p>Rs ${p.price}</p>
      <button onclick="viewProduct('${p.id}')">View Product</button>
      <button onclick="addToCart('${p.id}')">Add to Cart</button>
    `;
    shop.appendChild(div);
  });
}

function viewProduct(id) {
  location.href = `product.html?id=${encodeURIComponent(id)}`;
}

// --- CART ---
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const size = product.sizes[0];
  const color = product.images[0].color;
  const variant = product.images.find(v => v.color === color);

  cart.push({
    id: product.id,
    name: product.name,
    size,
    color,
    price: product.price,
    image: variant.front
  });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to Cart ✅");
}

function openCart() {
  const modal = document.getElementById("cart");
  modal.style.display = "flex";

  const list = document.getElementById("cartItems");
  list.innerHTML = cart.map((i, idx) => `
    <div class="cart-item">
      <img src="${GITHUB_RAW_BASE + i.image}" class="cart-img"/>
      <div>
        <h4>${i.name}</h4>
        <p>Size: ${i.size} | Colour: ${i.color}</p>
        <p>Rs ${i.price}</p>
        <button onclick="removeFromCart(${idx})">Remove</button>
      </div>
    </div>
  `).join("");

  document.getElementById("cartTotal").innerText = "Total: Rs " + cart.reduce((a,b)=>a+b.price,0);
}

function removeFromCart(idx) {
  cart.splice(idx,1);
  localStorage.setItem("cart", JSON.stringify(cart));
  openCart();
}

function closeCart() {
  document.getElementById("cart").style.display = "none";
}

function checkout() {
  if(cart.length === 0) return alert("Cart is empty ❌");
  alert("Checkout not linked yet!");
}
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/dripnovaofficial-coder/dripnova.style/main/products/";
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// PRODUCTS DATA (paste here your 13 products in correct JSON format)
const products = [
  {
    "id": "#0001",
    "name": "AUSTRONATS",
    "type": "HOODIE",
    "sizes": ["S","M","L","XL","XXL"],
    "images": [
      {"color":"BLACK","back":"astronauts-black-back.jpg","folded":"astronauts-black-folded.jpg","front":"astronauts-black-front.jpg"},
      {"color":"WHITE","back":"astronauts-white-back.jpg","folded":"astronauts-white-folded.jpg","front":"astronauts-white-front.jpg"}
    ],
    "price": 1299
  },
  {
    "id": "#0002",
    "name": "AWESOME BROTHER",
    "type": "HOODIE",
    "sizes": ["S","M","L","XL","XXL"],
    "images": [
      {"color":"BLACK","back":"awesome-brother-back.png","front":"awesome-brother-front.png"}
    ],
    "price": 1299
  }
  {
    "id": "#0003",
    "name": "be-your own hero",
    "type": "SWEATSHIRT",
    "sizes": ["S","M","L","XL","XXL"],
    "images": [
      {"color":"BLACK","back":"black back.png","front":"black front.png"},
      {"color":"MAROON","back":"maroon back.png","front":"maroon front.png"},
      {"color":"WHITE","back":"white back.png","front":"white front.png"}
    ],
    "price": 999
  },
  {
    "id": "#0004",
    "name": "Climb your way to the top",
    "type": "SWEATSHIRT",
    "sizes": ["S","M","L","XL","XXL"],
    "images": [
      {"color":"BLACK","back":"climb-your-way-to-the-top-black-back.jpg","front":"climb-your-way-to-the-top-black-front.jpg"},
      {"color":"CHOCOLATE","back":"climb-your-way-to-the-top-chocolate-back.jpg","front":"climb-your-way-to-the-top-chocolate-front.jpg"},
      {"color":"MAROON","back":"climb-your-way-to-the-top-maroon-back.jpg","front":"climb-your-way-to-the-top-maroon-front.jpg"},
      {"color":"WHITE","back":"climb-your-way-to-the-top-white-back.jpg","front":"climb-your-way-to-the-top-white-front.jpg"}
    ],
    "price": 999
  },
  {
    "id": "#0005",
    "name": "Footballer",
    "type": "SWEATSHIRT",
    "sizes": ["S","M","L","XL","XXL"],
    "images": [
      {"color":"BLACK","back":"footballer_black_back.jpg","front":"footballer_black_front.jpg"},
      {"color":"NAVY","back":"footballer_navy_back.jpg","front":"footballer_navy_front.jpg"},
      {"color":"SKY BLUE","back":"footballer_skyblue_back.jpg","front":"footballer_skyblue_front.jpg"},
      {"color":"WHITE","back":"footballer_white_back.jpg","front":"footballer_white_front.jpg"}
    ],
    "price": 999
  },
  {
    "id": "#0006",
    "name": "Hello there",
    "type": "HOODIE",
    "sizes": ["S","M","L","XL","XXL"],
    "images": [
      {"color":"ARMY","back":"ARMY BACK.jpg","front":"ARMY FRONT.jpg","hanger":"ARMY HANGERED.jpg","pair":"ARMY PAIR.jpg"},
      {"color":"BLACK","back":"BLACK BACK.jpg","front":"BLACK FRONT.jpg","hanger":"BLACK HANGERED.jpg","pair":"BLACK PAIR.jpg"},
      {"color":"MAROON","back":"MAROON BACK.jpg","front":"MAROON FRONT.jpg","hanger":"MAROON HANGER.jpg","pair":"MAROON PAIR.jpg"},
      {"color":"OFF WHITE","back":"OFF WHITE BACK.jpg","front":"OFF WHITE FRONT.jpg","hanger":"OFF WHITE HANGER.jpg","pair":"OFF WHITE PAIR.jpg"},
      {"color":"WHITE","back":"WHITE BACK.jpg","front":"WHITE FRONT.jpg","hanger":"WHITE HANGER.jpg","pair":"WHITE PAIR.jpg"}
    ],
    "price": 1299
  },
  {
    "id": "#0007",
    "name": "king wild",
    "type": "HOODIE",
    "sizes": ["S","M","L","XL","XXL"],
    "images":[{"color":"GREY","back":"GREY BACK.jpg","front":"GREY FRONT.jpg"}],
    "price": 1299
  },
  {
    "id": "#0008",
    "name": "moving-forward",
    "type": "HOODIE",
    "sizes": ["S","M","L","XL","XXL"],
    "images":[{"color":"BLACK","front":"moving-forward-hoodie.png"}],
    "price": 1299
  },
  {
    "id": "#0009",
    "name": "DN Special",
    "type": "HOODIE",
    "sizes":["S","M","L","XL","XXL"],
    "images":[
      {"color":"BLACK","back":"BLACK BACK.jpg","front":"BLACK FRONT.jpg","hanger":"BLACK FRONT HANGER.jpg","pair":"BLACK PAIR.jpg"},
      {"color":"WHITE","back":"WHITE BACK.jpg","front":"WHITE FRONT.jpg","hanger":"WHITE FRONT HANGERED.jpg","pair":"WHITE PAIR.jpg"}
    ],
    "price":1299
  },
  {
    "id": "#0010",
    "name":"Sneaker",
    "type":"HOODIE",
    "sizes":["S","M","L","XL","XXL"],
    "images":[
      {"color":"BROWN","back":"BROWN BACK.jpg","front":"BROWN FRONT.jpg","modelFront":"BROWN FRONT MODEL.jpg","modelBack":"BROWN BACK MODEL.jpg"},
      {"color":"RED","back":"RED BACK.jpg","front":"RED FRONT.jpg","modelFront":"RED FRONT MODEL.jpg","modelBack":"RED BACK MODEL.jpg"}
    ],
    "price":1299
  },
  {
    "id": "#0011",
    "name":"stay focused break rules",
    "type":"SWEATSHIRT",
    "sizes":["S","M","L","XL","XXL"],
    "images":[
      {"color":"CHARCOL","back":"stay-focused-break-rules back charcol .png","front":"stay-focused-break-rules front charcol .png"},
      {"color":"OLIVE","back":"stay-focused-break-rules back olive .png","front":"stay-focused-break-rules front olive .png"},
      {"color":"OFF WHITE","back":"stay-focused-break-rules back.png","front":"stay-focused-break-rules front.png"}
    ],
    "price":999
  },
  {
    "id": "#0012",
    "name":"thumbs up",
    "type":"HOODIE",
    "sizes":["S","M","L","XL","XXL"],
    "images":[
      {"color":"BLACK","back":"BLACK BACK.jpg","front":"black front.jpg"},
      {"color":"GREEN","back":"green back .jpg","front":"green front.jpg"},
      {"color":"WHITE","back":"white back.jpg","front":"WHITE FRONT.jpg"}
    ],
    "price":1299
  },
  {
    "id":"#0013",
    "name":"limit your mind",
    "type":"HOODIE",
    "sizes":["S","M","L","XL","XXL"],
    "images":[{"color":"BLACK","back":"your mind hoodie back.png","front":"your mind hoodie front.png"}],
    "price":1299
  }
]

  // add the rest of your products here...
];

document.addEventListener("DOMContentLoaded", () => {
  renderShop(products);
});

// --- SHOP PAGE ---
function renderShop(products) {
  const shop = document.getElementById("shop");
  shop.innerHTML = "";
  products.forEach(p => {
    const img = p.images[0]?.front || "";
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <img src="${GITHUB_RAW_BASE + img}" class="product-img"/>
      <h3>${p.name}</h3>
      <p>Rs ${p.price}</p>
      <button onclick="viewProduct('${p.id}')">View Product</button>
      <button onclick="addToCart('${p.id}')">Add to Cart</button>
    `;
    shop.appendChild(div);
  });
}

function viewProduct(id) {
  location.href = `product.html?id=${encodeURIComponent(id)}`;
}

// --- CART ---
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const size = product.sizes[0];
  const color = product.images[0].color;
  const variant = product.images.find(v => v.color === color);

  cart.push({
    id: product.id,
    name: product.name,
    size,
    color,
    price: product.price,
    image: variant.front
  });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to Cart ✅");
}

function openCart() {
  const modal = document.getElementById("cart");
  modal.style.display = "flex";

  const list = document.getElementById("cartItems");
  list.innerHTML = cart.map((i, idx) => `
    <div class="cart-item">
      <img src="${GITHUB_RAW_BASE + i.image}" class="cart-img"/>
      <div>
        <h4>${i.name}</h4>
        <p>Size: ${i.size} | Colour: ${i.color}</p>
        <p>Rs ${i.price}</p>
        <button onclick="removeFromCart(${idx})">Remove</button>
      </div>
    </div>
  `).join("");

  document.getElementById("cartTotal").innerText = "Total: Rs " + cart.reduce((a,b)=>a+b.price,0);
}

function removeFromCart(idx) {
  cart.splice(idx,1);
  localStorage.setItem("cart", JSON.stringify(cart));
  openCart();
}

function closeCart() {
  document.getElementById("cart").style.display = "none";
}

function checkout() {
  if(cart.length === 0) return alert("Cart is empty ❌");
  alert("Checkout not linked yet!");
}
