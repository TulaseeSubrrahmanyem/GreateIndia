document.addEventListener("DOMContentLoaded", function() {
    const wishlistItemsContainer = document.getElementById("wishlistItems");

    // Function to create wishlist item HTML
    function createWishlistItem(product) {
        const productData = { ...product }; 
        const productDataString = JSON.stringify(productData, (key, value) => {
            // Escape single quotes in string values
            return typeof value === 'string' ? value.replace(/'/g, "&#39;") : value;
        });
        const truncatedName = product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name;
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const isInCart = cart.some(item => item.id === product.id);

         // Get the current date
         const currentDate = new Date();
         const month = currentDate.toLocaleString('default', { month: 'long' });
         const day = currentDate.getDate();
         const year = currentDate.getFullYear();
         const dateString = `${month} ${day}, ${year}`;
        
         let selectedSize = '';
         if (product.size && product.size.length > 0) {
             selectedSize = product.size[0]; // Default to first size if available
         } else if (product['size(UK)'] && product['size(UK)'].length > 0) {
             selectedSize = product['size(UK)'][0]; // Default to first UK size if available
         }
         const wishlistItemRow = document.createElement('tr');
         wishlistItemRow.innerHTML = `
             <td class="nameImgClass" >
                 <div class="imgAndNameContainer">
                     <div id='imgContainer' data-product='${productDataString}' onclick="viewItemDetails(this)">
                         <img src="${product.image}" alt="${product.name}" class="wishlist-item-img">
                     </div>
                     <div class="name">${truncatedName}</div>  
                 </div>
                 
             </td>
             <td class="priceRow" >
                 <div class="priceClass">
                   <div class="dummyprices">₹${product.dummyprice}</div>
                 <div class="mainprice"> ₹${product.mainprice}</div> 
                 </div>
                 
             </td>
             <td class="brandClass">
                  <div> ${product.brand || 'Not specified'}</div>
             </td>
       
             <td class="addButtonClass">
                 <div class="wishListBtns">
                     <div class='date'>Added on:${dateString}</div>
                     <button type='button' class='addCart' data-product='${productDataString}' data-size="${selectedSize}" onclick="addToCart(this)">
                         ${isInCart ? 'Go to Cart' : 'Add to Cart'}
                     </button>
                 </div>
             </td>
             <td class="removeBtnClass">
              
                      <button class="remove-btn" data-product='${productDataString}'><i class="fas fa-trash-alt dleteIcon"></i></button>              
             </td>
         `;
         
         // Attach event listener to the "Remove from Wishlist" button
         const removeButton = wishlistItemRow.querySelector('.remove-btn');
         removeButton.addEventListener('click', function() {
             removeFromWishlist(removeButton);
         });
 
         return wishlistItemRow;
     }
 
    // View item details function
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
    };

    // Function to render wishlist items
    function renderWishlist() {
        wishlistItemsContainer.innerHTML = ''; // Clear previous items

        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        if (favorites.length === 0) {
            wishlistItemsContainer.innerHTML = '<p>No items in wishlist</p>';
        } else {
            favorites.forEach(product => {
                const wishlistItemDiv = createWishlistItem(product);
                wishlistItemsContainer.appendChild(wishlistItemDiv);
            });
        }
    }

    // Function to remove item from wishlist
    window.removeFromWishlist = function(element) {
        const productData = JSON.parse(element.getAttribute('data-product'));
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        // Remove from favorites
        favorites = favorites.filter(item => item.id !== productData.id);

        localStorage.setItem('favorites', JSON.stringify(favorites));

        // Update UI
        renderWishlist();
    };

   
    // Initial render of wishlist
    renderWishlist();
});
