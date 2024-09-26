// Select relevant HTML elements
let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let products = [];
let cart = [];

// Create overlay and product detail elements in the body
let overlay = document.createElement('div');
overlay.classList.add('overlay');
document.body.appendChild(overlay);

let productDetail = document.createElement('div');
productDetail.classList.add('productDetail');
document.body.appendChild(productDetail);

// Toggle cart visibility when cart icon or close button is clicked
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

// Function to show product detail modal
const showProductDetail = (product) => {
    productDetail.innerHTML = `
        <button class="closeDetail">Close</button>
        <img src="${product.image}" alt="${product.name}">
        <h2>${product.name}</h2>
        <div class="price">$${product.price}</div>
        <button class="addCart" data-id="${product.id}">Add To Cart</button>
    `;

    // Show overlay and product detail
    productDetail.classList.add('show');
    overlay.classList.add('show');

    // Close detail card event
    productDetail.querySelector('.closeDetail').addEventListener('click', () => {
        productDetail.classList.remove('show');
        overlay.classList.remove('show');
    });

    // Event listener for adding to cart from the product detail card
    productDetail.querySelector('.addCart').addEventListener('click', (event) => {
        let id_product = event.target.dataset.id;
        addToCart(id_product);
        productDetail.classList.remove('show');
        overlay.classList.remove('show');
    });
};

// Function to handle adding product data to HTML
const addDataToHTML = () => {
    listProductHTML.innerHTML = ''; // Clear any existing products in the list

    if (products.length > 0) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="eyeButton">👁️</button>
                <button class="addCart">Add To Cart</button>
            `;
            listProductHTML.appendChild(newProduct);
        });
    }
};

// Event listener for the product list
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;

    // Handle "Add To Cart" button click
    if (positionClick.classList.contains('addCart')) {
        let id_product = positionClick.parentElement.dataset.id;
        addToCart(id_product);
    }

    // Handle "Eye" button click to show product detail
    else if (positionClick.classList.contains('eyeButton')) {
        let id_product = positionClick.parentElement.dataset.id;
        let product = products.find(product => product.id == id_product);
        showProductDetail(product);
    }
});

// Add product to cart logic (remains unchanged)
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if (cart.length <= 0) {
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    } else if (positionThisProductInCart < 0) {
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
};

// Update the cart and sync with localStorage
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if (cart.length > 0) {
        cart.forEach(item => {
            totalQuantity = totalQuantity + item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
                <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">
                ${info.name}
                </div>
                <div class="totalPrice">$${info.price * item.quantity}</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;
        });
    }
    iconCartSpan.innerText = totalQuantity;
};

// Event listener for the cart item quantity adjustment
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if (positionClick.classList.contains('plus')) {
            type = 'plus';
        }
        changeQuantityCart(product_id, type);
    }
});

// Handle quantity change in the cart
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
                break;

            default:
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                } else {
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
};

// Initialize the app
const initApp = () => {
    // Fetch product data
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();

        // Load cart from memory if available
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    });
};

initApp();
