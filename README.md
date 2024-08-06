Great India is a web-based application designed for e-commerce activities such as purchasing and selling goods like groceries, electricals, electronics, and more. This project is developed using a schematic representation to design each module of the application.

Schematic Representation of a Single Process
Inputs
Source of Inputs: Vendors, Customers
Inputs: Product, Payment, Personal Information
Activities
User Authentication
Product Management (Inventory)
Shopping Cart Management
Order Processing
Payment Integration
Category Management
Scalability & Performance (Optimization)
Security & Privacy
Outputs
Vendors should be able to sell their products to customers.
Increase the local economy.
Sellers will sell their products globally via this platform.
Receivers of Output
Vendors
Customers
Module / Activity Descriptions
1. User Authentication
Login

Inputs: E-mail, Password
Functionality:

Users must enter their email and password and click the login button to access the application.
Option to reset the password if forgotten.
Security Features:

E-mail and password must match the application user records for access.
Account lockout for 4 hours after 3 failed login attempts.
Unique token generation upon successful authentication based on user role.
Registration

Inputs: Name, E-mail, Password, Gender
Functionality:

Users enter required details to gain access to the services.
Security Features:

Duplicate entries are revoked from entering the database.
2. Product Management (Inventory)
Inputs: Product information (Name, Serial no, Price, Discount, Quantity, etc.) from various sectors (Fashion, Electricals, Electronics, Grocery, Cosmetics, Household items).

Functionality:

Products filtered by:
Prices: High to Low, Low to High
Ratings
Brand
Sorted by A to Z and Z to A
Real-Time Stock Tracking:
Monitor stock levels, identify low stock situations, and prevent stockouts.
Order Fulfillment:
Ensures prompt order fulfillment and prevents overcommitting stock.
Cost Optimization:
Minimizes excess inventory, streamlines stock levels, and reduces storage costs.
Demand Forecasting:
Predicts future demand using past sales data for informed stock replenishment decisions.
Technology to be Used:

JSON format for inputs categorized by type.
JSON files hosted on the API server.
3. Shopping Cart Management
Inputs: Product
Functionality:

Users can view, edit, and delete products in their cart.
View all items intended for purchase.
Security Features:

Limit of 10 items per user.
Cart page accessible only to logged-in users.
4. Order Processing
Inputs: Cart (Items), Payment, Personal (Address, Name, Phone Number, etc.)
Functionality:

Customers purchase items from sellers.
Security Features:

Encryption of payment and personal information.
Order processing requires user authentication.
5. Payment Integration
Inputs: Bank information
Functionality:

Users can use various payment methods to purchase products.
Security Features:

Encryption of payment and personal information.
6. Category Management
Inputs: Product information (Name, Serial no, Price, Discount, Quantity, etc.) from various sectors (Fashion, Electricals, Electronics, Grocery, Cosmetics, Household items).

Functionality:

Organize and optimize product categories and subcategories.
Manage product listings within each category.
Ensure consistent product information across all sales channels.
Enhance customer experience through organized categories.
Boost sales by guiding customers to relevant products.
Streamline operations, reduce errors, and ensure consistency.
7. Scalability & Performance (Optimization)
Current Technologies:

Front-end: HTML, CSS, JavaScript
Back-end: JSON
Database: Excel, Session Storage
Future Scalability:


Database: local Storage
Target Users: 10,000
Database Architecture
Entities and Attributes
Product: Contains details about the product.
P-ID (Primary Key): Unique identifier for each product.
Name: Name of the product.
Price: Price of the product.
Description: Description of the product.
Order: Contains details about the orders.
Order-ID (Primary Key): Unique identifier for each order.
Order-Amount: Amount of the order.
Order-Date: Date on which the order is placed.
Customer: Stores information about the customers.
User-ID (Primary Key): Unique identifier for each user or customer.
Name: Name of the user.
Email: Email of the user.
Password: Password of the user.
Payment: Contains details about the payment.
Payment-ID (Primary Key): Unique identifier for each payment.
Type: Payment methods like UPI or Credit Card.
Amount: Total amount paid by the user.
Cart: Contains details about the cart.
Cart-ID (Primary Key): Unique identifier for each cart.
User-ID (Foreign Key): Reference to the user table.
Category: Contains details about the category options.
C-ID: Unique identifier for each category.
Name: Name of the category.
Picture: Images of the categories.
Description: Description of the category.
Relationships Between Entities
Order – Customer Relationship:

One user can place multiple orders.
Each order is placed by exactly one user.
One-to-Many relationship.
Product – Cart Relationship:

One product can be added to multiple carts.
Each cart can contain multiple products.
Many-to-Many relationship.
Customer – Payment Relationship:

One user can make multiple payments.
Each payment is made by exactly one user.
One-to-Many relationship.
Order – Product Relationship:

One order can contain multiple products.
Many products are ordered in each order.
One-to-Many relationship.
Order – Payment Relationship:

One order has only one payment.
Each payment is for one order.
One-to-One relationship.
Product – Category Relationship:

One product can belong to only one category.
One category can have multiple products.
Many-to-One relationship.
This comprehensive overview outlines the structure, inputs, activities, outputs, and relationships within the Great India e-commerce platform, providing a clear blueprint for development and implementation.
