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
              
                    <button class="remove-btn" data-product='${productDataString}'  onclick="deletewhislistItem(this)"><i class="fas fa-trash-alt dleteIcon"></i></button>              
             </td>
             <td class="specialAddDel">
                <div class="wishListBtns">
                     <div class='date'>Added on:${dateString}</div>
                     <div class="subwishListBtns">
                         
                           <button type='button' class='addCart' data-product='${productDataString}' data-size="${selectedSize}" onclick="addToCart(this)">
                            ${isInCart ? 'Go to Cart' : 'Add to Cart'}
                           </button>
                        
                          <button class="remove-btn" data-product='${productDataString}' onclick="deletewhislistItem(this)"><i class="fas fa-trash-alt dleteIcon"></i></button>              
                        
                     </div>
                     
                 </div>
             </td>
            
         `;
         
         // Attach event listener to the "Remove from Wishlist" button
        //  const removeButton = wishlistItemRow.querySelector('.remove-btn');
        //  removeButton.addEventListener('click', function() {
        //      console.log("item called")
        //      removeFromWishlist(removeButton);
        //  });
         window.deletewhislistItem=function(value){
            removeFromWishlist(value);
         }

 
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

    // Function to add item to cart
    // window.addToCart = function(button) {
    //     try {
    //         button.disabled = true;
    
    //         if (button && button.dataset) {
    //             const productData = JSON.parse(button.dataset.product);
    //             let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    //             console.log("Product Data:", productData.subcategorie);
               
                
    //             // Check if productData is valid and has mainCategoryName
    //             if (!productData || !productData.mainCategoryName ) {
    //                 console.error("Product data or mainCategoryName sub category is missing.");
    //                 return;
    //             }
    
    //             const selectedSize = button.dataset.size;
    //             const fashionSubcategories = ['mens', 'womens', 'children', 'fashion', 'footwear', 'menfootwear', 'womenfootwear', 'boysfootwear', 'girlsfootwear'];
    //             // Check if the product belongs to the fashion category
    //             // if (fashionSubcategories.includes(productData.mainCategoryName.toLowerCase())) {
    //             //     // Get the selected sizes
    //             //    let selectedSizes = Array.from(document.querySelectorAll('input[name="size"]:checked')).map(el => el.value);
                  
    //             //     // // Check if any size is selected
    //             //     // if (selectedSizes.length === 0) {
                      
    //             //     //     alert("Please select at least one size.");
    //             //     //     return;
    //             //     // }
    
    //             //     // Add the selected sizes to the product data
    //             //     //productData.selectedSizes = selectedSizes;
                   
    //             //      productData.selectedSizes = selectedSizes || selectedSize;
    //             //     // Add selected sizes to the product data if any selected
                   
    //             // }
    //             const selectedSizes = Array.from(document.querySelectorAll('input[name="size"]:checked')).map(el => el.value);
    
    //             // If no size is selected from user input, use default selected size
    //             productData.selectedSizes = selectedSizes.length > 0 ? selectedSizes : [selectedSize];
    //             // Set the category name in the product data
    //             productData.subcategoryName = productData.subcategorie;
    //             console.log(productData)
    //             // Ensure ID is compared as a string
    //             const productId = String(productData.id);
    
    //             // Check if the product with the same ID is already in the cart
    //             const isInCart = cartItems.some(item => String(item.id) === productId);
    
    //             if (isInCart) {
    //                 // alert("Product is already in the cart.");
    //                 console.log("Product with this ID is already in the cart:", productData);
    
    //                 // Change button text and add event listener to go to cart
    //                 button.textContent = 'Go to Cart';
    //                 button.removeEventListener('click', addToCart); // Remove existing event listener
    //                 button.addEventListener('click', () => window.location.href = 'cart.html'); // Add new event listener
    //                 return;
    //             } else {
    //                 if (cartItems.length >= 10) {
    //                     alert("You cannot add more than 10 items to the cart.");
    //                     console.log("Cart limit of 10 items reached.");
    //                     return;
    //                 }
    //                 cartItems.push(productData);
    //                 localStorage.setItem('cart', JSON.stringify(cartItems));
                   
    //                 console.log("Product added to cart:", productData);
    //                 // alert("Product added to cart.");
    //             }
    
    //             // Change button text and add event listener to go to cart
    //             button.textContent = 'Go to Cart';
    //             button.removeEventListener('click', addToCart); // Remove existing event listener
    //             button.addEventListener('click', () => window.location.href = 'cart.html'); // Add new event listener
    //         } else {
    //             console.error("Button is undefined or does not have dataset attribute:", button);
    //         }
    //     } catch (error) {
    //         console.error("Error adding product to cart:", error);
    //     } finally {
    //         // Re-enable the button after processing
    //         button.disabled = false;
    //     }
    // };

    // Initial render of wishlist
    renderWishlist();
});
