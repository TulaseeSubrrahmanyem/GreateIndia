// Function to display selected order details
function displayOrderDetails() {
    const ordersContainer = document.getElementById('details');
    const mapContainer = document.getElementById('mapContainer');
    ordersContainer.innerHTML = '';
    mapContainer.innerHTML = ''; // Clear map container before displaying new orders

    // Retrieve orders from local storage
    let orders = [];
    try {
        const storedOrders = localStorage.getItem('orders');
        if (storedOrders) {
            orders = JSON.parse(storedOrders);
        }
    } catch (error) {
        console.error('Error retrieving orders:', error);
    }

    // Retrieve the selected order index from local storage
    const selectedOrderIndex = localStorage.getItem("selectedOrderIndex");

    // Check if orders is an array and the selectedOrderIndex is valid
    if (!Array.isArray(orders) || selectedOrderIndex === null || !orders[selectedOrderIndex]) {
        console.error('Invalid order index or orders array:', selectedOrderIndex, orders);
        ordersContainer.innerHTML = '<p>No order details found.</p>';
        return;
    }

    // Display the selected order
    const order = orders[selectedOrderIndex];
    const orderDiv = document.createElement('div');
    orderDiv.classList.add('order');

     // Determine the status class
     let statusClass = '';
     switch (order.status.toLowerCase()) {
         case 'confirmed':
             statusClass = 'status-confirmed';
             break;
         case 'cancelled':
             statusClass = 'status-cancelled';
             break;
         case 'refunded':
             statusClass = 'status-refunded';
             break;
         default:
             statusClass = '';
     }

    // Initialize total price for the order
    let orderTotalPrice = 0;
    let totalItemCount = 0;

    // Add order details including landmark or address
    orderDiv.innerHTML = `
        <h1> <span class="${statusClass}">${order.status}</span></h1>
        <p><strong>Order-Id:</strong>${order.orderId}</p>
        <p><strong>Name:</strong> ${order.fullName}</p>
        <p><strong>Address:</strong> ${order.address}</p>
        ${order.landmark ? `<p><strong>Landmark:</strong> ${order.landmark}</p>` : ''}
        <p><strong>Phone:</strong> ${order.phone}</p>
        <p><strong>Date:</strong> ${order.orderDate}</p>
        <h4>Items:</h4>
    `;

    // Display each item in the order
    order.items.forEach(item => {
        if(!item.count){
            item.count=1
        }
       // console.log('Item:', item);
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('order-item');
 // Ensure item.mainprice is parsed correctly
 const price = typeof item.mainprice === 'string' ? parsePrice(item.mainprice) : item.mainprice;
        // Calculate total price for the item if not cancelled
        if (item.itemSubstatus !== 'cancelled') {
            const itemTotalPrice = parsePrice(item.mainprice) * item.count;
            orderTotalPrice += itemTotalPrice; // Add to the order's total price
            totalItemCount += item.count; // Add to the total item count

            itemDiv.innerHTML = `
                <div class="item-details">
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-info">
                        <p class="item-name"><strong>Name:</strong> ${item.name}</p>
                        <p class="item-quantity"><strong>Quantity:</strong> ${item.count}</p>
                     <p class="item-price"><strong>Total:</strong> ₹${price.toFixed(2)}</p>
                    </div>
                </div>
            `;
        } else {
            // Display cancelled items without price calculation
            itemDiv.innerHTML = `
                <div class="item-details">
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-info">
                        <p class="item-name"><strong>Name:</strong> ${item.name}</p>
                        <p class="item-quantity"><strong>Quantity:</strong> ${item.count}</p>
                        <p class="item-price"><strong>Total:</strong> ₹${item.mainprice}</p>
                        <p class="item-price"><strong>Status:</strong> Cancelled</p>
                    </div>
                </div>
            `;
        }

        orderDiv.appendChild(itemDiv);
    });

    // Add total price and buttons based on order status
    orderDiv.innerHTML += `
        <p class="order-total"><strong>Total Items:</strong> ${totalItemCount}</p>
        <p class="order-total"><strong>Total Price:</strong> ₹${orderTotalPrice.toFixed(2)}</p>
    `;

    // Add buttons based on order status
    // Add buttons based on order status
    if (order.status === 'Confirmed') {
        orderDiv.innerHTML += `
            <button id="refundButton">Refund Initiate</button>
            <button id="cancelButton">Cancel Order</button>
        `;
    } else if (order.status === 'Delivered') {
        orderDiv.innerHTML += `
            <button id="returnButton">Request Return</button>
        `;
    }

  
    // Display Google Maps iframe if address or landmark is provided
    if (order.landmark || order.address) {
        const iframe = document.createElement('iframe');
        iframe.width = '90%';
        iframe.height = '450';
        iframe.style.border = '0';
        iframe.loading = 'lazy';
        iframe.classList.add('iframeContainer');
        iframe.referrerpolicy = 'no-referrer-when-downgrade';
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('title', `Order #${order.orderId} Location`);

        let mapUrl = '';
        if (order.landmark) {
            const encodedAddress = encodeURIComponent(order.landmark);
            mapUrl = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;
        }

        iframe.src = mapUrl;
        mapContainer.appendChild(iframe); // Append iframe to mapContainer instead of ordersContainer
    }
    ordersContainer.appendChild(orderDiv);

    // Event listeners for buttons
    document.getElementById("refundButton").addEventListener("click", function() {
        requestRefund(order.orderId);
    });

    document.getElementById("cancelButton").addEventListener("click", function() {
        requestCancel(order.orderId);
    });

    document.getElementById("returnButton").addEventListener("click", function() {
        requestReturn(order.orderId);
    });

}

// Parse price from string to float
function parsePrice(priceStr) {
    if (typeof priceStr === 'string') {
        // Remove commas and non-numeric characters (except periods)
        priceStr = priceStr.replace(/[^0-9.]/g, '');
    }
    const parsedPrice = parseFloat(priceStr);
    console.log(`Parsed price from "${priceStr}" to ${parsedPrice}`);
    return parsedPrice;
}


// Placeholder function to handle refund request
function requestRefund(orderId) {
    let orders = [];
    try {
        const storedOrders = localStorage.getItem('orders');
        if (storedOrders) {
            orders = JSON.parse(storedOrders);
        }
    } catch (error) {
        console.error('Error retrieving orders:', error);
    }

    const order = orders.find(order => order.orderId === orderId);
    if (!order) {
        console.error(`Order with orderId ${orderId} not found.`);
        return;
    }

    const confirmation = confirm(`Request refund for order #${orderId}`);
    if (confirmation) {
        // Update order status to 'Refunded'
        order.status = 'Refunded';
        order.items.forEach(item => {
            item.itemSubstatus = 'cancelled';
        });
        // Update local storage with the new orders array
        localStorage.setItem('orders', JSON.stringify(orders));

        // Refresh the order details display
        displayOrderDetails();
    }
}

// Placeholder function to handle cancel request
function requestCancel(orderId) {
    let orders = [];
    try {
        const storedOrders = localStorage.getItem('orders');
        if (storedOrders) {
            orders = JSON.parse(storedOrders);
        }
    } catch (error) {
        console.error('Error retrieving orders:', error);
    }

    const order = orders.find(order => order.orderId === orderId);
    if (!order) {
        console.error(`Order with orderId ${orderId} not found.`);
        return;
    }

    const confirmation = confirm(`Request cancel for order #${orderId}`);
    if (confirmation) {
        // Update order status to 'Cancelled'
        order.status = 'Cancelled';
       // Update substatus of each item in the order to 'cancelled'
       order.items.forEach(item => {
        item.itemSubstatus = 'cancelled';
    });
        

        // Update local storage with the new orders array
        localStorage.setItem('orders', JSON.stringify(orders));

        // Refresh the order details display
        displayOrderDetails();
    }
}

// Placeholder function to handle return request
function requestReturn(orderId) {
    let orders = [];
    try {
        const storedOrders = localStorage.getItem('orders');
        if (storedOrders) {
            orders = JSON.parse(storedOrders);
        }
    } catch (error) {
        console.error('Error retrieving orders:', error);
    }

    const order = orders.find(order => order.orderId === orderId);
    if (!order) {
        console.error(`Order with orderId ${orderId} not found.`);
        return;
    }

    const confirmation = confirm(`Request return for order #${orderId}`);
    if (confirmation) {
        // Update order status to 'Returned'
        order.status = 'Returned';
        order.items.forEach(item => {
            item.itemSubstatus = 'cancelled';
        });
        // Update local storage with the new orders array
        localStorage.setItem('orders', JSON.stringify(orders));

        // Refresh the order details display
        displayOrderDetails();
    }
}


// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    displayOrderDetails();
});



// Function to handle navigation back to the orders page
document.getElementById("specialbtn").addEventListener("click", function() {
    window.location.href = "orders.html";
});
