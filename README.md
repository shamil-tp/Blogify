# Blogify

**A modern, collaborative blogging platform built for speed and simplicity.**

## About The Project

**Blogify** is a web application that makes writing and sharing articles easy. It was built to solve a specific problem: giving developers more control over how their content is stored and displayed.

Instead of just saving plain text, Blogify uses a **custom-built engine** to handle content, making it a unique learning project and a powerful tool for blogging.

---

## Key Features

* **Custom Content Engine:** We built our own logic to convert JSON data into beautiful HTML styles automatically.
* **Fully Responsive:** Looks great on laptops, tablets, and phones (powered by **Bootstrap**).
* **High Performance:** Powered by **Vite** for lightning-fast build times and asset optimization.
* **Organized Data:** Flexible database structure using **MongoDB**.

---

## The Tech Stack

We used the **MEN Stack** + Bootstrap + Vite to build this application:

* **Frontend:** EJS, Bootstrap 5, CSS3
* **Build Tool:** Vite
* **Backend:** Node.js, Express.js
* **Database:** MongoDB

---

## How It Works

The core of Blogify is unique. Here is the simple breakdown:

1.  **The Input:** When you write a post, the system doesn't just save words. It structures your content into a strict **JSON format**.
2.  **The Engine:** When a reader opens a post, our custom middleware reads that JSON.
3.  **The Output:** The engine dynamically "paints" the HTML on the screen, applying styles and formatting instantly.

---

## How to Install & Run

Follow these steps to get a copy of Blogify running on your local machine.

### Prerequisites
* [Node.js](https://nodejs.org/) installed.
* [MongoDB](https://www.mongodb.com/) installed and running locally.

### Installation Steps

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/shamil-tp/Blogify.git](https://github.com/shamil-tp/Blogify.git)
    cd blogify
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Start the Database**
    Make sure your MongoDB server is running in the background.

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    *(This usually runs the Vite server and Backend concurrently)*

5.  **View the App**
    Open your browser and visit: `http://localhost:3000` (or the port specified in your terminal).

---

## The Team

This project was collaboratively designed and developed by:

* [Shamil](https://github.com/shamil-tp)
* [Sinan](https://github.com/sinanrahman/)
* [Ranfees](https://github.com/Ranfees)