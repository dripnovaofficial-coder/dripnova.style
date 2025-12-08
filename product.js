document.addEventListener("DOMContentLoaded", async () => {
    const productImage = document.getElementById("productImage");
    const productName = document.getElementById("p-title");
    const productPrice = document.getElementById("price");
    const sizeContainer = document.getElementById("sizes");
    const colorContainer = document.getElementById("colors");
    const thumbnails = document.getElementById("thumbnails");

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (!productId) return;

    const res = await fetch("products.json");
    const data = await res.json();

    const product = data.find(p => p.PRODUCT_ID === productId);

    if (!product) {
        productName.textContent = "Product Not Found";
        return;
    }

    productName.textContent = product.PRODUCT_NAME;
    productPrice.textContent = `PKR ${product.PRICE_PKR}`;

    // Extract colors
    const colors = product.COLOURS.split(",").map(c => c.trim().toLowerCase());

    // Organize images by color
    const imagesByColor = {};
    colors.forEach(color => {
        imagesByColor[color] = product.images.filter(img =>
            img.toLowerCase().includes(color.replace(" ", ""))
        );
    });

    let currentColor = colors[0];

    // Show first image
    productImage.src = imagesByColor[currentColor][0] || product.images[0];

    // Generate color buttons
    colorContainer.innerHTML = "";
    colors.forEach(color => {
        const dot = document.createElement("div");
        dot.className = "color-dot";
        dot.style.background = color;
        dot.dataset.color = color;

        dot.addEventListener("click", () => {
            currentColor = color;
            updateThumbnails();
        });

        colorContainer.appendChild(dot);
    });

    // Generate thumbnails
    function updateThumbnails() {
        thumbnails.innerHTML = "";
        const imgs = imagesByColor[currentColor].length
            ? imagesByColor[currentColor]
            : product.images;

        productImage.src = imgs[0];

        imgs.forEach(img => {
            const th = document.createElement("img");
            th.src = img;
            th.className = "thumb";
            th.addEventListener("click", () => {
                productImage.src = img;
            });
            thumbnails.appendChild(th);
        });
    }

    updateThumbnails();

    // Sizes
    const sizes = product.SIZE.split(",");
    sizeContainer.innerHTML = "";
    sizes.forEach(size => {
        const btn = document.createElement("button");
        btn.className = "btn size";
        btn.textContent = size;
        sizeContainer.appendChild(btn);
    });
});
