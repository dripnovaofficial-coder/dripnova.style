// client-side script.js
const scriptURL = "https://script.google.com/macros/s/AKfycbyEUUoP_0spd5unlVoi_0kKlX6i5vkek2kI59yzW7LTgXkU0udiP1_bLGSjepJzUE4/exec"

function buyNow(productName, price) {
  const modal = document.getElementById("checkoutModal");
  document.getElementById("productInfo").textContent = `🛍️ ${productName} — PKR ${price}`;
  document.getElementById("productField").value = productName;
  document.getElementById("priceField").value = price;
  modal.style.display = "flex";
}

function closeModal() {
  document.getElementById("checkoutModal").style.display = "none";
}

window.onclick = function (event) {
  const modal = document.getElementById("checkoutModal");
  if (event.target === modal) modal.style.display = "none";
};

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("orderForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // show a loading state (optional)
    const submitBtn = form.querySelector('button[type="submit"]');
    const origText = submitBtn.textContent;
    submitBtn.textContent = "Placing order...";
    submitBtn.disabled = true;

    fetch(scriptURL, { method: "POST", body: new FormData(form) })
      .then(response => response.json())
      .then(data => {
        if (data && data.result === "success") {
          alert("✅ Order placed successfully! We'll contact you shortly.");
          form.reset();
          closeModal();
        } else {
          const msg = (data && data.message) ? data.message : "Unknown server error";
          alert("❌ Server error: " + msg);
          console.error("Server response:", data);
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        alert("⚠️ Network error — check your internet and try again.");
      })
      .finally(() => {
        submitBtn.textContent = origText;
        submitBtn.disabled = false;
      });
  });
});






