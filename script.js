let cart = JSON.parse(localStorage.getItem("cart")) || [];

// PRODUCTS PAGE
let container = document.getElementById("products");

if (container) {
fetch('products.json')
.then(res => res.json())
.then(data => {

let html = "";

data.forEach(product => {
let firstColor = Object.keys(product.colors)[0];
let image = product.colors[firstColor].front;

html += `
<div class="product" onclick="openProduct('${product.id}')">
<img src="${image}">
<h3>${product.name}</h3>
<p>Rs ${product.price}</p>
</div>
`;
});

container.innerHTML = html;
});
}

function openProduct(id){
window.location.href = `product.html?id=${id}`;
}

// PRODUCT PAGE
let urlParams = new URLSearchParams(window.location.search);
let productId = urlParams.get("id");

let currentProduct = null;
let selectedColor = null;
let selectedView = "front";
let selectedSize = null;

if(productId){
fetch('products.json')
.then(res=>res.json())
.then(data=>{

let product = data.find(p=>p.id===productId);
currentProduct = product;

document.getElementById("product-name").innerText = product.name;
document.getElementById("product-price").innerText = "Rs " + product.price;

let colorsDiv = document.getElementById("colors");

let firstColor = Object.keys(product.colors)[0];
selectedColor = firstColor;

document.getElementById("main-image").src =
product.colors[firstColor][selectedView];

// COLORS
Object.keys(product.colors).forEach(color=>{
let btn = document.createElement("button");
btn.innerText = color;
btn.classList.add("color-btn");

btn.onclick = ()=>{
selectedColor = color;
updateImage();

document.querySelectorAll(".color-btn").forEach(b=>b.classList.remove("active"));
btn.classList.add("active");
};

colorsDiv.appendChild(btn);
});

// FRONT/BACK
document.getElementById("frontBtn").onclick = ()=>{
selectedView = "front";
updateImage();
setActive("frontBtn");
};

document.getElementById("backBtn").onclick = ()=>{
selectedView = "back";
updateImage();
setActive("backBtn");
};

function updateImage(){
document.getElementById("main-image").src =
product.colors[selectedColor][selectedView];
}

function setActive(id){
document.querySelectorAll(".view-btn").forEach(b=>b.classList.remove("active"));
document.getElementById(id).classList.add("active");
}

// SIZE
document.querySelectorAll(".size-btn").forEach(btn=>{
btn.onclick = ()=>{
selectedSize = btn.innerText;

document.querySelectorAll(".size-btn").forEach(b=>b.classList.remove("active"));
btn.classList.add("active");
};
});

});
}

// ADD TO CART
function addToCart(){
if(!selectedSize){
alert("Select size");
return;
}

let item = {
...currentProduct,
selectedColor,
selectedSize
};

cart.push(item);
localStorage.setItem("cart", JSON.stringify(cart));

alert("Added to cart");
}
