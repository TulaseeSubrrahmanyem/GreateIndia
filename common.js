// Function to update the cart count in navigation items
function updateCartCount() {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElement = document.getElementById('cartItemCount');
    if (cartCountElement) {
        cartCountElement.innerText = cartItems.length.toString();
    }
}

function addToCart(button) {
    try {
        button.disabled = true;

        if (button && button.dataset) {
            const productData = JSON.parse(button.dataset.product);
            let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
            console.log("Product Data:", productData.subcategorie);
           
            
            // Check if productData is valid and has mainCategoryName
            if (!productData || !productData.mainCategoryName ) {
                console.error("Product data or mainCategoryName sub category is missing.");
                return;
            }

            const selectedSize = button.dataset.size;
            const fashionSubcategories = ['mens', 'womens', 'children', 'fashion', 'footwear', 'menfootwear', 'womenfootwear', 'boysfootwear', 'girlsfootwear'];
            // Check if the product belongs to the fashion category
            // if (fashionSubcategories.includes(productData.mainCategoryName.toLowerCase())) {
            //     // Get the selected sizes
            //    let selectedSizes = Array.from(document.querySelectorAll('input[name="size"]:checked')).map(el => el.value);
              
            //     // // Check if any size is selected
            //     // if (selectedSizes.length === 0) {
                  
            //     //     alert("Please select at least one size.");
            //     //     return;
            //     // }

            //     // Add the selected sizes to the product data
            //     //productData.selectedSizes = selectedSizes;
               
            //      productData.selectedSizes = selectedSizes || selectedSize;
            //     // Add selected sizes to the product data if any selected
               
            // }
            const selectedSizes = Array.from(document.querySelectorAll('input[name="size"]:checked')).map(el => el.value);

            // If no size is selected from user input, use default selected size
            productData.selectedSizes = selectedSizes.length > 0 ? selectedSizes : [selectedSize];
            // Set the category name in the product data
            productData.subcategoryName = productData.subcategorie;
            console.log(productData)
            // Ensure ID is compared as a string
            const productId = String(productData.id);

            // Check if the product with the same ID is already in the cart
            const isInCart = cartItems.some(item => String(item.id) === productId);

            if (isInCart) {
                // alert("Product is already in the cart.");
                console.log("Product with this ID is already in the cart:", productData);

                // Change button text and add event listener to go to cart
                button.textContent = 'Go to Cart';
                button.removeEventListener('click', addToCart); // Remove existing event listener
                button.addEventListener('click', () => window.location.href = 'cart.html'); // Add new event listener
                return;
            } else {
                if (cartItems.length >= 10) {
                    alert("You cannot add more than 10 items to the cart.");
                    console.log("Cart limit of 10 items reached.");
                    return;
                }
                cartItems.push(productData);
                localStorage.setItem('cart', JSON.stringify(cartItems));
                updateCartCount();
                console.log("Product added to cart:", productData);
                // alert("Product added to cart.");
            }

            // Change button text and add event listener to go to cart
            button.textContent = 'Go to Cart';
            button.removeEventListener('click', addToCart); // Remove existing event listener
            button.addEventListener('click', () => window.location.href = 'cart.html'); // Add new event listener
        } else {
            console.error("Button is undefined or does not have dataset attribute:", button);
        }
    } catch (error) {
        console.error("Error adding product to cart:", error);
    } finally {
        // Re-enable the button after processing
        button.disabled = false;
    }
}


// function addToCart(button) {
//     try {
//         button.disabled = true;

//         if (button && button.dataset) {
//             const productData = JSON.parse(button.dataset.product);
//             let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

//             // Check if productData is valid and has mainCategoryName
//             if (!productData || !productData.mainCategoryName) {
//                 console.error("Product data or mainCategoryName is missing.");
//                 return;
//             }

//             // Determine the selected size(s) from user input
//             const selectedSizeInputs = Array.from(document.querySelectorAll('input[name="size"]:checked'));
//             const selectedSizes = selectedSizeInputs.map(input => input.value);

//             // If no size is selected from user input, use default selected size
//             const selectedSize = selectedSizeInputs.length > 0 ? selectedSizes[0] : button.dataset.size;

//             // Update the product data with selected size(s)
//             productData.selectedSizes = selectedSizes.length > 0 ? selectedSizes : [selectedSize];

//             // Set the subcategory name in the product data
//             productData.subcategoryName = productData.subcategorie;

//             // Convert ID to string for comparison
//             const productId = String(productData.id);

//             // Check if the product with the same ID is already in the cart
//             const existingIndex = cartItems.findIndex(item => String(item.id) === productId);

//             if (existingIndex !== -1) {
//                 // Product with the same ID is already in the cart
//                 const existingItem = cartItems[existingIndex];

//                 // Check if the selected sizes are different from the existing item
//                 if (!arraysEqual(existingItem.selectedSizes, productData.selectedSizes)) {
//                     // Update the size in the existing cart item
//                     existingItem.selectedSizes = productData.selectedSizes;
//                     cartItems[existingIndex] = existingItem;
//                     localStorage.setItem('cart', JSON.stringify(cartItems));
//                     console.log("Size updated in cart for product:", productData);
//                     alert("Size updated in cart for the product.");
//                 } else {
//                     console.log("Product with this ID is already in the cart:", productData);
//                    // alert("Product with this ID is already in the cart.");
//                 }

//                 // Change button text and add event listener to go to cart
//                 button.textContent = 'Go to Cart';
//                 button.removeEventListener('click', addToCart); // Remove existing event listener
//                 button.addEventListener('click', () => window.location.href = 'cart.html'); // Add new event listener
//                 return;
//             } else {
//                 // Product is not in the cart, add it
//                 if (cartItems.length >= 10) {
//                     alert("You cannot add more than 10 items to the cart.");
//                     console.log("Cart limit of 10 items reached.");
//                     return;
//                 }
//                 cartItems.push(productData);
//                 localStorage.setItem('cart', JSON.stringify(cartItems));
//                 updateCartCount();
//                 console.log("Product added to cart:", productData);
//                 alert("Product added to cart.");
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
// }

// // Helper function to compare arrays
// function arraysEqual(arr1, arr2) {
//     if (arr1.length !== arr2.length) return false;
//     for (let i = 0; i < arr1.length; i++) {
//         if (arr1[i] !== arr2[i]) return false;
//     }
//     return true;
// }



function CategoryProducts(category) {
    window.location.href = 'productsList.html?category=' + encodeURIComponent(category);
 
}

function searchItems() {
    const searchIcon = document.getElementById("searchIcon");
    const searchInput = document.getElementById("searchInput");

    const performSearch = () => {
        const searchText = searchInput.value.trim().toLowerCase();

        if (searchText === '') {
            console.error('Search text cannot be empty');
            return;
        }

        // Encode the search text for passing it as a query parameter
        const encodedSearchText = encodeURIComponent(searchText);
        console.log(encodedSearchText);

        // Navigate to the productsList.html page with the search query parameter
        window.location.href = `productsList.html?search=${encodedSearchText}`;
    };

    if (searchIcon) {
        searchIcon.addEventListener("click", function(event) {
            event.preventDefault(); // Prevent default behavior of the button click
            performSearch();
        });
    } else {
        console.error('searchIcon element not found');
    }

    if (searchInput) {
        searchInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                event.preventDefault(); // Prevent default behavior of the Enter key press
                performSearch();
            }
        });
    } else {
        console.error('searchInput element not found');
    }
}

    document.addEventListener("DOMContentLoaded", function() {

        // document.body.addEventListener("click", function(event) {
        //     if (event.target && event.target.classList.contains("addCartButton")) {
        //         event.preventDefault();
        //         addToCart(event.target);
        //     }
        // });
        // addToCart(button)
        // Update cart count and search functionality on DOMContentLoaded
        updateCartCount(); // Update cart count initially
        searchItems(); // Initialize search functionality
    
    });
    
   
    document.addEventListener("DOMContentLoaded", function() {
        const toggleFilterBtn = document.getElementById("toggleFilterBtn");
        const closeFilterBtn = document.getElementById("closeFilterBtn");
        const filterOptions = document.querySelector(".filterOptions");
        const mainContent = document.querySelector('.pageContainer');
        // Toggle filter options visibility
        toggleFilterBtn.addEventListener("click", function() {
            filterOptions.classList.toggle("active");
            mainContent.classList.add('blur');
            document.body.classList.add('no-scroll');
            // toggleFilterBtn.classList.toggle("active");
        });
    
        // Close filter options when close button is clicked
        closeFilterBtn.addEventListener("click", function() {
            filterOptions.classList.remove("active");
            mainContent.classList.remove('blur');
            document.body.classList.remove('no-scroll');
            // toggleFilterBtn.classList.remove("active");
        });
        
    });