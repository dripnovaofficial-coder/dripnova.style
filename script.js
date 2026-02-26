let products=[];

fetch("product.json")
.then(res=>res.json())
.then(data=>{

products=data;

loadProducts();

loadProductPage();

loadCart();

});




function loadProducts(){

let container=document.getElementById("productsContainer");

if(!container) return;


products.forEach(p=>{

container.innerHTML+=`

<div class="productCard">

<img src="${p.images[0]}">

<h3>${p.PRODUCT_NAME}</h3>

<p>Rs ${p.PRICE_PKR}</p>

<a href="product.html?id=${p.PRODUCT_ID}">

View Product

</a>

</div>

`;

});

}




let selectedSize="";
let selectedColor="";
let currentProduct=null;



function loadProductPage(){

let params=new URLSearchParams(location.search);

let id=params.get("id");

if(!id) return;


currentProduct=products.find(p=>p.PRODUCT_ID==id);


if(!currentProduct){

document.body.innerHTML="Product Not Found";

return;

}



document.getElementById("productName").innerText=currentProduct.PRODUCT_NAME;

document.getElementById("productPrice").innerText="Rs "+currentProduct.PRICE_PKR;

document.getElementById("productImage").src=currentProduct.images[0];



let sizes=currentProduct.SIZE.split(",");

sizes.forEach(s=>{

document.getElementById("sizes").innerHTML+=`

<button onclick="selectSize('${s}')">

${s}

</button>

`;

});



let colors=currentProduct.COLOURS.split(",");

colors.forEach(c=>{

document.getElementById("colors").innerHTML+=`

<button onclick="selectColor('${c}')">

${c}

</button>

`;

});


}



function selectSize(s){

selectedSize=s;

}



function selectColor(c){

selectedColor=c;

}



function addToCart(){

let cart=JSON.parse(localStorage.getItem("cart")||"[]");


cart.push({

name:currentProduct.PRODUCT_NAME,

price:currentProduct.PRICE_PKR,

image:currentProduct.images[0]

});


localStorage.setItem("cart",JSON.stringify(cart));


alert("Added to Cart");

}




function loadCart(){

let container=document.getElementById("cartContainer");

if(!container) return;


let cart=JSON.parse(localStorage.getItem("cart")||"[]");


cart.forEach(item=>{

container.innerHTML+=`

<div class="cartItem">

<img src="${item.image}">

<div>

<h3>${item.name}</h3>

<p>Rs ${item.price}</p>

</div>

</div>

`;

});

}
