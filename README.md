# Nimpression - Company Website
## Description
This repository showcases part of my current internship project: a full-stack web application for Nimpression Ltd., a logistics company. The app allows customers to learn about the company, obtain quotes, and track deliveries. It also helps managers manage trucks and communicate with customers.

The web app employs modular coding practices to make the code more reusable. It integrates the Google Places API for address autocomplete, and I am currently working on integrating the Distance Matrix API to calculate booking prices.

## Key Features (so far)
### 1. User-Friendly Homepage:
![Home](img/home1.png)
![Home](img/home2.png)
![Home](img/home3.png)
![Home](img/home4.png)
![Home](img/about.png)
![Home](img/trucks.png)
![Home](img/single_truck.png)

### 2. Manager Dashboard:
Custom dashboards for each user role with tailored functionality.
![Dashboard](img/truck_list.png)
![Dashboard](img/add_truck.png)
![Dashboard](img/edit_truck.png)

### 3. Login/Register:
Multi-steps register with comprehensive validation.
![User](img/register.png)
![User](img/login.png)

### 4. Getting Quotes and Make a booking with API Integration: 
![Booking](img/booking1.png)
![Booking](img/booking2.png)
Staff can manage the quotes they receieve and respond to them.
Use Places API to autocomplete address.

### 5. Messaging System: 
Enables communication between customers and staff/manager.
![Contact](img/contact.png)

### 6. Track delivery:
![Track](img/track.png)

## Project Layout
```bash
admin
   |-- .gitignore
   |-- README.md
   |-- eslint.config.js
   |-- index.html
   |-- package-lock.json
   |-- package.json
   |-- postcss.config.js
   |-- public
   |   |-- logo.svg
   |-- src
   |   |-- App.jsx
   |   |-- assets
   |   |   |-- logo.svg
   |   |   |-- profile.png
   |   |   |-- react.svg
   |   |   |-- upload_area.png
   |   |-- components
   |   |   |-- AddTruck.jsx
   |   |   |-- EditTruck.jsx
   |   |   |-- ListTruck.jsx
   |   |   |-- Navbar.jsx
   |   |   |-- Sidebar.jsx
   |   |-- index.css
   |   |-- main.jsx
   |   |-- pages
   |   |   |-- Admin.jsx
   |-- tailwind.config.js
   |-- vite.config.js
backend
   |-- index.js
   |-- node_modules
   |-- package-lock.json
   |-- package.json
   |-- upload
   |   |-- images
frontend
   |-- .eslintrc.cjs
   |-- .gitignore
   |-- README.md
   |-- index.html
   |-- package-lock.json
   |-- package.json
   |-- postcss.config.js
   |-- public
   |   |-- logo.svg
   |-- src
   |   |-- App.jsx
   |   |-- Context
   |   |   |-- CompanyContext.jsx
   |   |-- assets
   |   |   |-- all_products.js
   |   |   |-- footer_contact.js
   |   |   |-- footer_links.js
   |   |   |-- logo.svg
   |   |   |-- popular.js
   |   |   |-- value.js
   |   |-- components
   |   |   |-- AboutUs.jsx
   |   |   |-- CartItems.jsx
   |   |   |-- ContactUs.jsx
   |   |   |-- Footer.jsx
   |   |   |-- Header.jsx
   |   |   |-- Hero.jsx
   |   |   |-- Item.jsx
   |   |   |-- Navbar.jsx
   |   |   |-- Newsletter.jsx
   |   |   |-- Offer.jsx
   |   |   |-- Popular.jsx
   |   |   |-- ProductDisplay.jsx
   |   |   |-- ProductHd.jsx
   |   |   |-- Team.jsx
   |   |   |-- Trucks.jsx
   |   |   |-- Value.jsx
   |   |-- index.css
   |   |-- main.jsx
   |   |-- pages
   |   |   |-- About.jsx
   |   |   |-- Booking.jsx
   |   |   |-- Cart.jsx
   |   |   |-- Contact.jsx
   |   |   |-- Home.jsx
   |   |   |-- Login.jsx
   |   |   |-- Track.jsx
   |   |   |-- Truck.jsx
   |   |   |-- Vehicles.jsx
   |-- tailwind.config.js
   |-- vite.config.js

```
## Project Links
- GitHub: https://github.com/Sijia-Hu-1158997/nimpression
