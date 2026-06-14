
// MOBILE MENU

const menuToggle = document.getElementById("menuToggle");

const navLinks = document.querySelector(".nav-links");

if(menuToggle){
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}



// DARK MODE

const darkMode = document.getElementById("darkMode");

if(darkMode){

    darkMode.addEventListener("click", () => {

        document.body.classList.toggle("dark-theme");

    });

}



// PRODUCT SEARCH FILTER

const searchInput = document.getElementById("searchInput");

const productCards = document.querySelectorAll(".product-card");

if(searchInput){
    searchInput.addEventListener("keyup", () => {
        const searchValue = searchInput.value.toLowerCase();

        productCards.forEach(card => {

            const productName = card.querySelector("h3").textContent.toLowerCase();

            card.style.display =
                productName.includes(searchValue)
                ? "block"
                : "none";
        });
    });
}



// CART NOTIFICATION

const cartButtons = document.querySelectorAll(".product-card button");

const cartNotification = document.getElementById("cartNotification");



// SHOPPING CART

let cartCountValue = 0;

let total = 0;

const cartCount = document.getElementById("cartCount");

const cartSidebar = document.getElementById("cartSidebar");

const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");

const cartTotal = document.getElementById("cartTotal");

const cartIcon = document.querySelector(".cart-icon");

// LOAD SAVED CART

const savedCart = JSON.parse(localStorage.getItem("cart")) || [];

if(savedCart.length > 0){

    const emptyCart = document.querySelector(".empty-cart");

    if(emptyCart){
        emptyCart.remove();
    }

    let savedTotal = 0;

  savedCart.forEach((item, index) => {

    const cartProduct = document.createElement("div");

    cartProduct.classList.add("cart-product");

    cartProduct.innerHTML = `
        <div>
            <h4>${item.name}</h4>
            <p>${item.price}</p>
        </div>

        <i class="fa-solid fa-trash remove-item"></i>
    `;

    cartItems.appendChild(cartProduct);

    const removeBtn = cartProduct.querySelector(".remove-item");

    removeBtn.addEventListener("click", () => {

        let updatedCart = JSON.parse(localStorage.getItem("cart")) || [];

        updatedCart.splice(index, 1);

        localStorage.setItem(
            "cart",
            JSON.stringify(updatedCart)
        );

        location.reload();

    });

});

    cartCount.textContent = savedCart.length;

    cartTotal.textContent = savedTotal;

}

// OPEN CART

if(cartIcon){

    cartIcon.addEventListener("click", () => {

        cartSidebar.classList.add("active");

    });

}


// CLOSE CART

if(closeCart){

    closeCart.addEventListener("click", () => {

        cartSidebar.classList.remove("active");

    });

}



// ADD PRODUCTS

cartButtons.forEach(button => {

    button.addEventListener("click", () => {

        // Notification

        cartNotification.classList.add("show");

        setTimeout(() => {

            cartNotification.classList.remove("show");

        }, 2000);



        // Count

        cartCountValue++;

        cartCount.textContent = cartCountValue;

    

        // Product Info

        const productCard = button.parentElement;

        const productName = productCard.querySelector("h3").textContent;

        const productPrice = productCard.querySelector("p").textContent;



        // Remove Empty Message

        const emptyCart = document.querySelector(".empty-cart");

        if(emptyCart){

            emptyCart.remove();

        }



        // Create Cart Product

        const cartProduct = document.createElement("div");

        cartProduct.classList.add("cart-product");



        cartProduct.innerHTML = `

            <div>

                <h4>${productName}</h4>

                <p>${productPrice}</p>

            </div>

            <i class="fa-solid fa-trash remove-item"></i>

        `;



        // Total

        const priceNumber = parseInt(productPrice.replace("$",""));

        total += priceNumber;

        cartTotal.textContent = total;



        // Add Product To Sidebar

        cartItems.appendChild(cartProduct);



        // REMOVE ITEM

        const removeBtn = cartProduct.querySelector(".remove-item");

        removeBtn.addEventListener("click", () => {

    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];

    const index = savedCart.findIndex(item =>
        item.name === productName &&
        item.price === productPrice
    );

    if(index > -1){

        savedCart.splice(index, 1);

        localStorage.setItem(
            "cart",
            JSON.stringify(savedCart)
        );
    }

    cartProduct.remove();

    cartCountValue--;

    cartCount.textContent = cartCountValue;

    total -= priceNumber;

    cartTotal.textContent = total;

    if(cartItems.children.length === 0){

        cartItems.innerHTML = `

            <p class="empty-cart">

                Your cart is empty

            </p>

        `;
    }

});

    });

});
 
/* =========================
   HEALTH API
========================= */

fetch("http://127.0.0.1:5000/health")
.then(response => response.json())
.then(data => {

    const serverStatus =
    document.getElementById("serverStatus");

    if(serverStatus){

        serverStatus.innerHTML =
        `🟢 ${data.server}`;

    }

})
.catch(error => console.log(error));


/* =========================
   PRODUCT STATS
========================= */

fetch("http://127.0.0.1:5000/stats")
.then(response => response.json())
.then(data => {

    const totalProducts =
    document.getElementById("totalProducts");

    const totalCategories =
    document.getElementById("totalCategories");

    if(totalProducts){

        totalProducts.textContent =
        data.totalProducts;

    }

    if(totalCategories){

        totalCategories.textContent =
        data.totalCategories;

    }

})
.catch(error => console.log(error));


/* =========================
   FEATURED PRODUCTS
========================= */

fetch("http://127.0.0.1:5000/featured")
.then(response => response.json())
.then(products => {

    const container =
    document.getElementById(
        "featuredProducts"
    );

    if(!container) return;

    products.forEach(product => {

        container.innerHTML += `

        <div class="product-card">

            <img src="${product.image}">

            <h3>${product.name}</h3>

            <p>$${product.price}</p>

        </div>

        `;

    });

})
.catch(error => console.log(error));


/* =========================
   CART SUMMARY
========================= */

fetch("http://127.0.0.1:5000/cart-summary")
.then(response => response.json())
.then(data => {

    const cartSummary =
    document.getElementById(
        "cartSummary"
    );

    if(cartSummary){

        cartSummary.innerHTML =

        `Items: ${data.items}
         | Total: $${data.total}`;

    }

})
.catch(error => console.log(error));


/* =========================
   API SEARCH
========================= */

const apiSearch =
document.getElementById(
    "apiSearch"
);

if(apiSearch){

    apiSearch.addEventListener(
    "keyup",

    () => {

        fetch(
        `http://127.0.0.1:5000/search?q=${apiSearch.value}`
        )

        .then(response =>
        response.json())

        .then(products => {

            console.log(products);

        })

        .catch(error =>
            console.log(error)
        );

    });

}


/* =========================
   CART PREVIEW
========================= */

const previewItems =
document.getElementById(
    "previewItems"
);

if(previewItems){

    previewItems.textContent =
    `Items: ${cart.length}`;

}

const previewTotal =
document.getElementById(
    "previewTotal"
);

if(previewTotal){

    previewTotal.textContent =
    `Total: $${total}`;

}


/* =========================
   SPLASH SCREEN
========================= */

window.addEventListener("load", () => {

    const splash =
    document.getElementById(
        "splashScreen"
    );

    if(splash){

        setTimeout(() => {

            splash.style.display =
            "none";

        }, 4000);

    }

});