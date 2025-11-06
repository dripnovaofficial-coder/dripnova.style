// ✅ Replace this with your Apps Script deployed Web App URL
const scriptURL =
  "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLgeZRr1of6Vg3jupyppU1pwgxVxpV-lH9kGuyVflc6p_zroFuu0lmVmQ2NMF_1HvI_4OGp_87TPgRjivNhTvINobAgn5-8oj2Q4C4zyw1NNd5wzIuStQMPg-PGXbnkJJCdzJWZenWPxa38rGNo7oqr90CVm8arMOWeKdRMgUBumIJWZcBGCKdlGpDOXmJlQ2jvPtzvE1c_cBsMhusOMzJXTX2DbhiWczolKthC6FI41eCiG26aUqhnlslujqX4igy7DyetuMforIbmBmKRpvSJLx_Se0Rjs559Kqsg2&lib=MEo2oDUQsSmasM29KsGKUFb6MA3OIdUPT";

function buyNow(productName, price) {
  const modal = document.getElementById("checkoutModal");
  document.getElementById(
    "productInfo"
  ).textContent = `🛍️ ${productName} — PKR ${price}`;
  document.getElementById("productField").value = productName;
  document.getElementById("priceField").value = price;
  document.getElementById("orderForm").style.display = "block";
  document.getElementById("paymentInfo").style.display = "none";
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  const modal = document.getElementById("checkoutModal");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  const form = document.getElementById("orderForm");
  form.reset();
  form.style.display = "block";
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

    fetch(scriptURL, {
      method: "POST",
      mode: "cors",
      body: new FormData(form),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Server response:", data);

        if (data.result === "success" || data.result === "ok") {
          form.style.display = "none";
          const paymentInfo = document.getElementById("paymentInfo");
          paymentInfo.style.display = "block";
          paymentInfo.scrollIntoView({ behavior: "smooth" });
        } else {
          alert("❌ Server error: " + (data.message || "Unknown error"));
        }
      })
      .catch((err) => {
        console.error("Network Error:", err);
        alert(
          "⚠️ Network error — please try again or contact us on Instagram."
        );
      })
      .finally(() => {
        submitBtn.textContent = origText;
        submitBtn.disabled = false;
      });
  });
});
