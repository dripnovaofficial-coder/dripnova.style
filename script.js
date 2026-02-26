let products = [];

fetch("product.json")
.then(res => res.json())
.then(data => {

products = data;

loadProducts();

loadProductPage();

loadCart();

});



/* PRODUCTS PAGE */

function loadProducts(){

let container = document.getElementById("productsContainer");

if(!container) return;

container.innerHTML="";

products.forEach(p=>{

container.innerHTML += `

<div class="productCard">

<img src="${p.images[0]}">

<h3>${p.PRODUCT_NAME}</h3>

<p>Rs ${p.PRICE_PKR}</p>

<a class="viewBtn" href="product.html?id=${p.PRODUCT_ID}">

View Product

</a>

</div>

`;

});

}




/* PRODUCT PAGE */

let currentProduct=null;
let selectedSize="";
let selectedColor="";


function loadProductPage(){

let params=new URLSearchParams(location.search);

let id=params.get("id");

if(!id) return;


currentProduct=products.find(p=>p.PRODUCT_ID==id);


if(!currentProduct){

document.body.innerHTML="<h1>Product Not Found</h1>";

return;

}


document.getElementById("productName").innerText=currentProduct.PRODUCT_NAME;

document.getElementById("productPrice").innerText="Rs "+currentProduct.PRICE_PKR;

document.getElementById("productImage").src=currentProduct.images[0];



/* SIZES */

let sizeBox=document.getElementById("sizes");

if(sizeBox){

sizeBox.innerHTML="";

currentProduct.SIZE.forEach(size=>{

sizeBox.innerHTML+=`

<button onclick="selectSize('${size}')">

${size}

</button>

`;

});

}



/* COLORS */

let colorBox=document.getElementById("colors");

if(colorBox){

colorBox.innerHTML="";

currentProduct.COLOURS.forEach(color=>{

colorBox.innerHTML+=`

<button onclick="selectColor('${color}')">

${color}

</button>

`;

});

}



}



/* SELECT */

function selectSize(size){

selectedSize=size;

}



function selectColor(color){

selectedColor=color;

}



/* CART */

function addToCart(){

let cart=JSON.parse(localStorage.getItem("cart")||"[]");

cart.push({

name:currentProduct.PRODUCT_NAME,
price:currentProduct.PRICE_PKR,
image:currentProduct.images[0],
size:selectedSize,
color:selectedColor

});

localStorage.setItem("cart",JSON.stringify(cart));

alert("Added To Cart");

}



/* CART PAGE */

function loadCart(){

let container=document.getElementById("cartContainer");

if(!container) return;

container.innerHTML="";

let cart=JSON.parse(localStorage.getItem("cart")||"[]");


cart.forEach(item=>{

container.innerHTML+=`

<div class="cartItem">

<img src="${item.image}">

<div>

<h3>${item.name}</h3>

<p>Rs ${item.price}</p>

<p>${item.size} | ${item.color}</p>

</div>

</div>

`;

});

}
