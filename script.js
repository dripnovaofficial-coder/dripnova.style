// client-side script.js
const scriptURL = "https://script.google.com/macros/s/AKfycbw4kMdLZ1equlToN4WDeJSubSLACEbBH5uv1e3CcQlGauKO8YCk0WfXLEnrnZYX3xIv/exec";

function buyNow(productName, price) {
  const modal = document.getElementById("checkoutModal");
  document.getElementById("productInfo").textContent = `🛍️ ${productName} — PKR ${price}`;
  document.getElementById("productField").value = productName;
  document.getElementById("priceField").value = price;
  // show form, hide payment info
  document.getElementById("orderForm").style.display = "block";
  document.getElementById("paymentInfo").style.display = "none";
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  const modal = document.getElementById("checkoutModal");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  // reset form for next use
  document.getElementById("orderForm").reset();
  document.getElementById("orderForm").style.display = "block";
  document.getElementById("paymentInfo").style.display = "none";
}

window.onclick = function (event) {
  const modal = document.getElementById("checkoutModal");
  if (event.target === modal) closeModal();
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
      .then((response) => response.json())
      .then((data) => {
        if (data && data.result === "success") {
          // show payment details inside modal (not an alert)
          form.style.display = "none";
          document.getElementById("paymentInfo").style.display = "block";
          // option: you can scroll to payment info
          document.getElementById("paymentInfo").scrollIntoView({ behavior: "smooth" });
        } else {
          const msg = data && data.message ? data.message : "Unknown server error";
          alert("❌ Server error: " + msg + "\nPlease contact us on Instagram.");
          console.error("Server response:", data);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        alert("⚠️ Network error — please try again or contact us on Instagram.");
      })
      .finally(() => {
        submitBtn.textContent = origText;
        submitBtn.disabled = false;
      });
  });
});



