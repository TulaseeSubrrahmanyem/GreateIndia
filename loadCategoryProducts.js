
// Load and display products based on the category
document.addEventListener("DOMContentLoaded", function() {
    // Parse the query parameter to get the category
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');

    // Load and display products based on the category
    loadCategoryProducts(category);
});

// Define the loadCategoryProducts function
function loadCategoryProducts(category) {
    const productsContainer = document.getElementById("productsList");
    if (!productsContainer) {
        console.error('productsList container not found');
        return;
    }

    // Clear previous products
    productsContainer.innerHTML = '';

    // Fetch products data from JSON Bin
    fetch('https://api.jsonbin.io/v3/b/666155a6e41b4d34e4ff34a6', {
        method: 'GET',
        headers: {
            'X-Master-Key': '$2b$10$.5RTawEVLeUxNlnmNipR3O5vkgh8J2KCXlCqLy1V4ItqH4KlOF0Hq',
            'X-Access-Key': '6661580ce41b4d34e4ff357b',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parse response body as JSON
    })
    .then(data => {
        // Check if the data was fetched successfully
        if (data && data.record && Array.isArray(data.record.products)) {
            const categories = data.record.products;

            // Find the category
            const foundCategory = categories.find(cat => cat.category === category);
            if (foundCategory) {
                const products = foundCategory.items;

                // Display products
                products.forEach(product => {
                    const productDiv = document.createElement('div');
                    productDiv.classList.add('item');

                    // Create HTML structure for product
                    productDiv.innerHTML = `
                        <div class='itemsContainer'> 
                            <div class='itemsDetails'>
                                <div>
                                    <img src="${product.image}" alt="${product.name}" class="itemImg">
                                </div>
                                <div>
                                    <h3>${product.name}</h3>
                                    <p>Brand: ${product.brand}</p>
                                    <p>Model: ${product.model}</p>
                                    <p>Features: ${product.features ? product.features.join(', ') : 'N/A'}</p>
                                    <div class='priceContainer'>
                                        <p>${product.price}</p>
                                        <button class='addCart' data-product='${JSON.stringify(product)}' onclick="addToCart(this)">Add Cart</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    productsContainer.appendChild(productDiv);
                });
            } else {
                console.error('Category not found:', category);
            }
        } else {
            console.error('Data not found or invalid format');
        }
    })        
    .catch(error => {
        console.error('Error loading products:', error);
    });
}



