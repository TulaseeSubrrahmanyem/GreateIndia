var slideIndex = 0;
var slideInterval;
showSlides(slideIndex);
function showSlides() {
    var slides = document.getElementsByClassName("carousel-slide");
    for (var i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    slides[slideIndex - 1].style.display = "block"; // Corrected indexing

}
 
function plusSlides(n) {
    clearInterval(slideInterval); // Clear the interval when manually changing slides
    slideIndex += n - 1; // Adjust slideIndex based on manual navigation
    if (slideIndex >= document.getElementsByClassName("carousel-slide").length) {
        slideIndex = 0;
    } else if (slideIndex < 0) {
        slideIndex = document.getElementsByClassName("carousel-slide").length - 1;
    }
    showSlides();
    autoMoveSlides(); // Restart automatic slideshow after manual navigation
}
 
function autoMoveSlides() {
    slideInterval = setInterval(function () {
        plusSlides(1); // Move to the next slide every x milliseconds
    }, 2000); // Change 2000 to the desired interval in milliseconds
}
 
// Start the automatic slideshow
autoMoveSlides();
 
// Show the first slide initially
showSlides();
 
 
 
 
// Define the showItems function
function loadCategoryProducts(category) {
    window.location.href = 'productsList.html?category=' + encodeURIComponent(category);
 
}
function CategoryProducts(category) {
    window.location.href = 'productsList.html?category=' + encodeURIComponent(category);
 
}
 
document.addEventListener("DOMContentLoaded", () => {
    loadCategories(); // Load categories when the DOM content is loaded
    loadItems();
 
    // Event listeners for category navigation
    document.querySelectorAll('.gallery-wrap').forEach(gallery => {
        const backBtn = gallery.querySelector('.backbtn');
        const nextBtn = gallery.querySelector('.nextbtn');
     
 
 
        backBtn.addEventListener('click', () => {
            scrollGallery(gallery.querySelector('.gallery'), -750);
        });
 
        nextBtn.addEventListener('click', () => {
            scrollGallery(gallery.querySelector('.gallery'), 750);
        });
    });
});
 
async function loadCategories() {
    try {
        const response = await fetch("https://api.npoint.io/27833b79d75e587b7b52");
        const productData = await response.json();
        console.log("Product Data:", productData);
 
        if (productData && Array.isArray(productData.products)) {
            productData.products.forEach(mainCategory => {
                console.log(mainCategory.categories)
                if (mainCategory.maincategory.toLowerCase() === 'grocergrocery') {
                    createCategoryGallery(mainCategory, 'groceriesGallery');
                } else if (mainCategory.maincategory.toLowerCase() === 'techgadgets') {
                    createCategoryGallery(mainCategory, 'electronicsGallery');
                } else if (mainCategory.maincategory.toLowerCase() === 'fashion') {
                    createCategoryGallery(mainCategory, 'clothesGallery');
                }
            });
        } else {
            console.error('productData is undefined or productData.products is not an array');
        }
    } catch (error) {
        console.error('Error fetching or processing categories:', error);
    }
}
 
function createCategoryGallery(mainCategory, galleryId) {
    const gallery = document.getElementById(galleryId).querySelector('.gallery');
    // const categoryHeading = document.createElement('h2');
    // categoryHeading.textContent = `${mainCategory.maincategory} (${mainCategory.percent})`;
    // categoryHeading.classList.add('category-heading');
    // gallery.parentNode.insertBefore(categoryHeading, gallery.nextSibling); // Insert heading before the gallery
 
    let itemCount = 0;
    let displayedItems = {}; // Track displayed items to ensure variety
 
    mainCategory.categories.forEach(category => {
        let itemsToDisplay = category.items.slice(0, 3); // Display up to 3 items per subcategory
        itemsToDisplay = shuffleArray(itemsToDisplay); // Shuffle items within each subcategory
        const subCategories=category.category
        console.log("subcategorie",subCategories)
        itemsToDisplay.forEach(item => {
            if (itemCount < 13 && !displayedItems[item.name]) { // Limit total items to 12 and ensure no duplicates
                createProductDiv(item, gallery, mainCategory.maincategory,subCategories);
                // console.log(item)
                // console.log(gallery)
                // console.log( mainCategory.maincategory)
                // console.log(subCategories)
                displayedItems[item.name] = true; // Mark item as displayed
                itemCount++;
            }
        });
    });
}
 
function createProductDiv(item, gallery, mainCategoryName,subCategories) {
 
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');
 const truncateText = (text, maxLength) => {
            return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
        };
 
    const productData = { ...item, mainCategoryName: mainCategoryName,subCategories }; // Combine item data with mainCategoryName
    const productDataString = JSON.stringify(productData, (key, value) => {
        // Escape single quotes in string values
        return typeof value === 'string' ? value.replace(/'/g, "&#39;") : value;
    });
    console.log(productData)
    console.log(productDataString)
   
    productDiv.innerHTML = `
        <div data-product='${productDataString}' onclick="listOfRelated(this)">
            <img src="${item.image || 'https://via.placeholder.com/150'}" alt="${item.name}">
            <div class="product-overlay">
                <p  >${item.name}</p>
                <p>${item.brand}</p>
            </div>
        </div>
    `;
 
    gallery.appendChild(productDiv);
}
 
// Function to view item details
window.listOfRelated = function(div) {
    try {
        // Parse the product data from the div's data-product attribute
        const productDataString = div.getAttribute('data-product');
        console.log('JSON String:', productDataString); // Log the string to check its format
 
        const productData = JSON.parse(productDataString);
        console.log(productData)
        // Assuming id and mainCategoryName are available in productData
        // const productId = productData.id;
        // const mainCategoryName = productData.mainCategoryName;
        const subCategory=productData.subCategories
        console.log(subCategory)
        // Store the product data locally
        localStorage.setItem('selectedProductData', JSON.stringify(productData));
 
        // Redirect to the product detail page with query parameters
        window.location.href = 'productsList.html?category=' + encodeURIComponent(productData.subCategories)
    } catch (error) {
        console.error('Error parsing product data:', error);
    }
};
 
function displayProductDetails(item) {
    const productDetails = document.getElementById('productDetails');
    productDetails.innerHTML = `
        <h2>${item.name}</h2>
        <p>${item.description || 'No description available.'}</p>
        <img src="${item.image || 'https://via.placeholder.com/150'}" alt="${item.name}">
    `;
}
 
function scrollGallery(gallery, scrollAmount) {
    gallery.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}
 
// Function to shuffle an array
function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }
    return array;
}
 
 
// startslides
const cardsContainer = document.querySelector(".container");
 
 cardsContainer.addEventListener("click", (e) => {
   const target = e.target.closest(".card");
 
   if (!target) return;
 
   cardsContainer.querySelectorAll(".card").forEach((card) => {
     card.classList.remove("active");
   });
 
   target.classList.add("active");
 });
// endslides
 
 
async function loadItems() {
    try {
        const response = await fetch("https://api.npoint.io/27833b79d75e587b7b52");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const productData = await response.json();
        const subcategoryNames = [ 'Mobilephones', 'SmartWatches', 'MenFootwear', 'Tablets', 'Sofa'].map(name => name.toLowerCase());
 
        if (productData && Array.isArray(productData.products)) {
            productData.products.forEach(mainCategory => {
                const mainCategorys=mainCategory.maincategory
                mainCategory.categories.forEach(category => {
                    const categoryNameLower = category.category.toLowerCase();
                    if (subcategoryNames.includes(categoryNameLower)) {
                        const itemsToDisplay = category.items.slice(0, 5); // Slice to get the first 5 items
                        itemsToDisplay.forEach(item => {
                            createLoadItemsDiv(item,mainCategorys, categoryNameLower);
                        });
                    }
                });
            });
        } else {
            console.error('productData is undefined or productData.products is not an array');
        }
    } catch (error) {
        console.error('Error fetching or processing categories:', error);
    }
}
 
function createLoadItemsDiv(item, mainCategoryName, categoryNameLower) {
    const container = document.getElementById('containerId');
    const productDiv = document.createElement('div');
    productDiv.classList.add('products');
 
    const productData = { ...item, mainCategoryName, categoryNameLower }; // Combine item data
    const productDataString = JSON.stringify(productData, (key, value) => {
        return typeof value === 'string' ? value.replace(/'/g, "&#39;") : value;
    });
    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };
    const truncatedName = truncateText(item.name, 10);
    let selectedSize = '';
    if (item.size && item.size.length > 0) {
        selectedSize = item.size[0]; // Default to first size if available
    } else if (item['size(UK)'] && item['size(UK)'].length > 0) {
        selectedSize = item['size(UK)'][0]; // Default to first UK size if available
    }
    productDiv.innerHTML = `
        <div>
            <div data-product='${productDataString}' onclick="viewItemDetails(this)" class="suffleSubCategory">
                <img src="${item.image || 'https://via.placeholder.com/150'}" alt="${item.name}">
               
            </div>
             <div class="product-overl">
                    <p style='font-weight:550;'>${truncatedName}</p>
                    <p st>&#8377;${item.mainprice}</p>
                    <button type='button' class="suffleADTbutton" data-product='${productDataString}' data-size="${selectedSize}" onclick="addToCart(this)">Add to Cart</button>
            </div>
        </div>
    `;
 
    container.appendChild(productDiv);
}
 
window.viewItemDetails = function (div) {
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
 