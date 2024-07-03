function displayOrders() {
    const ordersContainer = document.getElementById('orderDetails');
    const filterValue = document.getElementById('orderFilter').value;
    ordersContainer.innerHTML = '';

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

    // Check if orders is an array
    if (!Array.isArray(orders)) {
        console.error('Orders is not an array:', orders);
        return;
    }

    // Filter orders based on the selected value
    const filteredOrders = orders.filter(order => {
        switch (filterValue) {
            case 'confirmed':
                return order.status.toLowerCase() === 'confirmed';
            case 'cancelled':
                return order.status.toLowerCase() === 'cancelled';
            case 'refunded':
                return order.status.toLowerCase() === 'refunded';
            case 'all':
            default:
                return true;
        }
    });

    // Check if there are any orders
    if (filteredOrders.length === 0) {
        ordersContainer.innerHTML = '<p class="noData">No orders found.</p>';
        return;
    }

    filteredOrders.forEach((order, orderIndex) => {
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
       
        // Display order ID and other details
        orderDiv.innerHTML = `<h1 style="margin-bottom:5px;" class="${statusClass}"> ${order.status}</h1>
                              <p style="margin-bottom:5px;"><strong>Order-Id:</strong>${order.orderId}</p>
                              <p style="margin-bottom:5px;"><strong>Full Name:</strong> ${order.fullName}</p>
                              <p style="margin-bottom:5px;"><strong>Phone:</strong> ${order.phone}</p>
                              <p style="margin-bottom:5px;" class='address'><strong>Address:</strong> ${order.address},${order.landmark}, ${order.city}, ${order.state}, ${order.pincode}</p>
                              <p style="margin-bottom:5px;"><strong>Order Date:</strong> ${order.orderDate}</p>`;

        // Display items in the order
        order.items.forEach((item, itemIndex) => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('order-item');

            const totalPrice = parsePrice(item.mainprice) * item.count;
            // Render cancel button based on itemSubstatus
               
            itemDiv.innerHTML = `
                <div class="item-details">
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-info">
                        <p class="item-name"><strong>Name:</strong> ${item.name}</p>
                        <p class="item-quantity"><strong>Quantity:</strong> ${item.count}</p>
                        <p class="item-price"><strong>Total:</strong> ₹ ${totalPrice.toFixed(2)}</p>
                        ${ item.itemSubstatus === 'cancelled'
                            ? ` <p class="item-price"><strong>Status:</strong>Cancelled</p>`
                            : `<p class="item-price"><button class="deleteItemBtn" onclick="cancelOrderItem('${order.orderId}', '${item.id}', this)">Cancel Item</button></p>`}

                    </div>
                </div>`;
            orderDiv.appendChild(itemDiv);
        });

        const viewButtonHTML = `
            <button class="viewOrderBtn" onclick="viewOrderDetails('${order.orderId}')">
                View Order Details
            </button>`;

        orderDiv.innerHTML += viewButtonHTML;
        ordersContainer.appendChild(orderDiv);
    });
}

document.getElementById("orderbtn").addEventListener("click", function() {
    window.location.href = "homepage.html";
});

function parsePrice(priceStr) {
    if (typeof priceStr === 'string') {
        // Remove commas and non-numeric characters (except periods)
        priceStr = priceStr.replace(/[^0-9.]/g, '');
    }
    const parsedPrice = parseFloat(priceStr);
    console.log(`Parsed price from "${priceStr}" to ${parsedPrice}`);
    return parsedPrice;
}

function viewOrderDetails(orderId) {
    // Find the index of the order in local storage based on orderId
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const selectedOrderIndex = orders.findIndex(order => order.orderId === orderId);

    if (selectedOrderIndex !== -1) {
        localStorage.setItem("selectedOrderIndex", selectedOrderIndex); // Save the order index
        window.location.href = "orderDetailsPage.html"; // Redirect to the details page
    } else {
        console.error(`Order with orderId ${orderId} not found.`);
    }
}

function cancelOrderItem(orderId, itemId) {
    // Retrieve orders from local storage
    let orders = JSON.parse(localStorage.getItem('orders')) || [];

    // Find the order based on orderId
    const orderIndex = orders.findIndex(order => order.orderId === orderId);

    if (orderIndex !== -1) {
      

        // Convert itemId to string if it's not already
        itemId = String(itemId);

        // Find the item based on itemId within the order's items array
        const itemIndex = orders[orderIndex].items.findIndex(item => String(item.id) === itemId);

        if (itemIndex !== -1) {
            // Update the item's substatus to "cancelled"
            orders[orderIndex].items[itemIndex].itemSubstatus = "cancelled";

            // Check if all items in the order are cancelled
            const allItemsCancelled = orders[orderIndex].items.every(item => item.itemSubstatus === "cancelled");

            // If all items are cancelled, update order status to "Cancelled"
            if (allItemsCancelled) {
                orders[orderIndex].status = "Cancelled";
            }

            // Save the updated orders back to local storage
            localStorage.setItem('orders', JSON.stringify(orders));

            // Update the UI
            displayOrders();

            console.log(`Item with itemId ${itemId} in order with orderId ${orderId} cancelled successfully.`);
        } else {
            console.error(`Item with id ${itemId} not found in order items array.`);
        }
    } else {
        console.error(`Order with id ${orderId} not found.`);
    }
}







document.addEventListener("DOMContentLoaded", function() {
    displayOrders();
    document.getElementById('orderFilter').addEventListener('change', displayOrders);
});
