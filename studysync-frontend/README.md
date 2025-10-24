# StudySync: A Real-time Collaborative MERN Study Platform

## Project Goal & Vision

StudySync is a full-stack MERN (MongoDB, Express.js, React, Node.js) application designed to be a dynamic and engaging collaborative hub for students. The core vision was to create a platform that integrates real-time communication and gamification features with essential study group functionalities, making the learning process more interactive and motivating. This project showcases proficiency in modern web development, particularly in real-time systems, robust backend API design, and professional frontend architecture.

## Live Demo & Repository

* **GitHub Repository:** [https://github.com/Manideep220305/studysync-mern-project](https://github.com/Manideep220305/studysync-mern-project)
* **Live Demo:** *(You will add this link here after we deploy it)*

## Technology Stack

The application is built with a decoupled frontend and backend architecture:

### Frontend
* **React:** For building a responsive, component-based user interface.
* **Vite:** As the fast build tool for the React application.
* **Tailwind CSS:** For efficient and consistent utility-first styling.
* **Socket.IO Client:** Enables real-time, bidirectional communication with the backend.

### Backend
* **Node.js & Express.js:** To create a powerful and scalable RESTful API.
* **MongoDB (with Mongoose ODM):** For flexible NoSQL data storage and object modeling.
* **JSON Web Tokens (JWT):** For secure, stateless user authentication and authorization.
* **Socket.IO:** Powers the real-time messaging capabilities.
* **Cloudinary & Multer:** For handling secure and efficient file uploads and cloud storage.

## Core Features

StudySync offers a comprehensive set of features designed to enhance student collaboration and engagement:

1.  **User Authentication & Authorization:**
    * Secure user registration and login utilizing JWTs for session management.
    * Protected routes ensuring only authenticated users can access core application functionalities.

2.  **Real-Time Group Chat:**
    * Instantaneous message exchange within study groups using WebSocket technology.
    * Users can send and receive messages in real-time, fostering dynamic collaboration.
    * Chat history is persisted in the database and loaded upon entering a group.

3.  **Comprehensive Group Management:**
    * **Create Groups:** Users can create new study groups, which generates a unique invite code.
    * **Join Groups:** Students can join existing groups using an invite code.
    * **Role-Based Actions:** Group owners have the ability to delete groups, while members can opt to leave a group, with appropriate confirmation flows.

4.  **Gamification Engine:**
    * **Task Manager:** A personal to-do list where users can create and mark tasks as complete to earn points.
    * **Study Timer (HH:MM:SS):** A customizable timer with pause and resume functionality. Successfully completing a study session awards points based on the duration.

5.  **Group-Specific Leaderboard:**
    * Displays a dynamic leaderboard showing user rankings within specific study groups.
    * Calculates and highlights the points needed to reach the next rank or to become the top player.

6.  **Professional UI/UX Design:**
    * A clean, modern dark-themed interface built with React and Tailwind CSS.
    * Intuitive navigation with distinct views for the Dashboard, Groups, and Leaderboard.
    * Consistent component design, typography hierarchy, and subtle CSS animations for an engaging user experience.

## Getting Started (Local Development)

To set up and run StudySync on your local machine, follow these steps:

### Prerequisites
* Node.js (v18 or higher)
* MongoDB Atlas Account (or local MongoDB instance)
* Cloudinary Account

### 1. Clone the Repository
```bash
git clone [https://github.com/Manideep220305/studysync-mern-project.git](https://github.com/Manideep220305/studysync-mern-project.git)
cd studysync-mern-project
2. Backend Setup
Navigate to the backend directory:

Bash

cd StudySync
Install dependencies:

Bash

npm install
Create a .env file in the StudySync directory and add your environment variables:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_strong_secret_key_for_jwt
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
Start the backend server:

Bash

npm start
3. Frontend Setup
Open a new terminal and navigate to the frontend directory:

Bash

cd ../studysync-frontend
Install dependencies:

Bash

npm install
Start the frontend development server:

Bash

npm run dev
The frontend will be available at http://localhost:5173.


---

### **Action 2: Push the `README.md` to GitHub**

Now that you've created the file, we just need to add it to your repository.

In your terminal (which should be in the `studysync-project` folder), run these three simple commands:

1.  **Add the new file:**
    ```bash
    git add README.md
    ```

2.  **Commit the change:**
    ```bash
    git commit -m "docs: Add detailed project README"
    ```

3.  **Push it to GitHub:**
    ```bash
    git push origin main
    ```

After this, refresh your GitHub page. Your repository will now have a professional, detailed description that will impress anyone who looks at it.
