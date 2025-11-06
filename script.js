// Product data (easy to expand)
const products = [
  {
    name: "Be Your Own Hero Hoodie",
    price: 1450,
    front: "images/maroon front.png",
    back: "images/maroon back.png",
  },
  {
    name: "Signature Black Hoodie",
    price: 1800,
    front: "images/black front.png",
    back: "images/black back.png",
  },
  {
    name: "Classic White Hoodie",
    price: 1650,
    front: "images/white front.png",
    back: "images/white back.png",
  }
];

// Dynamically render products
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("productList");
  if (!container) return;

  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.front}" data-front="${p.front}" data-back="${p.back}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>PKR ${p.price}</p>
      <button onclick="viewProduct('${encodeURIComponent(p.name)}', ${p.price})">View Product</button>
    `;
    div.querySelector("img").addEventListener("mouseenter", (e)=>{
      e.target.src = p.back;
    });
    div.querySelector("img").addEventListener("mouseleave", (e)=>{
      e.target.src = p.front;
    });
    container.appendChild(div);
  });
});

// Redirect to product details page
function viewProduct(name, price) {
  window.location.href = `product.html?name=${name}&price=${price}`;
}
