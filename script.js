const scriptURL = "https://script.google.com/macros/s/AKfycbxx6hIOm5UJc9EqTXSsJIaHmFWriF_IPo2fKGD0NGs96hXUGpiw5xd8rRBpvF8hOf0j/exec";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");
  const price = params.get("price");

  const productName = document.getElementById("productName");
  const productPrice = document.getElementById("productPrice");
  const productImage = document.getElementById("productImage");

  if (name && price && productName && productPrice) {
    productName.textContent = name;
    productPrice.textContent = `PKR ${price}`;
    document.title = `${name} - DripNova`;
    productImage.src = "images/maroon front.png"; // default
    document.getElementById("buyButton").onclick = () => buyNow(name, price);
  }

  // Hover effect for back view
  if (productImage) {
    productImage.addEventListener("mouseenter", () => {
      const back = productImage.getAttribute("data-back");
      if (back) productImage.src = back;
    });
    productImage.addEventListener("mouseleave", () => {
      const front = productImage.getAttribute("data-front");
      if (front) productImage.src = front;
    });
  }

  // Color switching
  const colorSwatches = document.querySelectorAll(".color-swatch");
  colorSwatches.forEach((swatch) => {
    swatch.addEventListener("click", () => {
      const front = swatch.getAttribute("data-front");
      const back = swatch.getAttribute("data-back");
      productImage.src = front;
      productImage.setAttribute("data-front", front);
      productImage.setAttribute("data-back", back);
    });
  });
});

// Checkout modal logic
function buyNow(productName, price) {
  const modal = document.getElementById("checkoutModal");
  document.getElementById("productInfo").textContent = `🛍️ ${productName} — PKR ${price}`;
  document.getElementById("productField").value = productName;
  document.getElementById("priceField").value = price;
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  const modal = document.getElementById("checkoutModal");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  document.getElementById("orderForm").reset();
}

// Form submission
document.addEventListener("submit", (e) => {
  const form = e.target;
  if (form.id === "orderForm") {
    e.preventDefault();
    const btn = form.querySelector("button");
    btn.textContent = "Placing order...";
    btn.disabled = true;

    fetch(scriptURL, { method: "POST", body: new FormData(form) })
      .then(res => res.json())
      .then(data => {
        if (data.result === "success") {
          form.style.display = "none";
          document.getElementById("paymentInfo").style.display = "block";
        } else {
          alert("❌ Error: " + data.message);
        }
      })
      .catch(() => alert("⚠️ Network error — please try again."))
      .finally(() => {
        btn.textContent = "Confirm Order";
        btn.disabled = false;
      });
  }
});

function buyNow(productName, price) {
  const modal = document.getElementById("checkoutModal");
  const size = document.getElementById("sizeSelect").value;
  document.getElementById("productInfo").textContent = `🛍️ ${productName} (${size}) — PKR ${price}`;
  document.getElementById("productField").value = productName;
  document.getElementById("priceField").value = price;
  document.getElementById("sizeField").value = size;
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
}
