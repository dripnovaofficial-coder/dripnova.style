// ========================
// Products Page Logic
// ========================
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
            <img src="${image}" alt="${product.name}" width="200">
            <h3>${product.name}</h3>
            <p>Rs ${product.price}</p>
          </div>
        `;
      });

      container.innerHTML = html;

    })
    .catch(err => {
      console.error(err);
      container.innerHTML = "Error loading products";
    });
}

// Function to open product page
function openProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

// ========================
// Product Detail Page Logic
// ========================
let urlParams = new URLSearchParams(window.location.search);
let productId = urlParams.get("id");

if (productId) {

  fetch('products.json')
    .then(res => res.json())
    .then(data => {

      let product = data.find(p => p.id === productId);

      if (product) {

        document.getElementById("product-name").innerText = product.name;
        document.getElementById("product-price").innerText = "Rs " + product.price;

        let colorsDiv = document.getElementById("colors");

        // Set first color image initially
        let firstColor = Object.keys(product.colors)[0];
        document.getElementById("product-image").src = product.colors[firstColor][0];

        // Create color buttons dynamically
        Object.keys(product.colors).forEach(color => {

          let btn = document.createElement("button");
          btn.innerText = color;
          btn.style.marginRight = "10px";
          btn.onclick = () => {
            document.getElementById("product-image").src = product.colors[color][0];
          };

          colorsDiv.appendChild(btn);
        });

      }

    })
    .catch(err => {
      console.error(err);
    });
}
