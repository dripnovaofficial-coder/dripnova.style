const scriptURL = "https://script.google.com/macros/s/AKfycbx4cW4aNtmLKC2PZS2aGGuSXXCCIuWeMnejWd3JvRLXNWLn5okpJgX6y6shtVtuxluLiw/exec"; // replace with new one

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");
  const price = params.get("price");

  const productName = document.getElementById("productName");
  const productPrice = document.getElementById("productPrice");
  const productImage = document.getElementById("productImage");

  if (name && price) {
    productName.textContent = decodeURIComponent(name);
    productPrice.textContent = `PKR ${price}`;
    document.title = `${decodeURIComponent(name)} - DripNova`;
    productImage.src = "images/maroon front.png";
    productImage.setAttribute("data-front", "images/maroon front.png");
    productImage.setAttribute("data-back", "images/maroon back.png");
    document.getElementById("buyButton").onclick = () => buyNow(name, price);
  }

  // Hover for front/back switch
  productImage.addEventListener("mouseenter", () => {
    const back = productImage.getAttribute("data-back");
    if (back) productImage.src = back;
  });
  productImage.addEventListener("mouseleave", () => {
    const front = productImage.getAttribute("data-front");
    if (front) productImage.src = front;
  });

  // Color selection
  document.querySelectorAll(".color-swatch").forEach((swatch) => {
    swatch.addEventListener("click", () => {
      const front = swatch.getAttribute("data-front");
      const back = swatch.getAttribute("data-back");
      productImage.src = front;
      productImage.setAttribute("data-front", front);
      productImage.setAttribute("data-back", back);
    });
  });
});

function openProduct(name, price) {
  window.location.href = `product.html?name=${encodeURIComponent(name)}&price=${price}`;
}

function scrollToShop() {
  document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
}

function buyNow(productName, price) {
  const modal = document.getElementById("checkoutModal");
  const size = document.getElementById("sizeSelect").value;
  document.getElementById("productInfo").textContent = `🛍️ ${decodeURIComponent(productName)} — PKR ${price} (Size: ${size})`;
  document.getElementById("productField").value = decodeURIComponent(productName);
  document.getElementById("priceField").value = price;
  document.getElementById("sizeField").value = size;
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  const modal = document.getElementById("checkoutModal");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  document.getElementById("orderForm").reset();
}

document.addEventListener("submit", (e) => {
  const form = e.target;
  if (form.id === "orderForm") {
    e.preventDefault();
    const btn = form.querySelector("button");
    btn.textContent = "Placing order...";
    btn.disabled = true;

    fetch(scriptURL, { method: "POST", body: new FormData(form) })
      .then((res) => res.json())
      .then((data) => {
        if (data.result === "success") {
          form.style.display = "none";
          document.getElementById("paymentInfo").style.display = "block";
        } else {
          alert("❌ Error saving to sheet.");
        }
      })
      .catch(() => alert("⚠️ Network error — please check your connection or script URL."))
      .finally(() => {
        btn.textContent = "Confirm Order";
        btn.disabled = false;
      });
  }
});
