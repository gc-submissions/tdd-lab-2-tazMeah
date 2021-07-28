const Cart = require("./Cart");
const Product = require("./Product");
let { formatCurrency, getCoins } = require("./money-functions");

// temporary formatCurrency function if the real one doesn't exist.
formatCurrency = formatCurrency || (x => x);

const menu = [
  new Product("Candy Bar", 1, true),
  new Product("Bag of Chips", 2, true),
  new Product("Can of Soda", 3, true),
  new Product("Bottle of Milk", 3, false),
  new Product("Box of Cherries", 5, false)
]
setupUI();

function setupUI() {
  const menuList = document.getElementById("menu");
  const selectedItemsList = document.getElementById("selectedItems");
  const subtotalOutput = document.getElementById("subtotal");
  const taxOutput = document.getElementById("tax");
  const totalOutput = document.getElementById("total");
  const cashInput = document.getElementById("cashInput");
  const cashForm = document.getElementById("cashForm");
  const changeDueOutput = document.getElementById("changeDue");
  const cashInsertedOutput = document.getElementById("cashInserted");
  const paymentInsufficientMessage = document.getElementById("paymentInsufficientMessage");
  const changeSection = document.getElementById("change");
  const changeOutputs = changeSection.querySelectorAll(".change-count");
  const resetButton = document.getElementById("resetButton");

  menu.forEach((item, i) => {
    menuList.insertAdjacentHTML('beforeend',
      `<li>${formatCurrency(item.price)}${item.taxable ? "*" : ""} - ${item.name}
        <button data-index="${i}">Buy</button>
      </li>`);
  });

  let cart = new Cart();

  menuList.addEventListener("click", (e) => {
    const itemIndex = parseInt(e.target.getAttribute("data-index"));
    if (!isNaN(itemIndex)) {
      cart.add(menu[itemIndex]);
      updateBill();
    }
  });

  cashForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const cash = Number(cashInput.value) || 0;
    const change = cash - cart.getTotalWithTax();
    cashInsertedOutput.innerText = formatCurrency(cash);
    changeDueOutput.innerText = formatCurrency(change);

    if (change >= 0) {
      const coins = getCoins(Math.round(change * 100));
      changeOutputs[0].innerText = coins.quarters;
      changeOutputs[1].innerText = coins.dimes;
      changeOutputs[2].innerText = coins.nickels;
      changeOutputs[3].innerText = coins.pennies;
      changeSection.hidden = false;
      paymentInsufficientMessage.hidden = true;
    } else {
      changeSection.hidden = true;
      paymentInsufficientMessage.hidden = false;
    }
  });

  resetButton.addEventListener("click", () => {
    cart = new Cart();
    updateBill();
    cashInput.value = "";
    cashInsertedOutput.innerText = "";
    changeDueOutput.innerText = "";
    changeSection.hidden = true;
    paymentInsufficientMessage.hidden = true;
  });

  function updateBill() {
    selectedItemsList.innerHTML = "";
    for (const item of cart.items) {
      selectedItems.insertAdjacentHTML("beforeend", 
      `<tr>
        <td>${item.name}</td>
        <td>${formatCurrency(item.price)}</td>
        <td>${formatCurrency(item.getPriceWithTax())}</td>
      </tr>`);
    }
    subtotalOutput.innerText = formatCurrency(cart.getTotalBeforeTax());
    taxOutput.innerText = formatCurrency(cart.getTax());
    totalOutput.innerText = formatCurrency(cart.getTotalWithTax());
  }
}