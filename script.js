function buyNow(productName, price) {
  const modal = document.getElementById("checkoutModal");
  const productInfo = document.getElementById("productInfo");
  productInfo.textContent = `🛍️ ${productName} — PKR ${price}`;
  modal.dataset.product = productName;
  modal.dataset.price = price;
  modal.style.display = "flex";
}

function closeModal() {
  document.getElementById("checkoutModal").style.display = "none";
}

// Form submission
async function confirmOrder() {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const city = document.getElementById("city").value.trim();
  const address = document.getElementById("address").value.trim();
  const modal = document.getElementById("checkoutModal");

  if (!name || !phone || !city || !address) {
    alert("⚠️ Please fill in all fields before confirming your order.");
    return;
  }

  const product = modal.dataset.product;
  const price = modal.dataset.price;

  const orderData = { name, phone, city, address, product, price };

  // 🔗 Paste your Google Apps Script URL here
  const scriptURL = "https://script.google.com/macros/s/AKfycbxn5uAVBcD_ygs7S9z4AFhEz90fOnd2AMhLa4xc8pitv_ka2u6d24M1-jNJM4qj2Oyo/exec";

  try {
    const response = await fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      alert("✅ Your order has been placed successfully!");
      closeModal();
    } else {
      alert("❌ Something went wrong. Please try again later.");
    }
  } catch (error) {
    alert("⚠️ Error sending order. Check your internet connection.");
  }
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById("checkoutModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
