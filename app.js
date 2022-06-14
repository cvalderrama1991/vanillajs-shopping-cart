// Navigation Start 
const mainNav = document.querySelector(".main-nav")
const burgerBtn = document.querySelector("#burger-btn")
const navLinks = document.querySelectorAll("[data-nav-link]")
burgerBtn.addEventListener("click", () => {
  mainNav.classList.toggle("open")
})
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open")
  })
})
// Navigation End

// Cart Start

const addToCartButtons = document.querySelectorAll("[data-add-to-cart-btn]")
const cartButton = document.querySelector("#cart-btn")
let cartProductQuantityTotal = document.querySelector("#cart-product-quantity-total")
const cartContainer = document.querySelector("#cart-container")
const cartProductList = document.querySelector("#cart-list")
let cartPriceTotalBtn = document.querySelector("#cart-price-total-btn")
const cartProductTemplate = document.querySelector("#cart-product-template")
const CART_PRODUCT_KEY = "CART_PRODUCT_LIST-products"
const productList = document.querySelector("#product-list")
let cartProducts = loadProduct()
cartProducts.forEach((product) => {
  renderCartProduct(product)
})

// Function to Open Cart Start
cartButton.addEventListener("click", () => {
  cartContainer.classList.toggle("open")
  cartButton.classList.toggle("show")
  if (cartButton.classList.contains("show")) {
    cartButton.innerText = "Close Cart"
  } else {
    cartButton.innerText = "Open Cart"
  }
})
// Function to Open Cart End

// Function to Add Products to Cart Start
productList.addEventListener("click", (e) => {

  if (!e.target.matches("[data-add-to-cart-btn]")) return

  const parent = e.target.closest(".product-item")
  const id = parent.dataset.id
  const image = parent.querySelector("[data-product-image]")
  const name = parent.querySelector("[data-product-name]")
  const price = parent.querySelector("[data-product-price]")
  const product = {
    image: image.getAttribute("src"),
    name: name.innerText,
    price: price.innerText,
    quantity: 1,
    id: id,
  }
  cartProducts.push(product)
  renderCartProduct(product)
  saveProduct()
  e.target.innerText = "In Cart"
  e.target.disabled = true
  cartContainer.classList.add("open")
  cartButton.innerText = "Close Cart"
  setTimeout(() => {
    cartContainer.classList.remove("open")
    cartButton.innerText = "Open Cart"
  }, 1000)
})
// Function to Add Products to Cart End

// Function to increase product quantity in cart
cartProductList.addEventListener("click", (e) => {
  if (!e.target.matches("[data-cart-product-increase-btn]")) return
  const cartProduct = e.target.closest(".cart-product")
  const name = cartProduct.querySelector("[data-cart-product-name]").innerText
  cartProducts.forEach((cartItem) => {
    if (cartItem.name === name) {
      cartProduct.querySelector("[data-cart-product-quantity]").innerText = ++cartItem.quantity
      saveProduct()
    }
  })
})

// Function to decrease product quantity in cart
cartProductList.addEventListener("click", (e) => {
  if (!e.target.matches("[data-cart-product-decrease-btn]")) return
  const cartProduct = e.target.closest(".cart-product")
  const name = cartProduct.querySelector("[data-cart-product-name]").innerText
  const id = cartProduct.dataset.cartId
  cartProducts.forEach((cartItem) => {
    if (cartItem.name === name) {
      if (cartItem.quantity > 1) {
        cartProduct.querySelector("[data-cart-product-quantity]").innerText = --cartItem.quantity
        saveProduct()
      } else {
        cartProduct.remove()
        cartProducts = cartProducts.filter((cp) => cp.name !== cartItem.name)
        saveProduct()
        unlockBtn(id)
      }
    }
  })
})

// Function to remove product from cartProduct
cartProductList.addEventListener("click", (e) => {
  if (!e.target.matches("[data-cart-product-remove-btn")) return
  const cartProduct = e.target.closest(".cart-product")
  const name = cartProduct.querySelector("[data-cart-product-name]").innerText
  const id = cartProduct.dataset.cartId
  cartProducts.forEach((cartItem) => {
    if (cartItem.name === name) {
      cartProduct.remove()
      cartProducts = cartProducts.filter((cp) => cp.name !== cartItem.name)
      saveProduct()
      unlockBtn(id)
    }
  })
})

// Function to Clear Cart
const clearCartBtn = document.querySelector("#cart-clear-btn")
clearCartBtn.addEventListener("click", () => {
  localStorage.removeItem(CART_PRODUCT_KEY)
  document.querySelectorAll(".cart-product").forEach((cartItem) => {
    cartItem.remove()
    saveProduct()
  })
  addToCartButtons.forEach((btn) => {
    btn.innerText = "Add to Cart"
    btn.disabled = false
  })
  cartProductQuantityTotal.innerText = 0
  cartPriceTotalBtn.innerText = "Pay $0"
})

function unlockBtn(id) {
  addToCartButtons.forEach((btn) => {
    const productItem = btn.closest(".product-item")
    const productId = productItem.dataset.id
    if (productId === id) {
      btn.innerText = "Add to Cart"
      btn.disabled = false
    }
  })
}

// Function Render Cart 
function renderCartProduct(product) {
  const cartProduct = cartProductTemplate.content.cloneNode(true)
  const listItem = cartProduct.querySelector(".cart-product")
  listItem.dataset.cartId = product.id
  const image = listItem.querySelector("[data-cart-product-image]")
  image.src = product.image
  const name = listItem.querySelector("[data-cart-product-name]")
  name.innerText = product.name
  const price = listItem.querySelector("[data-cart-product-price]")
  price.innerText = product.price
  const quantity = listItem.querySelector("[data-cart-product-quantity]")
  quantity.innerText = product.quantity
  cartProductList.appendChild(listItem)
}

function loadProduct() {
  const cart = localStorage.getItem(CART_PRODUCT_KEY)
  return JSON.parse(cart) || []
}

window.addEventListener("load", () => {
  cartProductQuantityTotal.innerText = cartProducts.length
  countCartTotal()
})

function countCartTotal() {
  let cartTotal = 0
  const cart = JSON.parse(localStorage.getItem(CART_PRODUCT_KEY)) || []
  cart.forEach((cartItem) => {
    (cartTotal += cartItem.quantity * cartItem.price)
  })
  cartPriceTotalBtn.innerText = `Pay $${cartTotal}`
}

function saveProduct() {
  localStorage.setItem(CART_PRODUCT_KEY, JSON.stringify(cartProducts))
  cartProductQuantityTotal.innerText = cartProducts.length
  countCartTotal()
}
// Function to Add Products to Cart End
