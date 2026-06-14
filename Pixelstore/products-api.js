const productContainer =
document.getElementById("productContainer");

const productCount =
document.getElementById("productCount");

function displayProducts(products){

    productContainer.innerHTML = "";

    if(productCount){

        productCount.textContent =
        `${products.length} Products Found`;

    }

    products.forEach(product => {

        productContainer.innerHTML += `

        <a href="product-details.html?id=${product.id}"
           class="product-link">

            <div class="product-card">

                <img src="${product.image}">

                <h3>${product.name}</h3>

                <p>$${product.price}</p>

                <button>Add To Cart</button>

            </div>

        </a>

        `;

    });

}

fetch("http://127.0.0.1:5000/products")

.then(response => response.json())

.then(products => {

    displayProducts(products);

})

.catch(error => {

    console.log(error);

});

const apiSearch =
document.getElementById("apiSearch");

if(apiSearch){

    apiSearch.addEventListener(

        "keyup",

        async () => {

            const response =
            await fetch(

                `http://127.0.0.1:5000/search?q=${apiSearch.value}`

            );

            const products =
            await response.json();

            displayProducts(products);

        }

    );

}