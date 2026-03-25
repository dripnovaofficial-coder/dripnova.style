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
let image = product.colors[firstColor][0];

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
let selectedColor = null;
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

document.getElementById("main-image").src = product.colors[firstColor][0];

Object.keys(product.colors).forEach(color=>{
let btn = document.createElement("button");
btn.innerText = color;
btn.classList.add("color-btn");

btn.onclick = ()=>{
selectedColor = color;
document.getElementById("main-image").src = product.colors[color][0];

// active effect
document.querySelectorAll(".color-btn").forEach(b=>b.classList.remove("active"));
btn.classList.add("active");
};

colorsDiv.appendChild(btn);
});

// SIZE SELECTION
document.querySelectorAll(".size-btn").forEach(btn=>{
btn.onclick = ()=>{
selectedSize = btn.innerText;

document.querySelectorAll(".size-btn").forEach(b=>b.classList.remove("active"));
btn.classList.add("active");
};
});

});
}

// ADD TO CART WITH SELECTION
function addToCart(){

if(!selectedSize){
alert("Please select size");
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

// ADD TO CART
function addToCart(){
cart.push(currentProduct);
localStorage.setItem("cart", JSON.stringify(cart));
alert("Added to cart");
}

// CART PAGE
let cartContainer = document.getElementById("cart-items");

if(cartContainer){
let total = 0;

cart.forEach(item=>{
let firstColor = Object.keys(item.colors)[0];
let image = item.colors[firstColor][0];

total += item.price;

cartContainer.innerHTML += `
<div class="cart-item">
<img src="${image}" width="80">
<p>${item.name} - Rs ${item.price}</p>
</div>
`;
});

document.getElementById("total-price").innerText = "Total: Rs " + total;
}
