document.addEventListener("DOMContentLoaded", function() {
    const selectedItemContainer = document.getElementById('selectedItemDetails');
    const wishlistItemsContainer = document.getElementById('wishlistItemsContainer'); // Assuming you have a container for wishlist items

    // Retrieve the product data from localStorage
    const selectedItem = JSON.parse(localStorage.getItem('selectedProductData')) || {};

    // Check if product is in favorites
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isFavorite = favorites.some(item => item.name === selectedItem.name);

    // Check if product is in cart
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const isInCart = cart.some(item => item.id === selectedItem.id);

    // Check if selectedItem is not empty and has the required properties
    if (selectedItem && selectedItem.name && selectedItem.image && selectedItem.mainprice && selectedItem.brand && selectedItem.mainCategoryName) {
        const productDataString = JSON.stringify(selectedItem, (key, value) => {
            // Escape single quotes in string values
            return typeof value === 'string' ? value.replace(/'/g, "&#39;") : value;
        });

        let productDetailsHTML = `
            <div class='productdetail'>
                <div class="productimage">
                    <img src="${selectedItem.image}" alt="${selectedItem.name}" class='productdetailImg'>
                </div>
                <div class='contentData'>
                <div class='wishList'>
                    <h2>${selectedItem.name}</h2>
                     <div data-product='${productDataString}' onclick="addToWishlist(event,this)" class="favoriteBtn">
                      <i class="${isFavorite ? 'fas' : 'far'} fa-heart"  title="${isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}"></i>
                    </div>
                </div>    
                    <p>${selectedItem.brand}</p>
                    ${selectedItem.description ?`<p>Description: ${selectedItem.description}</p>` : ''}
                    ${selectedItem.Shade ? `<p>Shade: ${selectedItem.Shade}</p>` : ''}
                    ${selectedItem.Capacity ? `<p>Capacity: ${selectedItem.Capacity}</p>` : ''}
                     ${selectedItem.features ?`<p>Features: ${selectedItem.features}</p>`: ''}
                    `;
                   
        // Conditionally display sizes if available
        // if (selectedItem.size && selectedItem.size.length > 0) {
        //     productDetailsHTML += `<p> Select Sizes:</p>`;
        //     selectedItem.size.forEach(size => {
        //         productDetailsHTML += `
        //             <label>
        //                 <input type="radio" name="size" value="${size}">
        //                 <span class="custom-radio" data-size="${size}">${size}</span>
        //             </label>
        //         `;
        //     });
        // }
        // if (selectedItem['size(UK)'] && selectedItem['size(UK)'].length > 0) {
        //     productDetailsHTML +=` <p> Select Sizes(UK):</p>`;
        //     selectedItem['size(UK)'].forEach(size => {
        //         productDetailsHTML += `
        //             <label class='checkUKSize'>
        //                 <input type="radio" name="size" value="${size}">
        //                 <span class="custom-Check" data-size="${size}">${size}</span>
        //             </label>
        //         `;
        //     });
        // }
        if (selectedItem.size && selectedItem.size.length > 0) {
            productDetailsHTML += `<p>Select Sizes:</p>`;
            selectedItem.size.forEach((size, index) => {
                productDetailsHTML += `
                    <label>
                        <input type="radio" name="size" value="${size}" ${index === 0 ? 'checked' : ''}>
                        <span class="custom-radio" data-size="${size}">${size}</span>
                    </label>
                `;
            });
        }
        if (selectedItem['size(UK)'] && selectedItem['size(UK)'].length > 0) {
            productDetailsHTML += `<p>Select Sizes(UK):</p>`;
            selectedItem['size(UK)'].forEach((size, index) => {
                productDetailsHTML += `
                    <label class="checkUKSize">
                        <input type="radio" name="size" value="${size}" ${index === 0 ? 'checked' : ''}>
                         <span class="custom-radio" data-size="${size}">${size}</span>
                    </label>
                `;
            });
        }
        // Add the rest of the product details HTML
        productDetailsHTML += `
                    <p class="prices"> &#8377;${selectedItem.mainprice}</p>  
                    <p class="discount">  ${selectedItem.discount}</p>
                    <p class="dummyprices"> M.R.P.:&#8377;${selectedItem.dummyprice}</p>
                    
                    <div class='btnContainer'>   
                        <button type='button'  text-align:"center" class='addCart' data-product='${productDataString}' onclick="addToCart(this)">${isInCart ? 'Go to Cart' : 'Add to Cart'}</button><br> <br>
                        <button class="buyButton"  tect-align:"center" data-product='${productDataString}' onclick="buyNow(this)">Buy Now</button>
                       
                    </div>
                </div>
            </div>
        `;

        // Set the innerHTML of the selectedItemContainer
        selectedItemContainer.innerHTML = productDetailsHTML;
    } else {
        selectedItemContainer.innerHTML = "<p>No product details found.</p>";
    }

    // // Render wishlist items
    // function renderWishlist() {
    //     wishlistItemsContainer.innerHTML = ''; // Clear previous items
    //     const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    //     favorites.forEach(product => {
    //         const wishlistItemDiv = createWishlistItem(product);
    //         wishlistItemsContainer.appendChild(wishlistItemDiv);
    //     });
    // }

    // renderWishlist();

    // Function to add/remove from wishlist
    window.addToWishlist = function(event,element) {
        event.stopPropagation();
        const productData = JSON.parse(element.getAttribute('data-product'));
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const isFavorite = favorites.some(item => item.name === productData.name);

        if (isFavorite) {
            // Remove from favorites
            const updatedFavorites = favorites.filter(item => item.name !== productData.name);
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            element.querySelector('i').classList.remove('fas');
            element.querySelector('i').classList.add('far');
        } else {
            // Add to favorites
            favorites.push(productData);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            element.querySelector('i').classList.remove('far');
            element.querySelector('i').classList.add('fas');
        }

    };

   

    // // Function to remove item from wishlist
    // window.removeFromWishlist = function(element) {
    //     const productData = JSON.parse(element.getAttribute('data-product'));
    //     let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    //     // Remove from favorites
    //     favorites = favorites.filter(item => item.name !== productData.name);

    //     localStorage.setItem('favorites', JSON.stringify(favorites));

    //     // Update UI
    //     renderWishlist();
    // };

    // Function to handle "Buy Now" button click
    window.buyNow = function(buttonElement) {
        // Get the product data from the button's data attribute
        const productData = JSON.parse(buttonElement.getAttribute('data-product'));

        // Log the product data to inspect
        console.log("Product Data:", productData);

        // Check if the product data contains the category information
        if (!productData || !productData.mainCategoryName) {
            console.error("Product data or category is missing.");
            return;
        }

        // Define the fashion subcategories that require size selection
        const fashionSubcategories = ['mens', 'womens', 'children', 'fashion', 'footwear', 'menfootwear', 'womenfootwear', 'boysfootwear', 'girlsfootwear'];

        // Check if the product belongs to the fashion category
        if (fashionSubcategories.includes(productData.mainCategoryName.toLowerCase())) {
            // Get the selected sizes
            const selectedSizes = Array.from(document.querySelectorAll('input[name="size"]:checked')).map(el => el.value);

            // Check if any size is selected
            if (selectedSizes.length === 0) {
                alert("Please select at least one size.");
                return;
            }

            // Add the selected sizes to the product data
            productData.selectedSizes = selectedSizes;
        }

        // Store the updated product data in localStorage for the checkout process
        localStorage.setItem('buyingItem', JSON.stringify(productData));

        // Redirect to the checkout page
        window.location.href = 'checkout.html';

        console.log("Buy Now clicked for product:", productData);
    };
});