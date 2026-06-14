const params = new URLSearchParams(window.location.search);

const id = params.get("id");

let currentProduct = null;

// LOAD PRODUCT

fetch(`http://127.0.0.1:5000/products/${id}`)

.then(response => response.json())

.then(product => {

    currentProduct = product;

    document.getElementById("productImage").src =
        product.image;

    document.getElementById("productName").textContent =
        product.name;

    document.getElementById("productPrice").textContent =
        `$${product.price}`;

    document.getElementById("productDescription").textContent =
        product.description;

});


// CART ELEMENTS

const cartIcon =
document.querySelector(".cart-icon");

const cartSidebar =
document.getElementById("cartSidebar");

const closeCart =
document.getElementById("closeCart");

const cartItems =
document.getElementById("cartItems");

const cartCount =
document.getElementById("cartCount");

const cartTotal =
document.getElementById("cartTotal");

const addButton =
document.getElementById("detailsAddToCart");


// OPEN CART

if(cartIcon){

    cartIcon.addEventListener("click", () => {

        cartSidebar.classList.add("active");

        loadCart();

    });

}


// CLOSE CART

if(closeCart){

    closeCart.addEventListener("click", () => {

        cartSidebar.classList.remove("active");

    });

}


// LOAD CART

function loadCart(){

    fetch("http://127.0.0.1:5000/cart")

    .then(response => response.json())

    .then(cart => {

        cartItems.innerHTML = "";

        let total = 0;

        if(cart.length === 0){

            cartItems.innerHTML =

            `<p class="empty-cart">
                Your cart is empty
            </p>`;

        }

        cart.forEach((item,index) => {

            total += item.price;

            cartItems.innerHTML += `

<div class="cart-product">

    <div>

        <h4>${item.name}</h4>

        <p>$${item.price}</p>

    </div>

    <i class="fa-solid fa-trash remove-item"
       data-index="${index}"></i>

</div>

`;
        });

        cartCount.textContent = cart.length;

        cartTotal.textContent = total;

    });

}


// ADD TO CART

if(addButton){

    addButton.addEventListener("click", () => {

        fetch("http://127.0.0.1:5000/cart", {

            method: "POST",

            headers: {

                "Content-Type":
                "application/json"

            },

            body: JSON.stringify(currentProduct)

        })

        .then(() => {

    loadCart();

    document.addEventListener("click",(e)=>{

    if(e.target.classList.contains("remove-item")){

        const index =
        e.target.dataset.index;

        fetch(
            `http://127.0.0.1:5000/cart/${index}`,
            {
                method:"DELETE"
            }
        )

        .then(response=>response.json())

        .then(()=>{

            loadCart();

        });

    }

});

    const notification =
    document.getElementById("cartNotification");

    notification.textContent =
    currentProduct.name + " added to cart 🛒";

    notification.classList.add("show");

    setTimeout(() => {

        notification.classList.remove("show");

    }, 2000);

});

    });

}


// INITIAL COUNT

loadCart();
fetch("http://127.0.0.1:5000/reviews")

.then(response => response.json())

.then(reviews => {

const container =
document.getElementById(
"reviews"
);

reviews.forEach(review => {

container.innerHTML +=

`<p>${review.text}</p>`;

});

});