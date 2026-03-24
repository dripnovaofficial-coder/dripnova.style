let container = document.getElementById("products");

if (container) {
  fetch('products.json')
    .then(res => res.json())
    .then(data => {

      let html = "";

      data.forEach(product => {

        // Get first color (Black, White etc)
        let colors = product.colors;
        let firstColor = Object.keys(colors)[0];

        // Get first image of that color
        let image = colors[firstColor][0];

        html += `
          <div class="product">
            <img src="${image}" alt="${product.name}">
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
