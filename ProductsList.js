document.addEventListener("DOMContentLoaded", function() {
    let category = ''; // Global variable to store current category
    let searchText = ''; // Global variable to store search text
   
    
    // Fetch products from the API
    async function fetchProducts() {
        try {
            const response = await fetch("https://api.npoint.io/27833b79d75e587b7b52");
            return await response.json();
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    // Load products for a specific category or filter by search text
    async function loadCategoryProducts(categoryName, searchQuery = '') {
        console.log("Loading products for category:", categoryName, "with search query:", searchQuery);
        try {
            const loadingMessage = document.createElement("div");
            loadingMessage.innerHTML = `  
            <div class="loading">
                <div class="loading-text">
                    <span class="loading-text-words">L</span>
                    <span class="loading-text-words">O</span>
                    <span class="loading-text-words">A</span>
                    <span class="loading-text-words">D</span>
                    <span class="loading-text-words">I</span>
                    <span class="loading-text-words">N</span>
                    <span class="loading-text-words">G</span>
                </div>
            </div>`;
            const productsContainer = document.getElementById("productsList");
            productsContainer.innerHTML = ''; // Clear previous products
            productsContainer.appendChild(loadingMessage);

            const productData = await fetchProducts(); // Fetch product data

            // Remove loading indicator
            productsContainer.removeChild(loadingMessage);
            // Flag to track if any products are found
            let productsFound = false;

            // Iterate over the main products array
            productData.products.forEach(mainCategory => {
                const mainCategoryName = mainCategory.maincategory.trim().toLowerCase();
                const categoryNameLower = categoryName.trim().toLowerCase();

                if (mainCategoryName === categoryNameLower || searchQuery) {
                  
                    mainCategory.categories.forEach(category => {
                        const subcategorie=category.category
                        console.log("Subcategory",subcategorie)
                        category.items.forEach(item => {

                                if (
                                    mainCategoryName === categoryNameLower ||
                                    (searchQuery && item.search && Array.isArray(item.search) && item.search.some(keyword => keyword.toLowerCase() === searchQuery.toLowerCase())) ||
                                    (searchQuery && item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase()))
                                ) {
                                createProductDiv(item, mainCategory.maincategory, subcategorie);
                                productsFound = true;
                            }
                        });
                    });
                } else {
                    mainCategory.categories.forEach(category => {
                        // const subCategoryName = category.category.trim().toLowerCase();
                        // if (subCategoryName === categoryNameLower || (searchQuery && item.name.toLowerCase().includes(searchQuery.toLowerCase()))) {
                        //     category.items.forEach(item => {
                        //         createProductDiv(item, mainCategory.maincategory);
                        //         productsFound = true;
                        //     });
                        // }
                        const subcategorie=category.category
                        console.log("Subcategory",subcategorie)
                        if (category.category.trim().toLowerCase() === categoryNameLower || searchQuery) {
                            category.items.forEach(item => {
                                createProductDiv(item, mainCategory.maincategory, subcategorie);
                                productsFound = true;
                            });
                        }
                    });
                }
            });

            // Show "No Data Available" message if no products are found
            if (!productsFound) {
                const noDataMessage = document.createElement("p");
                noDataMessage.textContent = "No products found matching the criteria.";
                productsContainer.appendChild(noDataMessage);
            }
           
            // Update the global category variable
            category = categoryName;
        } catch (error) {
            console.error('Error fetching or processing products:', error);
        }
    }

    // Create product HTML div
function createProductDiv(product, mainCategoryName, subcategorie) {
    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };
    
    
    const productsContainer = document.getElementById("productsList");
    const productData = { ...product, mainCategoryName, subcategorie }; // Combine product data and mainCategoryName
    const productDiv = document.createElement('div');
    productDiv.classList.add('itemsContainer');
    const productDataString = JSON.stringify(productData, (key, value) => {
        // Escape single quotes in string values
        return typeof value === 'string' ? value.replace(/'/g, "&#39;") : value;
    });

    const truncatedName = truncateText(product.name, 15);

    // Check if product is in favorites
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isFavorite = favorites.some(item => item.id === product.id);

    // Check if product is in cart
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const isInCart = cart.some(item => item.id === product.id);

    let selectedSize = '';
    // if (product.size && product.size.length > 0) {
    //     selectedSize = product.size[0]; // Default to first size if available
    //     console.log(selectedSize)
    // } else if (product['size(UK)'] && product['size(UK)'].length > 0) {
    //     selectedSize = product['size(UK)'][0]; // Default to first UK size if available
    // }

    productDiv.innerHTML = `
    
    <div class='itemsDetails' >
    <div data-product='${productDataString}' onclick="viewItemDetails(this)">
    <div id='imgContiner'>
        <img src="${product.image}" alt="${product.name}" class="itemImg">
    </div>
    <div class='itemMatter'>
        <div class="wishList">
            <h3>${truncatedName}</h3>
            <div data-product='${productDataString}' onclick="addToWishlist(event,this)" class="favoriteBtn">
                <i class="${isFavorite ? 'fas' : 'far'} fa-heart"  title="${isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}"></i>
            </div>
        </div>
        ${product.brand ? `<p>Brand: ${product.brand}</p>` : ''}
        ${product.quantity ? `<p>Quantity: ${product.quantity}</p>` : ''}
        ${product.rating ? `<p class='rating'> ${product.ratingstars}</p>` : ''}
        <div class='priceCart'>
            <div class="prices">
                <p class="mainprice">&#8377; ${product.mainprice}</p>
                ${product.discount ? `<p class="discount">${product.discount}</p>` : ''}
            </div>           
        </div>
        </div>
    </div>
    </div>
     <div class='priceCartBtn'>
         <button type='button' class='addCart' data-product='${productDataString}'  data-size="${selectedSize}" onclick="addToCart(this)">${isInCart ? 'Go to Cart' : 'Add to Cart'}</button>
    </div>
</div>

    `;

    productsContainer.appendChild(productDiv);
}

    
    // <div data-product='${productDataString}' onclick="addToWishlist(this)" class="favoriteBtn">
    //                      <i class="far fa-heart"  title="Add to Wishlist"></i>
    //                  </div>

    window.addToWishlist= function (event,element) {
        // Prevent the click event from propagating to parent elements
           event.stopPropagation();
           const productData = JSON.parse(element.getAttribute('data-product'));
           const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
       
           const isFavorite = favorites.some(item => item.id === productData.id);
       
           if (isFavorite) {
               // Remove from favorites
               favorites.splice(favorites.findIndex(item => item.id === productData.id), 1);
               element.querySelector('i').classList.remove('fas');
               element.querySelector('i').classList.add('far');
           } else {
               // Add to favorites
               favorites.push(productData);
               element.querySelector('i').classList.remove('far');
               element.querySelector('i').classList.add('fas');
           }
       
           localStorage.setItem('favorites', JSON.stringify(favorites));
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
    }

    // Filter products function
    async function filterProducts(filterValue, filterType, categoryName, searchQuery = '') {
        console.log("Filtering products with:", filterValue, filterType, categoryName, "and search query:", searchQuery);

        try {
            // Show loading indicator (e.g., spinner or message)
            const loadingMessage = document.createElement("p");
            loadingMessage.textContent = "Filtering products...";
            const productsContainer = document.getElementById("productsList");
            productsContainer.innerHTML = ''; // Clear previous products
            productsContainer.appendChild(loadingMessage);

            const productData = await fetchProducts(); // Fetch product data

            // Remove loading indicator
            productsContainer.removeChild(loadingMessage);

            let productsFound = false; // Flag to track if any products are found

            // Iterate over the main products array
            productData.products.forEach(mainCategory => {
                const mainCategoryName = mainCategory.maincategory.trim().toLowerCase();
                const categoryNameLower = categoryName.trim().toLowerCase();

                if (mainCategoryName === categoryNameLower || searchQuery) {
                    mainCategory.categories.forEach(category => {
                        category.items.forEach(item => {
                            if ((mainCategoryName === categoryNameLower ||(searchQuery && item.search && Array.isArray(item.search) && item.search.some(keyword => keyword.toLowerCase() === searchQuery.toLowerCase()))) &&
                                ((filterType === 'brand' && item.brand && item.brand.toLowerCase().includes(filterValue.toLowerCase())) ||
                                    (filterType === 'rating' && item.rating && parseInt(item.rating) === parseInt(filterValue)))) {
                                createProductDiv(item, mainCategory.maincategory);
                                productsFound = true;
                            }
                        });
                    });
                } else {
                    mainCategory.categories.forEach(subCategory => {
                        if (subCategory.category.trim().toLowerCase() === categoryNameLower || searchQuery) {
                            subCategory.items.forEach(item => {
                                if ((filterType === 'brand' && item.brand && item.brand.toLowerCase().includes(filterValue.toLowerCase())) ||
                                    (filterType === 'rating' && item.rating && parseInt(item.rating) === parseInt(filterValue))) {
                                    createProductDiv(item, mainCategory.maincategory);
                                    productsFound = true;
                                }
                            });
                        }
                    });
                }
            });

            // Show "No Data Available" message if no products are found
            if (!productsFound) {
                const noDataMessage = document.createElement("p");
                noDataMessage.textContent = "No products found matching the filter criteria.";
                productsContainer.appendChild(noDataMessage);
            }
        } catch (error) {
            console.error('Error filtering products:', error);
        }
    }

// Define the function to handle the filter search
function handleFilterSearch() {
    const searchInput = document.getElementById('filterSearchInput').value.trim(); // Trim input
    if (searchInput) {
        console.log("Search Input:", searchInput);
        filterProducts(searchInput, 'brand', category, searchText);
    } else {
        // Handle empty search input if needed
        searchText = ''; // Clear searchText if search input is empty
        filterProducts(category, searchText);
        console.log('Empty search input');
    }
}

// Event listener for brand filter search icon click
document.getElementById('filterSearchIcon').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default behavior of anchor tag
    handleFilterSearch();
});

// Event listener for Enter key press in the filter search input
document.getElementById('filterSearchInput').addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent default behavior of the Enter key press
        handleFilterSearch();
    }
});


    // Event listener for rating filter
    document.querySelectorAll('.ratingBasedFilter ul li').forEach(function(ratingLi) {
        ratingLi.addEventListener('click', function() {
            const rating = this.className.replace('rating', '').trim();
            console.log("Rating:", rating);
            filterProducts(rating, 'rating', category, searchText);
        });
    });

    // // Event listener for category filters (replace this with your actual category handling logic)
    // document.querySelectorAll('#categoryList li').forEach(function(categoryItem) {
    //     categoryItem.addEventListener('click', function(event) {
          
         
    //         event.preventDefault(); // Prevent default behavior of anchor tag or button click
    //         event.stopPropagation();
    //         console.log('Category clicked:', this.getAttribute('data-category'));
    
    //         const selectedCategory = this.getAttribute('data-category');
    //     searchText = '';
    //     document.getElementById('filterSearchInput').value = ''; // Clear search input field

    //     // Load products for the selected category
    //     const scrollPosition = window.scrollY; // Save current scroll position
    //     loadCategoryProducts(selectedCategory, searchText);
    //     window.scrollTo(0, scrollPosition); // Restore scroll position after loading products
    //      // Update sorting options based on the selected category
    //     //  console.log('Filter container visibility:', document.querySelector('.filterOptions').classList.contains('active'));
    //     // window.location.href = 'productsList.html?filterCategory=' + encodeURIComponent(category);
    //     });
    // });
// Event listener for category filters
document.querySelectorAll('#categoryList li').forEach(function(categoryItem) {
    categoryItem.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default behavior of anchor tag or button click
        event.stopPropagation();
        
        console.log('Category clicked:', this.getAttribute('data-category'));

        const selectedCategory = this.getAttribute('data-category');
        const currentURL = new URL(window.location.href);
        const currentPage = currentURL.pathname.split('/').pop();

        if (currentPage === 'productsList.html') {
            // If already on productsList.html, just filter products
            searchText = '';
            document.getElementById('filterSearchInput').value = ''; // Clear search input field

            // Load products for the selected category
            const scrollPosition = window.scrollY; // Save current scroll position
            loadCategoryProducts(selectedCategory, searchText);
            window.scrollTo(0, scrollPosition); // Restore scroll position after loading products
        } else {
            // Redirect to productsList.html with filterCategory parameter
            const redirectURL = `productsList.html?filterCategory=${encodeURIComponent(selectedCategory)}`;
            window.location.href = redirectURL;
        }
    });
});

    
    // Event listener for clear filter button
    document.getElementById("clearFilterBtn").addEventListener("click", function() {
        document.getElementById("filterSearchInput").value = '';
        searchText = '';
        loadCategoryProducts(category); // Reload products for the current global category
    });
    
    // Initial load of products based on the category parameter
    const params = new URLSearchParams(window.location.search);
    category = params.get('category');
    searchText = params.get("search")||'';
    const filterCategory = params.get('filterCategory');
    if (category) {
        loadCategoryProducts(category, searchText);
    } else if (searchText) {
        loadCategoryProducts('', searchText);
    }else if(filterCategory){
        loadCategoryProducts(filterCategory, searchText);
    } else {
        console.error('No category or search parameter found in URL');
    }

    const sortOptions = document.getElementById("sortOptions");
    if (sortOptions) {  // Check if sortOptions element exists
        sortOptions.addEventListener('change', function() {
            
            const selectedOption = sortOptions.value;
            const products = document.querySelectorAll('.itemsContainer');
            const sortedProducts = Array.from(products).sort((a, b) => {
                if (selectedOption === 'atoz') {
                    return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
                } else if (selectedOption === 'ztoa') {
                    return b.querySelector('h3').textContent.localeCompare(a.querySelector('h3').textContent);
                } else if (selectedOption === 'priceLowToHigh') {
                    return parseFloat(a.querySelector('.mainprice').textContent.slice(2)) - parseFloat(b.querySelector('.mainprice').textContent.slice(2));
                } else if (selectedOption === 'priceHighToLow') {
                    return parseFloat(b.querySelector('.mainprice').textContent.slice(2)) - parseFloat(a.querySelector('.mainprice').textContent.slice(2));
                }
            });
            const productsContainer = document.getElementById("productsList");
            productsContainer.innerHTML = ''; // Clear previous products
            sortedProducts.forEach(product => {
                productsContainer.appendChild(product);
            });
        });
    } else {
        console.error('Element with id "sortOptions" not found.');
    }


    // initializeFavorites(); // Initialize favorites state on page load

    console.log("searchParams", searchText)

});


// var toggleFilterBtn = document.getElementById("toggleFilterBtn");
// var filterOptions = document.querySelector('.filterOptions');
// var icon = toggleFilterBtn.querySelector("i");

// toggleFilterBtn.addEventListener('click', function() {
//   toggleFilterBtn.classList.toggle('active'); // Toggle 'active' class for styling

//   if (filterOptions.style.display === 'none') {
//     filterOptions.style.display = 'block';
//     icon.classList.remove("fa-arrow-right");
//     icon.classList.add("fa-arrow-left");
//   } else {
//     filterOptions.style.display = 'none';
//     icon.classList.add("fa-arrow-right");
//     icon.classList.remove("fa-arrow-left");
//   }
// });
// document.addEventListener("DOMContentLoaded", function() {
//     const toggleFilterBtn = document.getElementById("toggleFilterBtn");
//     const closeFilterBtn = document.getElementById("closeFilterBtn");
//     const filterOptions = document.querySelector(".filterOptions");

//     // Toggle filter options visibility
//     toggleFilterBtn.addEventListener("click", function() {
//         filterOptions.classList.toggle("active");
       
//         // toggleFilterBtn.classList.toggle("active");
//     });

//     // Close filter options when close button is clicked
//     closeFilterBtn.addEventListener("click", function() {
//         filterOptions.classList.remove("active");
        
//         // toggleFilterBtn.classList.remove("active");
//     });
    
// });
