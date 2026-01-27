# Blogify 📝

**A modern, collaborative blogging platform built for speed, security, and developer-centric content control.**

## About The Project

**Blogify** is a full-stack web application designed to streamline the way developers write and share articles. The project focuses on structured content delivery, moving away from standard plain-text storage to a robust, custom-tailored data architecture.

Built as a high-performance **MERN** application, Blogify provides a seamless writing experience while giving authors granular control over their content's metadata and presentation.

---

## 🚀 Key Features

* **Custom Slate.js Engine:** Uses a custom-built implementation to structure content into JSON format, ensuring consistent styling and portability.
* **Modern UI/UX:** A clean, responsive interface built with **React 19**, **Tailwind CSS 4.0**, and **CoreUI** components.
* **Secure Authentication:** Integrated **Google OAuth** for quick and secure user access.
* **Developer-Friendly Build:** Optimized with **Vite** for near-instant hot module replacement (HMR).
* **Robust Security:** Hardened backend using **Helmet**, **HPP**, **Rate Limiting**, and **Zod** for schema validation.

---

## 🛠 The Tech Stack

### Frontend
* **Library:** React 19
* **Styling:** Tailwind CSS 4.0 & CoreUI
* **Editor:** Slate.js (Custom JSON Content Engine)
* **State & Routing:** React Router 7
* **Build Tool:** Vite

### Backend
* **Runtime:** Node.js
* **Framework:** Express.js (v5)
* **Authentication:** JWT & Google Auth Library
* **Validation:** Zod

### Database
* **Database:** MongoDB
* **ODM:** Mongoose

---

## ⚙️ How It Works

The core logic of Blogify revolves around a structured data pipeline:

1.  **The Input:** Authors use a custom editor powered by **Slate.js**. Instead of generating messy HTML, it outputs a clean **JSON tree** representing the document structure.
2.  **The Storage:** This JSON object is validated via **Zod** and stored in **MongoDB** through **Mongoose** models.
3.  **The Rendering:** On the frontend, our custom engine traverses the JSON tree and dynamically "paints" the content using Tailwind-styled React components.



---

## 📦 Installation & Setup

Follow these steps to get a copy of Blogify running locally.

### Prerequisites
* [Node.js](https://nodejs.org/) (Latest LTS)
* [MongoDB](https://www.mongodb.com/) account or local instance.

### Steps

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/shamil-tp/Blogify.git](https://github.com/shamil-tp/Blogify.git)
    cd blogify
    ```

2.  **Setup Backend**
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in the `backend` folder and add your `MONGODB_URI`, `JWT_SECRET`, and `PORT`.

3.  **Setup Frontend**
    ```bash
    cd ../frontend
    npm install
    ```

4.  **Run Development Servers**
    * **Backend:** `npm run test` (uses nodemon)
    * **Frontend:** `npm run dev` (uses vite)

5.  **View the App**
    Open `http://localhost:5173` for the frontend.

---

## 👥 The Team

This project was collaboratively designed and developed by:

* **Shamil** - [GitHub](https://github.com/shamil-tp)
* **Sinan** - [GitHub](https://github.com/sinanrahman/)
* **Ranfees** - [GitHub](https://github.com/Ranfees)