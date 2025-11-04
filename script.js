function buyNow(productName, price) {
  const modal = document.getElementById("checkoutModal");
  const productInfo = document.getElementById("productInfo");
  productInfo.textContent = `🛍️ ${productName} — PKR ${price}`;
  modal.style.display = "flex";
}

function closeModal() {
  document.getElementById("checkoutModal").style.display = "none";
}

// Close modal when clicking outside it
window.onclick = function (event) {
  const modal = document.getElementById("checkoutModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};


