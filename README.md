# Rahala - Specialized E-Commerce Platform for Travel Booking

Rahala is a specialized e-commerce platform tailored to users looking for group tourism deals and individual travel packages. The platform simplifies the travel booking process for both travelers and travel agencies, offering a user-friendly interface, real-time updates, and tools for effective travel management.

---

## **Table of Contents**
1. [Motivation](#motivation)
2. [Features](#features)
3. [Setup Instructions](#setup-instructions)
4. [Usage](#usage)
5. [Technologies Used](#technologies-used)
6. [Contributors](#contributors)

---

## **Motivation**
The primary motivation for Rahala is to bridge the gap between travelers seeking group travel experiences and agencies providing curated travel packages. The platform aims to:
- Coordinate group travel efficiently.
- Empower travel agencies with tools to manage and market their offerings.
- Enhance the booking experience with intuitive design and advanced search capabilities.

---

## **Features**  
- **Travelers**: Search and filter packages, book trips securely, manage bookings and profiles, and receive real-time notifications.  
- **Travel Agencies**: Create and manage travel listings, track bookings and revenue, and interact with travelers.  
- **Admins**: Approve or reject agency registrations, monitor activity, and manage platform compliance.

---

## **Setup Instructions**

### **Prerequisites**
- [Node.js](https://nodejs.org/) installed on your machine.
- [npm](https://www.npmjs.com/) (comes with Node.js).
- [Git](https://git-scm.com/) for cloning the repository.

### **Clone the Repository**
```bash
git clone https://github.com/your-repo-url/rahala.git
cd rahala
```

### **Frontend Setup**
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend server:
   ```bash
   npm start
   ```

### **Backend Setup**
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npx nodemon server.js
   ```

### **Environment Variables**
- Both the frontend and backend require environment variables (`.env` files).
- The `.env` files are **not included** in the repository for security reasons. You will need to create `.env` files in both the `frontend` and `backend` directories and configure the necessary variables.

---

## **Usage**
1. Run both the frontend and backend servers as described in the setup instructions.
2. Access the application in your browser by navigating to:
   - **Frontend**: `http://localhost:3000`
   - **Backend**: `http://localhost:5000` (or the port specified in the backend `.env` file).
3. Start exploring the travel deals, manage listings, or moderate as an admin!

---

## **Technologies Used**
- **Frontend**: React, Zustand for state management, Next UI components.
- **Backend**: Node.js, Express.js, MongoDB.
- **Authentication**: Firebase Authentication.
- **Hosting**: Netlify (Frontend), Render (Backend).

---

## **Contributors**
- **Project Team**:
- HASSAN AL NASSER
- ALI AL SULES
- MARTADA ALBAIK
- ABDULLAH ALJISHI
- AHMED HAMADAH

---
