document.addEventListener("DOMContentLoaded", async () => {
    const container = document.querySelector("#product-container");
    const productImage = document.getElementById("product-image");
    const productName = document.getElementById("p-title");
    const productPrice = document.getElementById("price");
    const sizeContainer = document.getElementById("sizes");
    const colorContainer = document.getElementById("colors");
    const thumbnails = document.getElementById("thumbnails");
    const addToCartBtn = document.getElementById("add-to-cart");

    const params = new URLSearchParams(window.location.search);
    const productId = decodeURIComponent(params.get("id"));

    if (!productId) return;

    try {
        const res = await fetch("products.json");
        const data = await res.json();

        // Find product by ID
        const product = data.find(p => p.PRODUCT_ID === productId);
        if (!product) {
            container.innerHTML = "<h2>Product Not Found</h2>";
            return;
        }

        // Display name & price
        productName.textContent = product.PRODUCT_NAME;
        productPrice.textContent = `PKR ${product.PRICE_PKR}`;

        // Initialize main image
        let currentColor = product.COLOURS.split(",")[0].trim();
        let imagesByColor = {};

        // Map images by color
        product.COLOURS.split(",").forEach(c => {
            const colorKey = c.trim().toLowerCase().replace(/\s/g, "");
            imagesByColor[colorKey] = product.images.filter(img => img.toLowerCase().includes(colorKey));
            if (imagesByColor[colorKey].length === 0) {
                imagesByColor[colorKey] = product.images.slice();
            }
        });

        // Set initial image
        const initialImages = imagesByColor[currentColor.toLowerCase().replace(/\s/g, "")];
        let currentIndex = 0;
        productImage.src = initialImages[0];

        // Display thumbnails
        function renderThumbnails() {
            thumbnails.innerHTML = "";
            initialImages.forEach((img, idx) => {
                const t = document.createElement("img");
                t.src = img;
                t.className = "thumbnail";
                if (idx === currentIndex) t.style.border = "2px solid #fff";
                t.addEventListener("click", () => {
                    currentIndex = idx;
                    productImage.src = initialImages[currentIndex];
                    renderThumbnails();
                });
                thumbnails.appendChild(t);
            });
        }
        renderThumbnails();

        // Display sizes
        sizeContainer.innerHTML = "";
        product.SIZE.split(",").forEach(s => {
            const el = document.createElement("div");
            el.className = "size";
            el.textContent = s.trim();
            el.addEventListener("click", () => {
                document.querySelectorAll(".size").forEach(x => x.classList.remove("selected"));
                el.classList.add("selected");
            });
            sizeContainer.appendChild(el);
        });

        // Display colors
        colorContainer.innerHTML = "";
        product.COLOURS.split(",").forEach(c => {
            const el = document.createElement("div");
            el.className = "colour";
            el.textContent = c.trim();
            el.addEventListener("click", () => {
                document.querySelectorAll(".colour").forEach(x => x.classList.remove("selected"));
                el.classList.add("selected");

                // Update main image to first image of selected color
                const colorKey = c.trim().toLowerCase().replace(/\s/g, "");
                currentColor = colorKey;
                currentIndex = 0;
                productImage.src = imagesByColor[colorKey][0];
                renderThumbnails();
            });
            colorContainer.appendChild(el);
        });

        // Add to cart
        addToCartBtn.addEventListener("click", () => {
            const selectedSize = document.querySelector(".size.selected")?.textContent || "";
            const selectedColor = document.querySelector(".colour.selected")?.textContent || "";

            if (!selectedSize || !selectedColor) {
                alert("Please select size and color!");
                return;
            }

            const cart = JSON.parse(localStorage.getItem("drip_cart") || "[]");
            cart.push({
                id: product.PRODUCT_ID,
                name: product.PRODUCT_NAME,
                price: product.PRICE_PKR,
                size: selectedSize,
                color: selectedColor,
                image: productImage.src
            });
            localStorage.setItem("drip_cart", JSON.stringify(cart));
            alert("Added to cart");
        });

        // Optional: Responsive image sizing
        productImage.style.maxWidth = "100%";
        productImage.style.height = "auto";

    } catch (err) {
        console.error("Failed to load product", err);
        container.innerHTML = "<h2>Failed to load product</h2>";
    }
});
