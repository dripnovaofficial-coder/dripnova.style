// === Google Sheet URL ===
const scriptURL = "https://script.google.com/macros/s/AKfycbzTeg5Mb0KSAW9R3vR_Sesyv4MXNd7GAr0pgBvk-6rsGu0Hq0xW6NU57eMKz42FSCU7/exec";

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




