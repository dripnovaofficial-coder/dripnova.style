
const products = [

{
id:1,
name:"Astronaut Hoodie",
price:1299,
image:"products/astronaut.jpg"
},

{
id:2,
name:"Black Hoodie",
price:1199,
image:"products/black.jpg"
},

{
id:3,
name:"Street Shirt",
price:999,
image:"products/shirt.jpg"
}

]



if(document.getElementById("productContainer")){

let html=""

products.forEach(p=>{

html+=`

<div class="product">

<img src="${p.image}">

<h3>${p.name}</h3>

<p>Rs ${p.price}</p>

<a href="product.html?id=${p.id}">
View Product
</a>

</div>

`

})

document.getElementById("productContainer").innerHTML=html

}



if(document.getElementById("image")){

let id=new URLSearchParams(location.search).get("id")

let product=products.find(p=>p.id==id)

document.getElementById("image").src=product.image
document.getElementById("name").innerText=product.name
document.getElementById("price").innerText="Rs "+product.price

}



function addToCart(){

let id=new URLSearchParams(location.search).get("id")

let cart=JSON.parse(localStorage.getItem("cart"))||[]

cart.push(id)

localStorage.setItem("cart",JSON.stringify(cart))

alert("Added to Cart")

}



if(document.getElementById("cartItems")){

let cart=JSON.parse(localStorage.getItem("cart"))||[]

let html=""

cart.forEach(id=>{

let p=products.find(x=>x.id==id)

html+=`

<div class="cartItem">

${p.name} - Rs ${p.price}

</div>

`

})

document.getElementById("cartItems").innerHTML=html

}



function clearCart(){

localStorage.removeItem("cart")

location.reload()

}
