// ======================
// LOAD CART
// ======================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ======================
// SAVE CART
// ======================

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}

// ======================
// UPDATE CART COUNT
// ======================

function updateCartCount() {

    const cartCount =
    document.getElementById("cartCount");

    if (cartCount) {

        cartCount.textContent =
        cart.length;

    }

}

// ======================
// UPDATE CART SIDEBAR
// ======================

function updateCartUI() {

    const cartItems =
    document.getElementById("cartItems");

    const cartTotal =
    document.getElementById("cartTotal");

    if (!cartItems || !cartTotal) return;

    cartItems.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {

        cartItems.innerHTML =
        "<p class='empty-cart'>Your cart is empty</p>";

    } else {

        cart.forEach((item, index) => {

            total += Number(item.price);

            cartItems.innerHTML += `

            <div class="cart-item">

                <h4>${item.name}</h4>

                <p>$${item.price}</p>

                <button onclick="removeFromCart(${index})">
                    Remove
                </button>

            </div>

            `;

        });

    }

    cartTotal.textContent = total;

}

// ======================
// ADD PRODUCT
// ======================

function addToCart(product) {

    cart.push(product);

    saveCart();

    updateCartCount();

    updateCartUI();

    const notification =
    document.getElementById("cartNotification");

    if(notification){

        notification.style.display = "block";

        setTimeout(() => {

            notification.style.display = "none";

        }, 2000);

    }

}

// ======================
// REMOVE PRODUCT
// ======================

function removeFromCart(index) {

    cart.splice(index, 1);

    saveCart();

    updateCartCount();

    updateCartUI();

}

// ======================
// OPEN CART
// ======================

document.addEventListener("DOMContentLoaded", () => {

    updateCartCount();

    updateCartUI();

    const cartIcon =
    document.querySelector(".cart-icon");

    const cartSidebar =
    document.getElementById("cartSidebar");

    const closeCart =
    document.getElementById("closeCart");

    if(cartIcon && cartSidebar){

        cartIcon.addEventListener("click", () => {

            cartSidebar.classList.add("active");

        });

    }

    if(closeCart && cartSidebar){

        closeCart.addEventListener("click", () => {

            cartSidebar.classList.remove("active");

        });

    }

});

// ======================
// CHECKOUT
// ======================

const checkoutBtn =
document.getElementById("checkoutBtn");

if(checkoutBtn){

    checkoutBtn.addEventListener("click", () => {

        if(cart.length === 0){

            alert("Cart is empty");

            return;

        }

        alert("Order placed successfully 🎉");

        cart = [];

        saveCart();

        updateCartCount();

        updateCartUI();

    });

}