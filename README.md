# OG Docs 📝

**A modern, real-time collaborative documentation platform built for speed, security, and developer-centric content control.**

## About The Project

**OG Docs** is a full-stack web application designed to streamline the way teams and developers write, edit, and share documentation together. The platform emphasizes structured content delivery and real-time collaboration, moving beyond traditional plain-text storage toward a robust, custom-tailored data architecture.

Built as a high-performance **MERN** application, OG Docs enables multiple collaborators to work simultaneously in a shared workspace, with changes reflected instantly for everyone—ensuring smooth, efficient, and transparent collaboration.

---

## 🚀 Key Features

* **Real-Time Collaborative Workspace:** A dedicated editing area where multiple collaborators can make changes simultaneously, with updates reflected in real time.
* **Custom Slate.js Engine:** A custom-built implementation that structures content into JSON format for consistent styling and long-term portability.
* **Modern UI/UX:** A clean, responsive interface built with **React 19**, **Tailwind CSS 4.0**, and **CoreUI** components.
* **Secure Authentication:** Integrated **Google OAuth** for fast and secure user access.
* **Developer-Friendly Build:** Optimized with **Vite** for near-instant hot module replacement (HMR).
* **Robust Security:** Hardened backend using **Helmet**, **HPP**, **Rate Limiting**, and **Zod** for strict schema validation.

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

The core logic of OG Docs revolves around a structured, collaborative data pipeline:

1. **The Input:** Contributors write using a custom editor powered by **Slate.js**. Instead of generating raw HTML, the editor produces a clean **JSON tree** representing the document structure.
2. **The Collaboration Layer:** Multiple users can edit the same document simultaneously, with real-time updates synchronized across all active sessions.
3. **The Storage:** The JSON structure is validated using **Zod** and securely stored in **MongoDB** via **Mongoose** models.
4. **The Rendering:** On the frontend, a custom rendering engine traverses the JSON tree and dynamically paints the content using Tailwind-styled React components.

---

## 📦 Installation & Setup

Follow these steps to run OG Docs locally.

### Prerequisites

* [Node.js](https://nodejs.org/) (Latest LTS)
* [MongoDB](https://www.mongodb.com/) account or local instance

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/shamil-tp/Blogify.git
   cd blogify
   ```

2. **Setup Backend**

   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the `backend` folder and add your `MONGODB_URI`, `JWT_SECRET`, and `PORT`.

3. **Setup Frontend**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Run Development Servers**

   * **Backend:** `npm run test` (nodemon)
   * **Frontend:** `npm run dev` (Vite)

5. **View the App**
   Open `http://localhost:5173` in your browser.

---

## 👥 The Team

This project was collaboratively designed and developed by:

* **Sinan** – [GitHub](https://github.com/sinanrahman/)
* **Hana** – [GitHub](https://github.com/Hana-Haris3)
* **Salih** – [GitHub](https://github.com/salih85)

---

OG Docs is built with collaboration at its core—designed to help teams write, iterate, and ship documentation together, faster and cleaner.
