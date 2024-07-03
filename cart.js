document.addEventListener("DOMContentLoaded", function() {
    const cartItemsContainer = document.getElementById('cartItems');
    const totalPriceContainer = document.getElementById('totalPrice');
    const checkoutContainer = document.getElementById('checkoutContainer');
    const orderDetailsContainer = document.getElementById('orderDetailsContainer');
    const checkoutAllBtn = document.getElementById('checkoutAllBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const maxQuantity = 10;
    function loadCartItems() {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;
        let totalQuantity = 0;

        
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = `<p class='NoItems'>No items in the cart.</p>`;
            totalPriceContainer.textContent = ``;
            checkoutContainer.innerHTML = '';
            orderDetailsContainer.innerHTML = '';
            checkoutAllBtn.style.display = 'none';
            clearAllBtn.style.display = 'none';
            return;
        }

        cartItems.forEach((item, index) => {
            if (!item.count) {
                item.count = 1;
            }

            let itemPrice = parseFloat(item.mainprice);
            if (isNaN(item.mainprice)) {
                itemPrice = parseFloat(item.mainprice.replace(/,/g, ''));
                console.log(itemPrice)
            }
            const itemTotalPrice = itemPrice * item.count;

            totalPrice += itemTotalPrice;
            totalQuantity += item.count;

            const truncatedName = item.name.length > 15 ? item.name.substring(0, 20) + '...' : item.name;

            const productData = { ...item }; // Combine product data 
            const productDataString = JSON.stringify(productData, (key, value) => {
                // Escape single quotes in string values
                return typeof value === 'string' ? value.replace(/'/g, "&#39;") : value;
            });
        
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <div class='item-details'>
                    <div class="item-image" data-product='${productDataString}' onclick="viewItemDetails(this)">
                        <img src="${item.image}" alt="${item.name}" class="item-img">
                    </div>
                    <div class='item-content'>
                        <div class='item-info'>
                            <h3>${item.name}</h3>
                            <h4>Price: &#8377; ${item.mainprice}</h4>
                            <p class='quantity'>Quantity: <span id="quantity${index}">${item.count}</span></p>
                         ${item.selectedSizes && item.selectedSizes.length > 0 && item.selectedSizes[0] !== '' ? `<p class='quantity'>Size: ${item.selectedSizes.join(', ')}</p>` : ''}

                            <p>Total: &#8377; <span id="itemTotalPrice${index}">${itemTotalPrice.toFixed(2)}</span></p>
                        </div>
                        <div class='item-controls'>
                            <div class='quantity-controls'>
                                <button onclick="decrementItem(${index})" class='dequantityBtn'>-</button>
                                <span class='item-quantity' id="quantity${index}">${item.count}</span>
                                <button onclick="incrementItem(${index})" class='inquantityBtn'>+</button>
                            </div>
                            <div class="button-delete">
                                <button class='delete-btn' onclick="deleteItem(${index})">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });

        const totalsHTML = `
            <div class="checkout-totals">
                <p class='checkout-total1'><strong>Total Quantity: ${totalQuantity}</strong></p>
                <p class='checkout-total2'><strong>Total Price: &#8377; ${totalPrice.toFixed(2)}</strong></p>
            </div>
        `;
        orderDetailsContainer.innerHTML = totalsHTML;
        checkoutAllBtn.style.display = 'inline-block';
        clearAllBtn.style.display = 'inline-block';

        localStorage.setItem('cart', JSON.stringify(cartItems));
    }

    window.viewItemDetails = function(div) {
        try {
            const productDataString = div.getAttribute('data-product');
            const productData = JSON.parse(productDataString);
            const productId = productData.id;
            const mainCategoryName = productData.mainCategoryName;

            // Store the product data locally
            localStorage.setItem('selectedProductData', JSON.stringify(productData));

            // Redirect to the product detail page with query parameters
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
        }
        localStorage.setItem('cart', JSON.stringify(cartItems));
        loadCartItems();
    }

    window.clearAll = function() {
        localStorage.removeItem('cart');
        loadCartItems();
        updateCartCount();
    }
    function updateCartCount() {
        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCountElement = document.getElementById('cartItemCount');
        if (cartCountElement) {
            cartCountElement.innerText = cartItems.length.toString();
        }
    }
    
    if (checkoutAllBtn) {
        checkoutAllBtn.addEventListener("click", function() {
            // Clear the 'checkoutItem' from local storage to avoid showing the individual order
            localStorage.removeItem('checkoutItem');

            // Retrieve the cart items from local storage or set to an empty array if none exist
            const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

            // Store the cart items in local storage under 'checkoutItems' for the checkout page
            localStorage.setItem('checkoutItems', JSON.stringify(cartItems));

            // Redirect to the checkout page
            window.location.href = "checkout.html"; // Adjust the path as needed
        });
    }
    // window.checkoutAll = function() {
    //     // Check if the checkoutAllBtn element exists
    //   const checkoutAllBtn = document.getElementById('checkoutAllBtn');
    //     if (checkoutAllBtn) {
    //         checkoutAllBtn.addEventListener("click", function() {
    //             // Clear the 'checkoutItem' from local storage to avoid showing the individual order
    //             localStorage.removeItem('checkoutItem');
    
    //             // Retrieve the cart items from local storage or set to an empty array if none exist
    //             const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
                
    //             // Store the cart items in local storage under 'checkoutItems' for the checkout page
    //             localStorage.setItem('checkoutItems', JSON.stringify(cartItems));
    //             // Redirect to the checkout page
    //             window.location.href = "checkout.html"; // Adjust the path as needed
    //         });
    //     }
    // }

    loadCartItems();

    
});
