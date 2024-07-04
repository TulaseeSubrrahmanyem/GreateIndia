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
        let totalDummyPrice = 0;
        let totalQuantity = 0;
        let totaldummyoriginal=0
        
        if (cartItems.length === 0) {
         cartItemsContainer.innerHTML = `<p class='NoItems'>No items in the cart.</p>`;
            totalPriceContainer.textContent = ``;
            checkoutContainer.innerHTML = '';
            orderDetailsContainer.innerHTML = '';
            checkoutAllBtn.style.display = 'none';
            clearAllBtn.style.display = 'none';
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
            totaldummyoriginal=itemTotalPrice + itemTotalDummyPrice
            totalPrice += itemTotalPrice;
            totalDummyPrice += itemTotalDummyPrice;
            totalQuantity += item.count;
           
            const truncatedName = item.name.length > 15 ? item.name.substring(0, 20) + '...' : item.name;

            const productData = { ...item }; // Combine product data 
            const productDataString = JSON.stringify(productData, (key, value) => {
                // Escape single quotes in string values
                return typeof value === 'string' ? value.replace(/'/g, "&#39;") : value;
            });
        
           return  `
                <div class='item-details'>
                    <div class="item-image" data-product='${productDataString}' onclick="viewItemDetails(this)">
                        <img src="${item.image}" alt="${item.name}" class="item-img">
                    </div>
                    <div>
                     
                     <div>
                      
                       <h3 id="h3">${item.name}</h3>
                       <h4 id="h3">Price:&nbsp; &nbsp; &nbsp;<span class="discountgap">  &#8377; ${itemTotalPrice}</span></h4>
                       ${item.selectedSizes && item.selectedSizes.length > 0 && item.selectedSizes[0] !== '' ? `<p  id="h3" class='quantity'>Size: &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;${item.selectedSizes.join(', ')}</p>` : ''}
                       <p  id="h3" class='quantity'>Quantity:<span class="discountgap"> <span id="quantity${index}">${item.count}</span></span></p>
                       <h4 id="h3"  >Discount:   <span class="discountgap"> &#8377; ${itemTotalDummyPrice}</span> <span class="discountcolor">${item.discount}</span></h4>
                      
                       
                   
                      <div class='item-controls'>
                            <div class='quantity-controls'>
                                <button onclick="decrementItem(${index})" class='dequantityBtn'>-</button>
                                <span class='item-quantity' id="quantity${index}">${item.count}</span>
                                <button onclick="incrementItem(${index})" class='inquantityBtn'>+</button>
                            </div>
                            <div class="button-delete">
                                <button class='delete-btn' onclick="deleteItem(${index})">Remove</button>
                            </div>
                        </div>
                    </div>
                    </div>
                   
                </div>
                
            `;
           
        });
        // cartItemsContainer.innerHTML=cartItemsHTML
        orderDetailsContainer.innerHTML = `
        <div class="cartShowContainer">
            <div>
              ${cartItemsHTML}
            </div>
            <div class="checkout-totals">
                <h2 class="pricedetailsh2">PRICE DETAILS</h2>
                <p class='checkout-total2'><strong>Price(${totalQuantity}): &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &#8377; ${totaldummyoriginal.toFixed(2)}</strong></p>
                  <p class='checkout-total1'><strong>Discount:&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <span id="dumprice">-&#8377 ${totalDummyPrice}</span></strong></p>
                  <p class='checkout-total1'><strong>Total: &nbsp;  &nbsp;  &nbsp; &nbsp; &nbsp;  &nbsp; &nbsp; &nbsp; &#8377 ${ totalPrice.toFixed(2)}</strong></p>
                     <p class='checkout-total1' id='ordersave'>You will save &#8377 ${totalDummyPrice.toFixed(2)}on this order</p>
            </div>
        </div> 
        `;

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
            window.location.href =` productDetail.html?productId=${productId}&mainCategoryName=${mainCategoryName}`;
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