// PRODUCT DATA
const productImages = {
  "Be Your Own Hero": {
    black: "images/black front.png",
    maroon: "images/maroon front.png",
    white: "images/white front.png"
  },
  "Stay Focused Break Rules": {
    olive: "images/stay-focused-break-rules front olive .png",
    charcol: "images/stay-focused-break-rules front charcol .png",
    white: "images/stay-focused-break-rules front.png"
  },
  "Just Keep Moving Forward": {
    black: "images/moving-forward-hoodie.png"
  },
  "Your Mind Hoodie": {
    black: "images/your mind hoodie front.png"
  },
  "Awesome Brother Hoodie": {
    black: "images/awesome-brother front.png"
  }
};

// ✅ Show Product Info
function openProduct(name, price) {
  localStorage.setItem("productName", name);
  localStorage.setItem("productPrice", price);
  window.location.href = "product.html";
}

// ✅ On product page load
window.addEventListener("DOMContentLoaded", () => {
  const name = localStorage.getItem("productName");
  const price = localStorage.getItem("productPrice");

  if (name && price) {
    document.getElementById("product-name").textContent = name;
    document.getElementById("product-price").textContent = "PKR " + price;
    updateProductImage();
  }
});

// ✅ Update image when color changes
function updateProductImage() {
  const name = localStorage.getItem("productName");
  const color = document.getElementById("color-select").value;
  const img = document.getElementById("product-img");

  if (productImages[name] && productImages[name][color]) {
    img.src = productImages[name][color];
  } else {
    img.src = "dripnova-logo.png"; // fallback
  }
}

// ✅ Show order form only when clicking "Order Now"
function showOrderForm() {
  document.getElementById("order-form").classList.remove("hidden");
  document.getElementById("order-btn").style.display = "none";
}

// ✅ Smooth popup message
function showPopup(message, isError = false) {
  const popup = document.getElementById("popup");
  popup.textContent = message;
  popup.className = "popup " + (isError ? "error" : "success");
  popup.classList.remove("hidden");
  setTimeout(() => popup.classList.add("hidden"), 2500);
}

// ✅ Submit order to Google Apps Script
function submitOrder(e) {
  e.preventDefault();

  const data = {
    product: localStorage.getItem("productName"),
    price: localStorage.getItem("productPrice"),
    color: document.getElementById("color-select").value,
    size: document.getElementById("size-select").value,
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value
  };

  fetch("https://script.google.com/macros/s/AKfycbxympv_30sMFi5mV_G_tmvS3AtFZUTe-6NhUSiM8YV1VGdjoq8Xyv7c_EFRrLIk4AuJ6Q/exec", {
    method: "POST",
    body: JSON.stringify(data)
  })
    .then(res => res.text())
    .then(response => {
      if (response.includes("Success")) {
        showPopup("✅ Order placed successfully!");
        setTimeout(() => (window.location.href = "thankyou.html"), 2000);
      } else {
        showPopup("⚠️ Something went wrong. Try again.", true);
      }
    })
    .catch(() => {
      showPopup("⚠️ Network error. Please try again.", true);
    });
}

