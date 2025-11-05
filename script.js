// client-side script.js
const scriptURL = "https://script.google.com/macros/s/AKfycbxx6hIOm5UJc9EqTXSsJIaHmFWriF_IPo2fKGD0NGs96hXUGpiw5xd8rRBpvF8hOf0j/exec";

function buyNow(productName, price) {
  const modal = document.getElementById("checkoutModal");
  document.getElementById("productInfo").textContent = `🛍️ ${productName} — PKR ${price}`;
  document.getElementById("productField").value = productName;
  document.getElementById("priceField").value = price;
  modal.style.display = "flex";
}

function closeModal() {
  document.getElementById("checkoutModal").style.display = "none";
  document.getElementById("orderForm").reset();
}

window.onclick = function (event) {
  const modal = document.getElementById("checkoutModal");
  if (event.target === modal) modal.style.display = "none";
};

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("orderForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const origText = submitBtn.textContent;
    submitBtn.textContent = "Placing order...";
    submitBtn.disabled = true;

    fetch(scriptURL, { method: "POST", body: new FormData(form) })
      .then(response => response.json())
      .then(data => {
        if (data.result === "success") {
          // ✅ Order recorded successfully
          alert("✅ Order placed successfully! We'll contact you soon.");
          form.style.display = "none";
          document.getElementById("paymentInfo").style.display = "block";
        } else {
          alert("⚠️ There was an issue saving your order. Please message us on Instagram @dripn_ovaofficial.");
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        alert("⚠️ Something went wrong — please try again or contact support.");
      })
      .finally(() => {
        submitBtn.textContent = origText;
        submitBtn.disabled = false;
      });
  });
});

