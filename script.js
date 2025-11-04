function buyNow(productName, price) {
  const modal = document.getElementById("checkoutModal");
  const productInfo = document.getElementById("productInfo");

  // Show product name and price inside the modal
  if (productInfo) {
    productInfo.textContent = `🛍️ ${productName} — PKR ${price}`;
  }

  // Reset the form and show it again
  document.getElementById("checkoutForm").reset();
  document.getElementById("checkoutForm").style.display = "block";
  document.getElementById("paymentInfo").style.display = "none";

  // Display modal
  modal.style.display = "flex";
}

function closeModal() {
  document.getElementById("checkoutModal").style.display = "none";
}

// When form is submitted, show payment info instead
document.getElementById("checkoutForm").addEventListener("submit", function (e) {
  e.preventDefault();
  document.getElementById("checkoutForm").style.display = "none";
  document.getElementById("paymentInfo").style.display = "block";
});

// Close modal when clicking outside it
window.onclick = function (event) {
  const modal = document.getElementById("checkoutModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};



