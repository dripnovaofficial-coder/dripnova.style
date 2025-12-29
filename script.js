fetch("./products.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("products.json not found");
    }
    return response.json();
  })
  .then(products => {
    const grid = document.getElementById("product-grid");

    if (!grid) {
      console.error("product-grid div not found");
      return;
    }

    if (products.length === 0) {
      grid.innerHTML = "<p>No products available</p>";
      return;
    }

    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";

      card.innerHTML = `
        <img src="${product.images[0]}" alt="${product.PRODUCT_NAME}">
        <h3>${product.PRODUCT_NAME}</h3>
        <p>PKR ${product.PRICE_PKR}</p>
        <a href="product.html?id=${product.PRODUCT_ID}">View Product</a>
      `;

      grid.appendChild(card);
    });
  })
  .catch(error => {
    document.getElementById("product-grid").innerHTML =
      "<p style='color:red'>Error loading products</p>";
    console.error(error);
  });
