document.addEventListener("DOMContentLoaded", function() {
    const searchParams = new URLSearchParams(window.location.search);
    const searchText = searchParams.get("search");const searchParams = new URLSearchParams(window.location.search);
    const searchText = searchParams.get("search");

    if (searchText) {
        searchRenderProducts("https://api.npoint.io/27833b79d75e587b7b52", searchText);
    } else {
        console.error('No search text found in the query parameter');
    }

    async function searchRenderProducts(url, searchText) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            renderSearchResults(data.products, searchText);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    function renderSearchResults(products, searchText) {
        console.log("Rendering search results...");
        const searchResultsContainer = document.getElementById("searchResultsContainer");
        if (searchResultsContainer) {
            searchResultsContainer.innerHTML = '';
            let filteredProducts = [];
            products.forEach(mainCategory => {
                mainCategory.categories.forEach(category => {
                    const mainCategoryName = category.category; // Corrected mainCategoryName assignment
                    category.items.forEach(item => {
                        if (item.name.toLowerCase().includes(searchText.toLowerCase())) {
                            filteredProducts.push({ ...item, mainCategoryName }); // Correctly pair item with mainCategoryName
                        }
                    });
                });
            });
        // if (searchResultsContainer) {
        //     searchResultsContainer.innerHTML = '';
        //     let filteredProducts = [];
        //     const searchTextLower = searchText.toLowerCase();
            
        //     products.forEach(mainCategory => {
        //         mainCategory.categories.forEach(category => {
        //             const mainCategoryName = mainCategory.name || ''; // Main category name with default value
        //             const subCategoryName = category.category || '';
        
        //             category.items.forEach(item => {
        //                 // Check if the search text is in the name, brand, main category, or subcategory
        //                 const nameMatch = item.name && item.name.toLowerCase().includes(searchTextLower);
        //         const brandMatch = item.brand && item.brand.toLowerCase().includes(searchTextLower);
        //         const mainCategoryMatch = mainCategoryName.toLowerCase().includes(searchTextLower);
        //         const subCategoryMatch = subCategoryName.toLowerCase().includes(searchTextLower);
        
        //         if (nameMatch || brandMatch || mainCategoryMatch || subCategoryMatch) {
        //             filteredProducts.push({ ...item, mainCategoryName, subCategoryName }); // Include subcategory name
        //         }
        //             });
        //         });
        //     });
            if (filteredProducts.length === 0) {
                const noResultsDiv = document.createElement('div');
                noResultsDiv.classList.add('no-results');
                noResultsDiv.textContent = 'No data matches your search criteria.';
                searchResultsContainer.appendChild(noResultsDiv);
            } else {
                filteredProducts.forEach(product => {
                    console.log(product)
                    createProductDiv1(product);
                });
            }
        } else {
            console.error('Search results container not found');
        }
    }

    function createProductDiv1(product) {
        const searchResultsContainer = document.getElementById("searchResultsContainer");
        const productData = product; // product already contains mainCategoryName
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        const productDataString = JSON.stringify(productData, (key, value) => {
            // Escape single quotes in string values
            return typeof value === 'string' ? value.replace(/'/g, "&#39;") : value;
        });
        productDiv.innerHTML = `
           <div class='itemsDetails'>
                <div data-product='${productDataString}' onclick="viewItemDetails(this)">
                    <img src="${product.image}" alt="${product.name}" class="itemImg">
                </div>
                <div class='itemMatter'>
                    <h3>${product.name}</h3>
                    ${product.brand ? `<p>Brand: ${product.brand}</p>` : ''}
                    ${product.quantity ? `<p>Quantity: ${product.quantity}</p>` : ''}
                  
                    ${product.rating ? `<p class='rating'> ${product.ratingstars}</p>` : ''}
                   <div class='priceCart' >
                    <div class="prices">
                      
                        <p class="mainprice">₹ ${product.mainprice}</p>
                         ${product.discount ? `<p class="discount">${product.discount}</p>` : ''}
                    </div>
                    <div class='priceCartBtn'>
                        <button type='button' class='addCart' data-product='${productDataString}' onclick="addToCart(this)">Add to Cart</button>
                    </div>
                    </div>
                </div>
               
            </div>
        `;
        searchResultsContainer.appendChild(productDiv);
    }

    window.viewItemDetails = function(div) {
        try {
            const productDataString = div.getAttribute('data-product');
            const productData = JSON.parse(productDataString);
            // Assuming id and mainCategoryName are available in productData
            const productId = productData.id;
            const mainCategoryName = productData.mainCategoryName;
            console.log(mainCategoryName);
            localStorage.setItem('selectedProductData', JSON.stringify(productData));
            window.location.href = `productDetail.html?productId=${productId}&mainCategoryName=${mainCategoryName}`;
        } catch (error) {
            console.error('Error parsing product data:', error);
        }
    }
});
