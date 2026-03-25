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
let urlParams = new URLSearchParams(window.location.search);
let productId = urlParams.get("id");
let currentProduct = null;

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
document.getElementById("product-image").src = product.colors[firstColor][0];

Object.keys(product.colors).forEach(color=>{
let btn = document.createElement("button");
btn.innerText = color;
btn.classList.add("color-btn");

btn.onclick = ()=>{
document.getElementById("product-image").src = product.colors[color][0];
};

colorsDiv.appendChild(btn);
});

});
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
