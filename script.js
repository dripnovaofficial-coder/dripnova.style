// === Google Sheet URL ===
const scriptURL = "https://script.google.com/macros/s/AKfycbxn5uAVBcD_ygs7S9z4AFhEz90fOnd2AMhLa4xc8pitv_ka2u6d24M1-jNJM4qj2Oyo/exec";

// Open checkout modal
function buyNow(productName, price) {
  const modal = document.getElementById("checkoutModal");
  document.getElementById("productInfo").textContent = `🛍️ ${productName} — PKR ${price}`;
  document.getElementById("productField").value = productName;
  document.getElementById("priceField").value = price;
  modal.style.display = "flex";
}

// Close modal
function closeModal() {
  document.getElementById("checkoutModal").style.display = "none";
}

// Click outside to close
window.onclick = function (event) {
  const modal = document.getElementById("checkoutModal");
  if (event.target === modal) modal.style.display = "none";
};

// Handle form submission
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("orderForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    fetch(scriptURL, { method: "POST", body: new FormData(form) })
      .then((response) => {
        alert("✅ Order placed successfully! We’ll contact you shortly on WhatsApp.");
        form.reset();
        closeModal();
      })
      .catch((error) => {
        console.error("Error!", error.message);
        alert("❌ Something went wrong. Please try again later.");
      });
  });
});



