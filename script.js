function buyNow(productName, price) {
  const modal = document.getElementById("checkoutModal");
  const productInfo = document.getElementById("productInfo");

  // Show product details
  productInfo.textContent = `🛍️ ${productName} — PKR ${price}`;

  // Reset form and show it
  document.getElementById("checkoutForm").reset();
  document.getElementById("checkoutForm").style.display = "block";
  document.getElementById("paymentInfo").style.display = "none";

  modal.style.display = "flex";
}

function closeModal() {
  document.getElementById("checkoutModal").style.display = "none";
}

// When form submitted -> show payment info
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkoutForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.style.display = "none";
    document.getElementById("paymentInfo").style.display = "block";
  });
});

// Close modal if clicked outside
window.onclick = function (event) {
  const modal = document.getElementById("checkoutModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

