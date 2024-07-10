document.addEventListener("DOMContentLoaded", function() {


    // Step 2: User Information Page
    const step2 = document.getElementById("step2");
    const continueStep3 = document.getElementById("continueStep3");
    const cancelStep2 = document.getElementById("cancelStep2");

    // Step 3: Review Order Page
    const step3 = document.getElementById("step3");
    

    const buyingItem = JSON.parse(localStorage.getItem('buyingItem'));
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const paymentMethodRadios = document.querySelectorAll('input[type="radio"][name="paymentMethod"]');
    const cardDetails = document.getElementById("cardDetails");
    const upiDetails = document.getElementById("upiDetails");
    let checkoutItems = [];

    let totalPrice = 0;
    let totalDummyPrice = 0;
    let totalQuantity = 0;
    let totaldummyoriginal = 0;
  
    step2.style.display = "block";
   
     // Event listener for continuing to Step 3
    document.getElementById("continueStep3").addEventListener("click", function(event) {
        event.preventDefault(); // Prevent form submission
    
        // Get form values for user information
        const fullName = document.getElementById("name").value;
        const address = document.getElementById("address").value;
        const pincode = document.getElementById("pincode").value;
        const city = document.getElementById("city").value;
        const cardNumber = document.getElementById("cardNumber").value.trim();
        const upiId = document.getElementById("upiId").value.trim();
        const cvv = document.getElementById("cvv").value.trim();
        const state = document.getElementById("state").value;
        const landmark = document.getElementById("landmark").value;
        const alternatePhone = document.getElementById("alternatePhone").value;
        const phone = document.getElementById("phone").value;
    
        const selectedMethod = document.querySelector('input[type="radio"][name="paymentMethod"]:checked');
        
        // Clear existing error messages
        clearErrorMessages();
    
        // Validation: Check if required fields are empty and collect error messages
        const errors = [];
    
        if (!fullName.trim()) {
            errors.push({ id: "name", message: "Please enter your full name." });
        } else if (!fullName.trim().match(/^[a-zA-Z ]+$/)) {
            errors.push({ id: "name", message: "Please use alphabets only." });
        }
        if (!fullName.trim()) {
            errors.push({ id: "name", message: "Please enter your full name." });
        } else if (!fullName.trim().match(/^[a-zA-Z ]+$/)) {
            errors.push({ id: "name", message: "Please use alphabets only." });
        }
    
        if (!address.trim()) {
            errors.push({ id: "address", message: "Please enter your address." });
        } else if ((!/^.{1,60}$/.test(address.trim()) ||   // Check length between 1 to 60 characters
                    !/\d/.test(address) ||                // Must contain at least one digit
                    !/[a-zA-Z]/.test(address) ||          // Must contain at least one alphabet
                    !/[^\w\s]/.test(address)   )){
            errors.push({ id: "address", message: "contain special char,[0-9],[A-za-z]limit 60 char." });
        }
    
        if (!pincode.trim()) {
            errors.push({ id: "pincode", message: "Please enter your pincode." });
        } else if (!pincode.trim().match(/^\d{6}$/) || /^0{6}$/.test(pincode.trim())) {
            errors.push({ id: "pincode", message: "Contain 6 digits and can't be all zeros." });
        }
    
        if (!city.trim()) {
            errors.push({ id: "city", message: "Please enter your city/town/district." });
        } else if (!city.trim().match(/^[a-zA-Z\s]{1,20}$/)) {
            errors.push({ id: "city", message: "Contain [A-Za-z ]limit 20char." });
        }
    
        if (!landmark.trim()) {
            errors.push({ id: "landmark", message: "Please enter your landmark." });
        } else if (!landmark.trim().match(/^[a-zA-Z\s]{1,30}$/)){
            errors.push({ id: "landmark", message: "Contain [A-Za-z ]limit 30char." });
        }
    
        if (!phone.trim()) {
            errors.push({ id: "phone", message: "Please enter your phone number." });
        } else if (!phone.trim().match(/^[1-9][0-9]{9}$/)) {
            errors.push({ id: "phone", message: "Contain 10 digits and shouldn't start with zero.." });
        }
    
        if (!state.trim()) {
            errors.push({ id: "state", message: "State is mandatory." });
        } else if (!state.trim().match(/^[a-zA-Z\s]{1,20}$/)) {
            errors.push({ id: "state", message: "Contain [A-Za-z ]limit 20char." });
        }
    
        if (alternatePhone.trim() && !alternatePhone.trim().match(/^[1-9][0-9]{9}$/)) {
            errors.push({ id: "alternatePhone", message: "Contain 10 digits and shouldn't start with zero." });
        }
    
       
    
        if (selectedMethod) {
            if (selectedMethod.value === "card") {
                if (!cardNumber) {
                    errors.push({ id: "cardNumber", message: "Please enter your Card Number." });
                } else if (!cardNumber.match(/^\d{16}$/)) {
                    errors.push({ id: "cardNumber", message: "Card Number should be 16 digits." });
                }
                if (!cvv) {
                    errors.push({ id: "cvv", message: "Please enter your CVV." });
                } else if (!cvv.match(/^\d{3}$/)) {
                    errors.push({ id: "cvv", message: "CVV should be 3 digits." });
                }
            } else if (selectedMethod.value === "upi") {
                if (!upiId) {
                    errors.push({ id: "upiId", message: "Please enter your UPI ID." });
                } else if (!upiId.match(/^[\w.-]+@[\w.-]+$/)) {
                    errors.push({ id: "upiId", message: "Invalid UPI ID format." });
                }
            }
        } else {
            errors.push({ id: "paymentMethod", message: "Please select a payment method." });
        }
    
        // Display all error messages if there are any
        if (errors.length > 0) {
            errors.forEach(error => displayErrorMessage(error.id, error.message));
            return; // Exit the function without proceeding to Step 3
        }
       

        // Display order details in Step 3
        const orderDetailsContainer = document.getElementById("orderDetails");
      

        if(buyingItem && cartItems.length > 0){
            checkoutItems.push(buyingItem);
        }else if(!buyingItem && cartItems.length > 0){
            checkoutItems.push(...cartItems);
        }else if (buyingItem && !cartItems.length > 0) {
            checkoutItems.push(buyingItem);
        } 

    

        const orderItemsHTML = checkoutItems.map(item => {
            
            if (!item) {
                console.error('Invalid item found in checkoutItems:', item);
                return ''; // Return an empty string or handle differently based on your application logic
            }
            
            // Ensure item count is at least 1
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
            // Return the HTML string for the item
            return `
               <div class="order-item">
                    <div class="imagedetails">
                      <img src="${item.image}" alt="${item.name}" class="item-img">
                    </div>
                   
                    <div class="item-info">
                        <div class="overalls">
                        <p class="keyorder"><strong>Name     :</strong> </p>
                        <p class="dataorder">${item.name}</p>
                        </div>
                        <div class="overalls">
                        <p class="keyorder"><strong>Brand    :</strong> </p>
                        <p class="dataorder">${item.brand}</p>
                        </div>
                        <div class="overalls">
                          ${item.selectedSizes && item.selectedSizes.length > 0 && item.selectedSizes[0] !== '' ? ` <p class="keyorder"><strong>Size    :</strong> </p> <p class="dataorder"> ${item.selectedSizes.join(', ')}</p>` : ''}
                         </div>
                        <div class="overalls">
                            <p class="keyorder"><strong>discount    :</strong> </p>
                            <p class="dataorder" style="opacity: 0.7;">-&#8377;${itemTotalDummyPrice}</p>                            
                        </div>
                        <div class="overalls">
                        <p class="keyorder"><strong>Price    :</strong> </p>
                        <p class="dataorder">&#8377;${itemTotalPrice}</p>
                        </div>
                      
                        <div class="overalls">
                        <p class="keyorder"><strong>Quantity :</strong> </p>
                        <p class="dataorder">${item.count}</p>
                        </div>
                      
                     </div>
                </div>
            `;
        }).join('');
        
        // Calculate the subtotal of all items
        const subtotal = checkoutItems.reduce((total, item) => {
            // Parse the item price and replace commas
            let itemPrice = item.mainprice;
        
            // Check if itemPrice is NaN after parsing
            if (isNaN(itemPrice)) {
                // Attempt to replace commas globally before parsing
                if (typeof item.mainprice === 'string') {
                    itemPrice = parseFloat(item.mainprice.replace(/,/g, ''));
                } else {
                    console.error(`Invalid mainprice format for item: ${item.name}`);
                    return total; // or handle differently based on your application logic
                }
            }
        
            // Check again if itemPrice is NaN after attempted parsing
            if (!isNaN(itemPrice)) {
                // Add to the total subtotal
                return total + (itemPrice * item.count);
            } else {
                // Handle case where item.mainprice is not a valid number
                console.error(`Invalid mainprice for item: ${item.name}`);
                return total; // or handle differently based on your application logic
            }
        }, 0);

        
        // Generate the HTML for the order details section
        orderDetailsContainer.innerHTML = `
           <div class='reviewDetail'>
           <div>
            <div id="orderInfo"> 
             <h1>Order Review</h1>          
                ${orderItemsHTML}
            </div> 
             <div class="step3-buttons3">
                 <button id="cancelStep3" onclick="window.history.back();">Cancel</button>
                <button id="finishCheckout">Finish</button> 
            </div>
          
            </div>
            <div class='payInfo'>
                <div class="payment-info">
                <h5 class="payinf">Payment Information:</h5>
                <div class='payment'>
                ${selectedMethod.value === "card" ?`<p><strong>Card Number:     </strong><span>${cardNumber}</span></p> ` : ''}
                ${selectedMethod.value === "upi" ? `<p><strong>UPI ID:          </strong><span>${upiId}</span></p>` : ''}
                ${selectedMethod.value === "cod" ? `<p><strong>Payment Method:      </strong> <span>Cash on Delivery</span></p>` : ''}
                </div>
                <hr/>
                </div>
                <div class="shipping-info">
                <h5 class="shipinf">Shipping Information:</h5>
                <div class="address-details">
                    <div class="add">
                        <p class="added"><strong>Address:</strong></p>
                        <p class="add-details address">${address}</p>
                    </div>
                    <div class="add">
                    <p class="added"><strong>City:</strong></p>
                    <p class="add-details">${city}</p>
                    </div>
                    <div class="add">
                    <p class="added"><strong>Pincode:</strong></p>
                    <p class="add-details">${pincode}</p>
                    </div>
                    <div class="add">
                    <p class="added"><strong> State:</strong></p>
                    <p class="add-details">${state}</p>
                    </div>
                    <div class="add">
                    <p class="added"><strong>Landmark:</strong></span></p>
                    <p class="add-details">${landmark}</p>
                    </div>
                    <div class="add">
                    <p class="added"><strong>Phone Number:</strong></p>
                    <p class="add-details">${phone}</p>
                    </div>
                </div>
            </div>
            <hr/>
            <div class="price-total">
                <h5 class="payinf">Price Total:</h5>
                <div class="total">
                <div class="tt">
                    <p class="sree"><strong>Price(${totalQuantity}):</strong> </p>
                    <p class="sreenu" style="opacity:0.6">&#8377;${totaldummyoriginal.toFixed(2)}</p>
                </div>
                 
                 <div class="tt">
                    <p class="sree"><strong>Discount:</strong> </p>
                    <p class="sreenu" style="color:green ;opacity:0.6"> -&#8377;${totalDummyPrice.toFixed(2)}</p>
                </div>
               
                <div class="tt">
                <p class="sree"><strong>Total:</strong> </p>
                <p class="sreenu" >&#8377;${totalPrice.toFixed(2)}</p>
                
                </div>
               
                
            </div>
            <hr/>
             <p class='checkout-total1' style="color:green;margin:20px">You will save &#8377 ${totalDummyPrice.toFixed(2)}on this order</p>
            </div>
            
        </div> `;        

        // Show Step 3
        step2.style.display = "none";
        step3.style.display = "block";

           // Event listener for canceling Step 3
           const cancelStep3 = document.getElementById("cancelStep3");
           cancelStep3.addEventListener("click", function() {
               step3.style.display = "none";
               step2.style.display = "block";
           });


           
    // Event listener for finishing checkout
    const finishCheckout = document.getElementById("finishCheckout");
    finishCheckout.addEventListener("click", function(event) {
        event.preventDefault();
        if (this.hasAttribute('disabled')) {
            return; // Prevent multiple clicks
        }
        this.setAttribute('disabled', 'disabled');
        // Retrieve the user information from the form
        const fullName = document.getElementById("name").value.trim();
        const address = document.getElementById("address").value.trim();
        const pincode = document.getElementById("pincode").value.trim();
        const city = document.getElementById("city").value.trim();
        const cardNumber = document.getElementById("cardNumber").value.trim();
        const upiId = document.getElementById("upiId").value.trim();
        const state = document.getElementById("state").value.trim();
        const landmark = document.getElementById("landmark").value.trim();
        const alternatePhone = document.getElementById("alternatePhone").value.trim();
        const phone = document.getElementById("phone").value.trim();
    
        // Retrieve the checkout item from local storage
        const buyingItem = JSON.parse(localStorage.getItem('buyingItem'));
        const cartItems = JSON.parse(localStorage.getItem('checkoutItems')) || [];
    
        // Get the current date and time
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString();
        const formattedTime = currentDate.toLocaleTimeString();
    
     
      
       // Function to generate a timestamp-based order ID
       function generateOrderID() {
        const timestamp = new Date().getTime();
        const randomNum = Math.floor(Math.random() * 1000); // Generate a random number (between 0 and 999)
        return `${timestamp}-${randomNum}`;
    }

    // Assuming you have fullName, address, etc., defined elsewhere in your code
    // Generate the order ID
    const orderId = generateOrderID();

    // Create an object with the order details
    const orderDetails = {
        orderId: orderId,
        fullName: fullName,
        address: address,
        pincode: pincode,
        city: city,
        state: state,
        landmark: landmark,
        alternatePhone: alternatePhone,
        phone: phone,
        cardNumber: cardNumber,
        upiId: upiId,
        status: 'Confirmed', 
        items: [...checkoutItems].filter(item => item),
        orderDate: formattedDate,
        orderTime: formattedTime
    };
    
        // Retrieve existing orders from local storage
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
        // Add the current order to the list of orders
        orders.push(orderDetails);
    
        // Store the updated list of orders in local storage
        localStorage.setItem('orders', JSON.stringify(orders));
    
         // Store the last ordered items and their categories
    const lastOrderedItems = [...checkoutItems].filter(item => item);
   
    localStorage.setItem('lastOrderedItems', JSON.stringify(lastOrderedItems));
    
        // Remove the items from the cart if they are from the cart
        if (cartItems.length > 0) {
            localStorage.removeItem('checkoutItems');
        }
      

        // Clear the buying item from local storage if it's a direct purchase
        localStorage.removeItem('buyingItem');
        localStorage.removeItem('selectedProductData');
        if(!buyingItem){
            localStorage.removeItem('cart');
        }
       
    
        // Redirect to the thank you page
        window.location.href = "thanksPage.html";
        finishCheckout.hasEventListener = true;
    });
    });
    

    // Event listener for canceling Step 2
    cancelStep2.addEventListener("click", function() {
        // step1.style.display = "block";
        step2.style.display = "none";
        step3.style.display = "none";
    });

     // Event listener for payment method radios
     paymentMethodRadios.forEach(radio => {
        radio.addEventListener("click", function() {
            // Show/hide payment details based on the selected method
            if (radio.value === "card") {
                cardDetails.style.display = "block";
                upiDetails.style.display = "none";
            } else if (radio.value === "upi") {
                cardDetails.style.display = "none";
                upiDetails.style.display = "block";
            } else {
                cardDetails.style.display = "none";
                upiDetails.style.display = "none";
            }
        });
    });

   
   

    
    

    // Function to display error message for a specific input field
    function displayErrorMessage(inputId, message) {
        const inputElement = document.getElementById(inputId);
        const errorMessageElement = document.createElement("div");
        errorMessageElement.classList.add("error-message");
        errorMessageElement.textContent = message;
        inputElement.parentNode.insertBefore(errorMessageElement, inputElement.nextSibling);
        inputElement.classList.add("input-error"); // Add error class to input field
    }

    // Function to clear all error messages
    function clearErrorMessages() {
        const errorMessages = document.querySelectorAll(".error-message");
        errorMessages.forEach(errorMessage => errorMessage.remove());

        // Remove error class from all input fields
        const inputElements = document.querySelectorAll(".input-error");
        inputElements.forEach(inputElement => inputElement.classList.remove("input-error"));
    }

   

    window.addEventListener('beforeunload', function(event) {
        // Retrieve the buyingItem from localStorage
        const buyingItem = JSON.parse(localStorage.getItem('buyingItem'));
    
        // If buyingItem exists, add it to the cart before removing
        if (buyingItem) {
            // Retrieve the cart from localStorage
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
            // Check if the buyingItem is already in the cart
            const isInCart = cart.some(item => JSON.stringify(item) === JSON.stringify(buyingItem));
    
            // If not already in the cart, add it
            if (!isInCart) {
                cart.push(buyingItem);
                localStorage.setItem('cart', JSON.stringify(cart));
            }
    
            // Remove buyingItem from localStorage
            localStorage.removeItem('buyingItem');
        }
    
        // Optionally, return a string message to prompt the user (modern browsers)
        event.returnValue = '';  // Some browsers require this
    });    


});