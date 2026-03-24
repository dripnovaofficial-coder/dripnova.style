let container = document.getElementById("products");

if (container) {
  fetch('products.json')
    .then(response => response.json())
    .then(data => {
      let html = "";

      data.forEach(product => {

        // Get first color
        let firstColor = Object.keys(product.colors)[0];

        // Get first image of that color
        let image = product.colors[firstColor][0];

        html += `
          <div class="product">
            <img src="${image}">
            <h3>${product.name}</h3>
            <p>Rs ${product.price}</p>
          </div>
        `;
      });

      container.innerHTML = html;
    })
    .catch(error => {
      console.error(error);
      container.innerHTML = "Failed to load products";
    });
}
