// GET PRODUCT ID FROM URL

const params = new URLSearchParams(window.location.search);

const productId = params.get("id");

const product = products[productId];



// LOAD PRODUCT DATA

document.getElementById("productImage").src = product.image;

document.getElementById("productName").textContent = product.name;

document.getElementById("productPrice").textContent = product.price;

document.getElementById("productDescription").textContent = product.description;



const featureList = document.getElementById("productFeatures");

featureList.innerHTML = "";

product.features.forEach(feature => {

    const li = document.createElement("li");

    li.textContent = feature;

    featureList.appendChild(li);

});



// CART VARIABLES




const cartCount = document.getElementById("cartCount");

const cartSidebar = document.getElementById("cartSidebar");

const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");

const cartTotal = document.getElementById("cartTotal");

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

    savedTotal += parseInt(item.price.replace("$",""));

    // DELETE ITEM

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
    cartTotal.textContent = savedTotal;
    cartCount.textContent = savedCart.length;
}

const cartIcon = document.querySelector(".cart-icon");

const addButton = document.getElementById("detailsAddToCart");



// OPEN CART

cartIcon.addEventListener("click", () => {

    cartSidebar.classList.add("active");

});



// CLOSE CART

closeCart.addEventListener("click", () => {

    cartSidebar.classList.remove("active");

});



// ADD TO CART

addButton.addEventListener("click", () => {

    // Save to localStorage cart

    addToCart({

        name: product.name,

        price: product.price,

        image: product.image

    });
    
   const notification = document.getElementById("cartNotification");

notification.textContent = `${product.name} added to cart 🛒`;

notification.classList.add("show");

setTimeout(() => {

    notification.classList.remove("show");

}, 2000);




    // Update counter

    



    // Remove empty cart message

    const emptyCart = document.querySelector(".empty-cart");

    if (emptyCart) {

        emptyCart.remove();

    }



    // Create cart item

    const cartProduct = document.createElement("div");

    cartProduct.classList.add("cart-product");



    cartProduct.innerHTML = `

        <div>

            <h4>${product.name}</h4>

            <p>${product.price}</p>

        </div>

    `;



    cartItems.appendChild(cartProduct);



    // Update total

    



    

});