const PRODUCTS_PAGE = "products.html";


function money(number) {
  return "$" + number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function showMessage(text, isError) {
  const box = document.getElementById("msg");

  box.textContent = text;
  box.hidden = false;

  if (isError) {
    box.className = "msg error";
  } else {
    box.className = "msg";
  }

  setTimeout(function () {
    box.hidden = true;
  }, 2500);
}


function increase(id) {
  const ok = increaseQuantity(id);

  if (!ok) {
    showMessage("Maximum available stock reached", true);
  }

  render();
}

function decrease(id) {
  decreaseQuantity(id);
  render();
}

function remove(id) {
  removeFromCart(id);
  showMessage("Product removed from cart", false);
  render();
}

function continueShopping() {
  window.location.href = PRODUCTS_PAGE;
}

function goToCheckout(method) {
  window.location.href = "checkout.html?method=" + method;
}

function usePromo() {
  const code = document.getElementById("promoInput").value;
  const ok = applyPromo(code);

  if (ok) {
    showMessage("Promo code applied", false);
  } else {
    showMessage("Invalid promo code", true);
  }

  render();
}


function renderItems() {
  const items = getCartItems();
  let html = "";

  for (let i = 0; i < items.length; i++) {
    const p = items[i];

    html = html + `
      <article class="card">
        <img src="${p.image}" alt="${p.name}">

        <div class="info">
          <div class="name-row">
            <div>
              <h3>${p.name}</h3>
              <p>${p.description}</p>
            </div>

            <div class="price">
              <b>${money(p.price * p.quantity)}</b>
              <s>${money(p.oldPrice * p.quantity)}</s>
            </div>
          </div>

          <div class="actions">
            <div class="qty">
              <button onclick="decrease('${p.id}')">−</button>
              <span>${p.quantity}</span>
              <button onclick="increase('${p.id}')">+</button>
            </div>

            <button class="remove" onclick="remove('${p.id}')">🗑 Remove</button>
          </div>
        </div>
      </article>`;
  }

  document.getElementById("items").innerHTML = html;
}

function renderShippingBar() {
  const subtotal = getSubtotal();
  let percent = (subtotal / FREE_SHIPPING_MIN) * 100;

  if (percent > 100) {
    percent = 100;
  }

  document.getElementById("barFill").style.width = percent + "%";

  if (percent >= 100) {
    document.getElementById("shipNote").innerHTML =
      "<b>FREE SHIPPING UNLOCKED!</b><br>VIP Priority Delivery Applied";
  } else {
    document.getElementById("shipNote").innerHTML =
      "<b>Add " + money(FREE_SHIPPING_MIN - subtotal) + " more</b><br>to unlock free shipping";
  }
}

function renderSummary(count) {
  const discount = getDiscountTotal();
  const shipping = getShipping();

  let itemWord = "Items";
  let unitWord = "units";

  if (count === 1) {
    itemWord = "Item";
    unitWord = "unit";
  }

  document.getElementById("count").textContent = "(" + count + " " + itemWord + ")";
  document.getElementById("unitsText").textContent = "Subtotal (" + count + " " + unitWord + ")";
  document.getElementById("subtotal").textContent = money(getSubtotal());
  document.getElementById("tax").textContent = money(getTax());
  document.getElementById("total").textContent = money(getCartTotal());

  if (discount > 0) {
    document.getElementById("discount").textContent = "-" + money(discount);
  } else {
    document.getElementById("discount").textContent = money(discount);
  }

  if (shipping === 0) {
    document.getElementById("shipping").textContent = "FREE";
  } else {
    document.getElementById("shipping").textContent = money(shipping);
  }
}

function render() {
  const count = getCartCount();

  document.getElementById("navCount").textContent = count;

  if (count === 0) {
    document.getElementById("cartPage").hidden = true;
    document.getElementById("empty").hidden = false;
    return;
  }

  document.getElementById("cartPage").hidden = false;
  document.getElementById("empty").hidden = true;

  renderSummary(count);
  renderShippingBar();
  renderItems();
}


loadCart().then(render);
