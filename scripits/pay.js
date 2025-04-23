// Get cart from local storage
const checkoutCart = JSON.parse(localStorage.getItem("cart")) || [];
const cartBody = document.getElementById("checkout-cart-body");
const cartTotal = document.getElementById("checkout-total");
const thankyouMessage = document.getElementById("thankyou-message");
const form = document.getElementById("checkout-form");

// Display Cart Items and the total in the below
function renderCheckoutCart() {
  let total = 0;
  cartBody.innerHTML = "";
  checkoutCart.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.qty}</td>
      <td>$${(item.qty * item.price).toFixed(2)}</td>
    `;
    cartBody.appendChild(row);
    total += item.qty * item.price;
  });
  cartTotal.textContent = total.toFixed(2);
}

renderCheckoutCart();

// Validation Helper 
function setError(id, message) {
  document.getElementById(`error-${id}`).textContent = message;
}

function clearErrors() {
  document.querySelectorAll(".checkout-error").forEach(e => (e.textContent = ""));
}

// Validate Form 
form.addEventListener("submit", function (e) {
  e.preventDefault();
  clearErrors();
  let valid = true;

  const fields = [
    "name", "email", "phone",
    "address", "city", "postal",
    "cardname", "cardnumber", "expiry", "cvv"
  ];

  fields.forEach(field => {
    const value = document.getElementById(`checkout-${field}`).value.trim();
    if (!value) {
      setError(field, "This field is required");
      valid = false;
    } else {
      if (["phone", "cardnumber", "cvv", "expiry"].includes(field) && /\D/.test(value)) {
        setError(field, "Only numbers are allowed");
        valid = false;
      }
    }
  });

  if (valid) {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 3) + 3);
    const formattedDate = deliveryDate.toLocaleDateString();
// thank you massage
    thankyouMessage.innerHTML = `Thank you for your order!<br>Delivery expected within 7 days.`;
    thankyouMessage.classList.remove("cf-hidden");
    form.reset();
    localStorage.removeItem("cart");
  }
});
