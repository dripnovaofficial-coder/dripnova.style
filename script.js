let products = [];

// Fetch products.json and store in products array
fetch("./products.json")
  .then(response => {
    if (!response.ok) throw new Error("products.json not found");
    return response.json();
  })
  .then(data => {
    products = data;
    // If product grid exists, render it
    const grid = document.getElementById("product-grid") || document.getElementById("grid");
    if (grid) renderProducts(grid);
  })
  .catch(error => {
    console.error(error);
    const grid = document.getElementById("product-grid") || document.getElementById("grid");
    if (grid) grid.innerHTML = "<p style='color:red'>Error loading products</p>";
  });

// Function to render products
function renderProducts(container) {
  container.innerHTML = "";
  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.images[0]}" alt="${product.PRODUCT_NAME}">
      <h3>${product.PRODUCT_NAME}</h3>
      <p>PKR ${product.PRICE_PKR}</p>
      <a href="product.html?id=${product.PRODUCT_ID}">View Product</a>
    `;
    container.appendChild(card);
  });
}

// Product page
function loadProductPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const product = products.find(p => p.PRODUCT_ID === id);

  if (!product) {
    document.body.innerHTML = "<h2 style='padding:20px'>Product Not Found</h2>";
    return;
  }

  document.getElementById("mainImg").src = product.images[0];
  document.getElementById("pname").innerText = product.PRODUCT_NAME;
  document.getElementById("pprice").innerText = `PKR ${product.PRICE_PKR}`;

  // Sizes
  const sizeContainer = document.getElementById("sizes");
  product.SIZE.forEach(size => {
    const btn = document.createElement("button");
    btn.innerText = size;
    btn.onclick = () => {
      document.querySelectorAll("#sizes button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    };
    sizeContainer.appendChild(btn);
  });

  // Colors
  const colorContainer = document.getElementById("colors");
  product.COLOURS.forEach(color => {
    const btn = document.createElement("button");
    btn.innerText = color;
    btn.onclick = () => {
      document.querySelectorAll("#colors button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      // Change main image based on color
      const img = product.images.find(i => i.toLowerCase().includes(color.toLowerCase()));
      if (img) document.getElementById("mainImg").src = img;
    };
    colorContainer.appendChild(btn);
  });

  // Thumbnails
  const thumbs = document.getElementById("thumbs");
  product.images.forEach(img => {
    const thumb = document.createElement("img");
    thumb.src = img;
    thumb.onclick = () => (document.getElementById("mainImg").src = img);
    thumbs.appendChild(thumb);
  });

  // Add to cart
  document.getElementById("addCart").onclick = () => {
    const selectedSize = document.querySelector("#sizes button.active")?.innerText;
    const selectedColor = document.querySelector("#colors button.active")?.innerText;

    if (!selectedSize || !selectedColor) {
      alert("Select size and color!");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("drip_cart") || "[]");
    cart.push({
      id: product.PRODUCT_ID,
      name: product.PRODUCT_NAME,
      price: product.PRICE_PKR,
      size: selectedSize,
      color: selectedColor,
      image: document.getElementById("mainImg").src
    });
    localStorage.setItem("drip_cart", JSON.stringify(cart));
    alert("Added to cart!");
  };
}
