// PRODUCT DATA (example for 1 product, you can add all 13 products here)
const products = [
  {
    id: "#0001",
    name: "Astronauts Hoodie",
    price: 1299,
    sizes: ["S","M","L","XL","XXL"],
    colors: ["BLACK","WHITE"],
    images: {
      BLACK: [
        "https://raw.githubusercontent.com/dripnovaofficial-coder/dripnova.style/main/products/Astronauts/astronauts_black_front.png",
        "https://raw.githubusercontent.com/dripnovaofficial-coder/dripnova.style/main/products/Astronauts/astronauts_black_back.png"
      ],
      WHITE: [
        "https://raw.githubusercontent.com/dripnovaofficial-coder/dripnova.style/main/products/Astronauts/astronauts_white_front.png",
        "https://raw.githubusercontent.com/dripnovaofficial-coder/dripnova.style/main/products/Astronauts/astronauts_white_back.png"
      ]        
    },
       {
    "PRODUCT_ID": "0002",
    "PRODUCT_NAME": "Climb Your Way To The Top",
    "TYPE": "SWEATSHIRT",
    "SIZE": "S,M,L,XL,XXL",
    "COLOURS": "BLACK,CHOCOLATE,MAROON,WHITE",
    "PRICE_PKR": 999,
    "images": { 
       BLACK: [
      "https://raw.githubusercontent.com/dripnovaofficial-coder/dripnova.style/main/products/Climb%20your%20way%20to%20the%20top/climb-your-way-to-the-top-black-front.jpg",
      "https://raw.githubusercontent.com/dripnovaofficial-coder/dripnova.style/main/products/Climb%20your%20way%20to%20the%20top/climb-your-way-to-the-top-black-back.jpg",
    ],
      CHOCOLATE: [       
      "https://raw.githubusercontent.com/dripnovaofficial-coder/dripnova.style/main/products/Climb%20your%20way%20to%20the%20top/climb-your-way-to-the-top-chocolate-front.jpg",
      "https://raw.githubusercontent.com/dripnovaofficial-coder/dripnova.style/main/products/Climb%20your%20way%20to%20the%20top/climb-your-way-to-the-top-chocolate-back.jpg"
    ],
      MAROON: [   
      "https://raw.githubusercontent.com/dripnovaofficial-coder/dripnova.style/main/products/Climb%20your%20way%20to%20the%20top/climb-your-way-to-the-top-maroon-front.jpg",
      "https://raw.githubusercontent.com/dripnovaofficial-coder/dripnova.style/main/products/Climb%20your%20way%20to%20the%20top/climb-your-way-to-the-top-maroon-back.jpg"
    ],
     WHITE: [    
      "https://raw.githubusercontent.com/dripnovaofficial-coder/dripnova.style/main/products/Climb%20your%20way%20to%20the%20top/climb-your-way-to-the-top-white-front.jpg",
      "https://raw.githubusercontent.com/dripnovaofficial-coder/dripnova.style/main/products/Climb%20your%20way%20to%20the%20top/climb-your-way-to-the-top-white-back.jpg"
    ]
  },
  }
];

let selectedProduct = products[0];
let selectedColor = selectedProduct.colors[0];
let selectedSize = selectedProduct.sizes[0];

const productImage = document.getElementById("productImage");
const thumbnails = document.getElementById("thumbnails");
const productName = document.getElementById("productName");
const price = document.getElementById("price");
const sizeOptions = document.getElementById("sizeOptions");
const colorOptions = document.getElementById("colorOptions");
const addToCart = document.getElementById("add-to-cart");

// RENDER PRODUCT
function renderProduct() {
  productName.textContent = selectedProduct.name;
  price.textContent = `₨${selectedProduct.price}`;

  // Render sizes
  sizeOptions.innerHTML = "";
  selectedProduct.sizes.forEach(size => {
    const btn = document.createElement("button");
    btn.textContent = size;
    btn.classList.add("size-option");
    if (size === selectedSize) btn.classList.add("selected");
    btn.addEventListener("click", () => {
      selectedSize = size;
      renderProduct();
    });
    sizeOptions.appendChild(btn);
  });

  // Render colors
  colorOptions.innerHTML = "";
  selectedProduct.colors.forEach(color => {
    const btn = document.createElement("button");
    btn.textContent = color;
    btn.classList.add("color-option");
    if (color === selectedColor) btn.classList.add("selected");
    btn.addEventListener("click", () => {
      selectedColor = color;
      renderProduct();
    });
    colorOptions.appendChild(btn);
  });

  // Render images
  thumbnails.innerHTML = "";
  selectedProduct.images[selectedColor].forEach((imgSrc, index) => {
    const thumb = document.createElement("img");
    thumb.src = imgSrc;
    thumb.addEventListener("click", () => {
      productImage.src = imgSrc;
    });
    thumbnails.appendChild(thumb);
    if (index === 0) productImage.src = imgSrc;
  });
}

// ADD TO CART
addToCart.addEventListener("click", () => {
  const cart = JSON.parse(localStorage.getItem("drip_cart") || "[]");
  cart.push({
    id: selectedProduct.id,
    name: selectedProduct.name,
    price: selectedProduct.price,
    size: selectedSize,
    color: selectedColor,
    image: selectedProduct.images[selectedColor][0],
    qty: 1
  });
  localStorage.setItem("drip_cart", JSON.stringify(cart));
  alert("Product added to cart!");
});

renderProduct();
