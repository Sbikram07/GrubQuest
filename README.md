# 🍔 GrubQuest

GrubQuest is a full-stack **online food delivery platform** inspired by Swiggy and Zomato.  
It allows users to browse restaurants, order food, leave reviews, and track orders — with role-based access for **users, restaurant owners, and delivery agents**.

---

## 🚀 Features

### 👥 User Roles
- **Customer** – Browse restaurants, add items to cart, place orders, review food & restaurants.
- **Restaurant Owner** – Manage restaurants, add/update/delete menu items, view orders.
- **Delivery Agent** – View assigned orders, update delivery status.
- **Admin** – Full control over users, restaurants, and orders.

### 🔐 Authentication & Authorization
- JWT-based authentication (stored in HTTP-only cookies)
- Role-based access control
- Secure password hashing (bcrypt)

### 🍽 Restaurant Management
- Add, update, delete restaurants
- Add and manage menu items
- Upload images using **Cloudinary**

### 🛒 Ordering System
- Add/remove items from cart
- Place orders with real-time status updates
- Assign orders to delivery agents
- Track active orders

### ⭐ Review System
- Post reviews for restaurants or individual menu items
- Ratings update dynamically based on reviews

### 📡 Additional Features
- SSE (Server-Sent Events) for live notifications (e.g., order updates)
- Active status tracking for restaurants & delivery agents
- Search & filter restaurants by category, location, tags

---

## 🛠 Tech Stack

### **Frontend**
- [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ShadCN UI](https://ui.shadcn.com/) + [Aceternity UI](https://aceternity.com/)

### **Backend**
- [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
- [Cloudinary](https://cloudinary.com/) for image storage

### **Other**
- JWT & cookies for auth
- bcrypt for password hashing


---




---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

- git clone https://github.com/yourusername/grubquest.git
- cd grubquest

## Backend Setup
```bash
 cd server
 npm install
```
```env
 # Create a .env file in server/ with  
 PORT=5000
 MONGO_URI=your_mongodb_connection_string
 JWT_SECRET=your_jwt_secret
 CLOUDINARY_CLOUD_NAME=your_cloudinary_name
 CLOUDINARY_API_KEY=your_cloudinary_key
 CLOUDINARY_API_SECRET=your_cloudinary_secret
```
```bash
# run backend using command 
 npm run dev
```
## Frontend setup 
```bash
cd ../client
npm install

# Create a .env file in client/ with:

VITE_API_URL=http://localhost:5000
npm run dev
```
## 🌐 Demo
Check out the live demo [here](https://grubquest.vercel.app/)

![Home Page](./preview/Screenshot%202025-08-16%20172403.png)
![Restaurant Page](./preview/Screenshot%202025-08-16%20172443.png)

## License 
![License](https://img.shields.io/badge/license-MIT-green)




## Contact
- Your Name – bikramsasmal2707@gmail.com
- GitHub: [Sbikram07](https://github.com/Sbikram07)

