document.addEventListener("DOMContentLoaded", async () => {
    const productImage = document.getElementById("productImage");
    const productName = document.getElementById("p-title");
    const productPrice = document.getElementById("price");
    const sizeContainer = document.getElementById("sizes");
    const colorContainer = document.getElementById("colors");
    const thumbnails = document.getElementById("thumbnails");
    const addToCartBtn = document.getElementById("add-to-cart");

    let selectedSize = null;
    let selectedColor = null;

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

    const colors = product.COLOURS.split(",").map(c => c.trim().toLowerCase());

    const imagesByColor = {};
    colors.forEach(color => {
        imagesByColor[color] = product.images.filter(img =>
            img.toLowerCase().includes(color.replace(" ", ""))
        );
    });

    selectedColor = colors[0];

    function updateThumbnails() {
        thumbnails.innerHTML = "";

        const imgs = imagesByColor[selectedColor].length
            ? imagesByColor[selectedColor]
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

    // ---------- SIZE SELECT ----------
    const sizes = product.SIZE.split(",");
    sizes.forEach(size => {
        const btn = document.createElement("button");
        btn.className = "size-btn";
        btn.textContent = size;
        btn.dataset.size = size;

        btn.addEventListener("click", () => {
            document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            selectedSize = size;
        });

        sizeContainer.appendChild(btn);
    });

    // ---------- COLOR SELECT ----------
    colors.forEach(color => {
        const dot = document.createElement("div");
        dot.className = "color-dot";
        dot.style.background = color;
        dot.dataset.color = color;

        dot.addEventListener("click", () => {
            document.querySelectorAll(".color-dot").forEach(d => d.classList.remove("selected"));
            dot.classList.add("selected");
            selectedColor = color;
            updateThumbnails();
        });

        colorContainer.appendChild(dot);
    });

    document.querySelector(`.color-dot[data-color="${selectedColor}"]`)
        .classList.add("selected");

    // ---------- ADD TO CART ----------
    addToCartBtn.addEventListener("click", () => {
        if (!selectedSize) {
            alert("Please select a size.");
            return;
        }
        if (!selectedColor) {
            alert("Please select a color.");
            return;
        }

        const cartItem = {
            id: product.PRODUCT_ID,
            name: product.PRODUCT_NAME,
            price: product.PRICE_PKR,
            size: selectedSize,
            color: selectedColor,
            image: productImage.src
        };

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(cartItem);
        localStorage.setItem("cart", JSON.stringify(cart));

        alert("Added to cart!");
    });
});
