**I. Project introduction**
Project name: E-commerce website.
Frontend for client: React, Bootstrap, link: https://github.com/TuyetAnh82198/ec-frontend-client
Frontend for admin: React, Bootstrap, link: https://github.com/TuyetAnh82198/ec-frontend-admin
Backend: NodeJS, Express, Socket.IO, link: https://github.com/TuyetAnh82198/ec-backend
Database: MongoDB
Performance optimization: useCallback, lazy loading, Compression
Language: English

**II. Functional description**
CLIENTAPP:
Users can create account, create random password.
An email will be sent to the successfully registered user.
Input value validation.
Only logged in users can place orders; edit cart such as update quantity, delete products (confirm first); make payments.
Automatically discount when orders qualify for free shipping.
Automatically enter the buyer's name (user can change it if they want).
Payment methods: cash, credit card.
Update order's payment status after making payment.
Updating available stock. If there is not enough product quantity,
a notification will be displayed.
If the cart is empty, the checkout button will be inactive.
Update the number of products in the cart on the Navbar.
There is effect for Navbar, Banner and Category.
User can view products by category after clicking product category in HomePage or Shop Page.
Change the color of the name of the category being viewed.
Top 8 most popular products will be displayed in HomePage. After clicking product image,
a pop up will appear. If user click View Detail button, they will be directed to Detail Page.
The is a product list in the same category in Detail Page.
Sorting (also works with search results): default sorting, start from the lowest price, start from the highest price.
Search for products (using setTimeout).
Pagination.
Displaying order history and order detail.
Chat with consultant.
Page 404, 500.

ADMINAPP:
Users can create account, create random password.
An email will be sent to the successfully registered user.
Input value validation.
Filter the type of uploaded image files (jpg, jpeg, png). Product will not be added until uploaded images is enough.
Only logged in users who is admin can add/update/delete (one or many, confirm first) products;
view number of users, number of orders, earnings of month, and total earning;
view latest transactions, and detail of a transation;
chat with clients
Page 404, 500.

**III. Demo link**
CLIENT_APP:
https://ec-frontend-client.onrender.com

ADMIN_APP:
https://ec-frontend-admin.onrender.com

*Recommended browser: Firefox

**IV. Deployment guide (on local)**

1. We need to install NodeJS 

2. Frontend:
CLIENT_APP:
npm start (localhost 3000) 
.env: REACT_APP_BACKEND, REACT_APP_FRONTEND, REACT_APP_STRIPE_PUBLIC_KEY

ADMIN_APP:
npm start (localhost 3001) 
.env: REACT_APP_BACKEND, REACT_APP_FRONTEND

3. Backend:
npm start (localhost 5000)
nodemon.json:
{
  "env": {
    "CLIENT_APP": "for example http://localhost:3000",
    "ADMIN_APP": "http://localhost:3001",
    "MONGDB_USER": ""
    "MONGODB_PASS": "",
    "SESSION_SECRET": "",
    "STRIPE_SECRET_KEY": "",
  }
}
And then update scripts in package.json, for example:
"start": "NODE_ENV=development CLIENT_APP=http://localhost:3000 MONGODB_USER=abc MONGODB_PASS=xyz SESSION_SECRET= STRIPE_SECRET_KEY= nodemon app.js"


**Login information:**
CLIENT_APP
email: abc@gmail.com
pass: 12345678
ADMIN_APP
email: admin@gmail.com
pass: 12345678

**Checkout information**
Card: 4242 4242 4242 4242
MM/YY: Any date in the future.
CVC: Any number.
