document.addEventListener("DOMContentLoaded", function() {
    loadCartItems();
    updateCartCount();
});

const cartItemsContainer = document.getElementById('cartItems');
const totalPriceContainer = document.getElementById('totalPrice');
const checkoutContainer = document.getElementById('checkoutContainer');
const orderDetailsContainer = document.getElementById('orderDetailsContainer');

const maxQuantity = 10;

function loadCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;
    let totalDummyPrice = 0;
    let totalQuantity = 0;
    let totaldummyoriginal = 0;

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `<p class='NoItems'>No items in the cart.</p>`;
        totalPriceContainer.textContent = ``;
        checkoutContainer.innerHTML = '';
        orderDetailsContainer.innerHTML = '';

        return;
    }

    const cartItemsHTML = cartItems.map((item, index) => {
        if (!item.count) {
            item.count = 1;
        }

        let itemPrice = parseFloat(item.mainprice);
        if (isNaN(item.mainprice)) {
            itemPrice = parseFloat(item.mainprice.replace(/,/g, ''));
        }

        let dummyPrice = parseFloat(item.dummyprice);
        if (isNaN(dummyPrice)) {
            dummyPrice = parseFloat(item.dummyprice.replace(/,/g, ''));
        }

        const itemTotalPrice = itemPrice * item.count;
        const itemTotalDummyPrice = dummyPrice * item.count;
        totaldummyoriginal = itemTotalPrice + itemTotalDummyPrice;
        totalPrice += itemTotalPrice;
        totalDummyPrice += itemTotalDummyPrice;
        totalQuantity += item.count;

        const truncatedName = item.name.length > 15 ? item.name.substring(0, 20) + '...' : item.name;

        const productData = { ...item };
        const productDataString = JSON.stringify(productData, (key, value) => {
            return typeof value === 'string' ? value.replace(/'/g, "&#39;") : value;
        });

        return `
            <div class='item-details'>
                
                <div class="item-image" data-product='${productDataString}' onclick="viewItemDetails(this)">
                    <img src="${item.image}" alt="${item.name}" class="item-img">
                </div>
                <div>
                    <div class="itemContent">
                        <div class='btnHeading'>
                            <h3 class="item-name">${item.name}</h3>
                            <div class="button-delete">
                                <button class='delete-btn' onclick="deleteItem(${index})">Remove</button>
                            </div>
                        </div>
                    </div>
                    <div>
                        ${item.selectedSizes && item.selectedSizes.length > 0 && item.selectedSizes[0] !== '' ? 
                        `<div class="size">
                          <p>Size:</p>
                          <p class="sizegap"> ${item.selectedSizes.join(', ')}</p>
                        </div>` : ''}

                        <div class="quantity">
                            <p>Quantity:</p>
                            <p class="discountgap"><span id="quantity${index}">${item.count}</span></p>
                        </div>
                        <div class="discount">
                            <p>Discount:</p>
                            <p class="discountAmount discountgap">- &#8377; ${itemTotalDummyPrice}</p>
                        </div>
                        <div class="price">
                            <p>Price:</p>
                            <p class="discountgap priceGap">&#8377; ${itemTotalPrice}</p>
                            <p class="discountcolor">${item.discount}</p>
                        </div>
                        <div class='item-controls'>
                            <div class='quantity-controls'>
                                <button onclick="decrementItem(${index})" class='dequantityBtn'>-</button>
                                <span class='item-quantity' id="quantity${index}">${item.count}</span>
                                <button onclick="incrementItem(${index})" class='inquantityBtn'>+</button>
                            </div>
                            <div class="button-delete1">
                                <button class='delete-btn' onclick="deleteItem(${index})">Remove</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    orderDetailsContainer.innerHTML = `
        <div class="cartShowContainer">
            <div>
            
                <div class='item-Detail-Container'>
                 <h1>Shopping Cart</h1>
                 
                    ${cartItemsHTML.join('')}
                </div>
                <div class="btnContiner">
                    <button id="clearAllBtn">Clear All</button>
                    <button id="checkoutAllBtn">Checkout All</button>
                </div>
            </div>
            <div class="checkout-totals">
                <h2 class="pricedetailsh2">PRICE DETAILS</h2>
                <hr class='pricedetailHr'/>
                <div class="price-details-row">
                    <p class="checkout-total1">Price (${totalQuantity}): <p/>
                    <p id='price'>&#8377; ${totaldummyoriginal.toFixed(2)}</p>
                </div>
                <div class="price-details-row">
                    <p class="checkout-total1">Discount:<p>
                    <p id="dumprice">-&#8377; ${totalDummyPrice.toFixed(2)}</p>
                </div>
                <div class="price-details-row">
                    <p class="checkout-total1">Delivery: </p>
                    <p id="deliver" style="text-decoration: line-through; opacity: 0.7">-&#8377; 40</p><p style="color: green; margin-left: -60px; font-size: 16px; margin-top: 25px">Free</p>
                </div>
                <hr class='pricehr'/>
                <div class="price-details-row">
                    <p class="checkout-total1"><strong>Total:</strong></p>
                    <p id='totalPrice'><strong>&#8377; ${totalPrice.toFixed(2)}</strong></p>
                </div>
                <hr class='pricehr'/>
                <div class="price-details-row">
                    <p class="checkout-total1" id="ordersave">You will save &#8377; ${totalDummyPrice.toFixed(2)} on this order</p>
                </div>
            </div>
        </div>
    `;

    localStorage.setItem('cart', JSON.stringify(cartItems));
    attachButtonListeners(); // Attach listeners after elements are created
}

function attachButtonListeners() {
    const clearAllBtn = document.getElementById('clearAllBtn');
    const checkoutAllBtn = document.getElementById('checkoutAllBtn');

    if (clearAllBtn) {
        clearAllBtn.addEventListener("click", function() {
            localStorage.removeItem('cart');
            loadCartItems();
            updateCartCount();
        });
    }

    if (checkoutAllBtn) {
        checkoutAllBtn.addEventListener("click", function() {
            localStorage.removeItem('checkoutItem');
            const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
            localStorage.setItem('checkoutItems', JSON.stringify(cartItems));
            window.location.href = "checkout.html";
        });
    }
}

window.viewItemDetails = function(div) {
    try {
        const productDataString = div.getAttribute('data-product');
        const productData = JSON.parse(productDataString);
        const productId = productData.id;
        const mainCategoryName = productData.mainCategoryName;

        localStorage.setItem('selectedProductData', JSON.stringify(productData));
        window.location.href = `productDetail.html?productId=${productId}&mainCategoryName=${mainCategoryName}`;
    } catch (error) {
        console.error('Error parsing product data:', error);
    }
}

window.deleteItem = function(index) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    loadCartItems();
    updateCartCount();
}

window.incrementItem = function(index) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    if (cartItems[index].count < maxQuantity) {
        cartItems[index].count++;
        localStorage.setItem('cart', JSON.stringify(cartItems));
        loadCartItems();
    } else {
        alert("Maximum limit of 10 Qty reached");
    }
}

window.decrementItem = function(index) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    if (cartItems[index].count > 1) {
        cartItems[index].count--;
        localStorage.setItem('cart', JSON.stringify(cartItems));
        loadCartItems();
    }
}

function updateCartCount() {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElement = document.getElementById('cartItemCount');
    if (cartCountElement) {
        cartCountElement.innerText = cartItems.length.toString();
    }
}
