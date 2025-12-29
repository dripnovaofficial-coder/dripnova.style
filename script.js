let selectedColor = "";
let selectedSize = "";

/* LOAD PRODUCTS */
async function getProducts() {
  const res = await fetch("products.json");
  return await res.json();
}

/* HOME / PRODUCTS PAGE */
async function renderProducts(containerId) {
  const products = await getProducts();
  const grid = document.getElementById(containerId);
  grid.innerHTML = "";

  products.forEach(p => {
    const firstColor = Object.keys(p.colors)[0];
    const img = p.colors[firstColor][0];

    grid.innerHTML += `
      <div class="product-card">
        <a href="product.html?id=${p.id}">
          <img src="${img}">
          <h3>${p.name}</h3>
          <p>PKR ${p.price}</p>
        </a>
      </div>
    `;
  });
}

/* PRODUCT PAGE */
async function loadProductPage() {
  const id = new URLSearchParams(window.location.search).get("id");
  const products = await getProducts();
  const product = products.find(p => p.id === id);

  if (!product) {
    alert("Product not found");
    return;
  }

  selectedColor = Object.keys(product.colors)[0];
  selectedSize = product.sizes[0];

  document.getElementById("pname").textContent = product.name;
  document.getElementById("pprice").textContent = `PKR ${product.price}`;

  updateImages(product);
  renderOptions(product);

  document.getElementById("addCart").onclick = () => addToCart(product);
}

function updateImages(product) {
  const imgs = product.colors[selectedColor];
  document.getElementById("mainImg").src = imgs[0];

  const thumbs = document.getElementById("thumbs");
  thumbs.innerHTML = "";

  imgs.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.onclick = () => document.getElementById("mainImg").src = src;
    thumbs.appendChild(img);
  });
}

function renderOptions(product) {
  const sizes = document.getElementById("sizes");
  const colors = document.getElementById("colors");

  sizes.innerHTML = "";
  colors.innerHTML = "";

  product.sizes.forEach(size => {
    const btn = document.createElement("button");
    btn.textContent = size;
    if (size === selectedSize) btn.classList.add("active");
    btn.onclick = () => {
      selectedSize = size;
      renderOptions(product);
    };
    sizes.appendChild(btn);
  });

  Object.keys(product.colors).forEach(color => {
    const btn = document.createElement("button");
    btn.textContent = color;
    if (color === selectedColor) btn.classList.add("active");
    btn.onclick = () => {
      selectedColor = color;
      updateImages(product);
      renderOptions(product);
    };
    colors.appendChild(btn);
  });
}

/* CART */
function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("drip_cart") || "[]");

  cart.push({
    id: product.id,
    name: product.name,
    price: product.price,
    size: selectedSize,
    color: selectedColor,
    image: product.colors[selectedColor][0],
    qty: 1
  });

  localStorage.setItem("drip_cart", JSON.stringify(cart));
  alert("Added to cart");
}
