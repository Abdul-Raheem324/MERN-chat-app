# QualityConnect (MERN-chat-app)

A **real-time chat application** built with the **MERN** (MongoDB, Express.js, React, Node.js) stack. This app allows users to chat in one-on-one and group chats, receive notifications, and more. Additionally, the app integrates **AI-powered entertainment** features for a unique experience. With a smooth UI, real-time features, and robust functionality, this chat app is designed for seamless communication.

## Features

### 🔒 User Authentication
- **Secure Login & Registration**: Users can sign up and log in using JWT-based authentication, keeping their accounts secure.
- **Email Verification**: Upon registration, users will receive a verification email via Nodemailer to confirm their email address before they can start using the app.

### 💬 One-to-One Chat
- **Real-time Messaging**: Engage in direct, real-time one-on-one conversations with other users. Messages are instantly delivered with no need for page refreshes.

### 👥 Group Chats
- **Create and Manage Groups**: Users can create their own group chats, add or remove members, and rename the group.
- **Group Management**: Administrators have the ability to manage group members, ensuring smooth group interactions.

### 🤖 AI Integration for Entertainment
- **AI-powered Conversations**: The app includes a fun AI (QualityConnect AI) integration that generates entertainment to make your chat experience enjoyable.

### 🔔 Real-time Notifications
- **Instant Alerts**: Receive push notifications for new messages or activity in your chats. Stay connected with real-time alerts for all important updates.

### ✏️ User Profile Management
- **Update Username**: Users can easily update their username at any time to keep their profile fresh.

### ⌨️ Typing Indicator
- **See Who’s Typing**: Get live updates on who is typing in a conversation, making the chat experience more interactive and engaging.

## Technologies Used

- **Frontend**: 
  - **React** for building the user interface.
  - **Socket.IO** for real-time communication.
  
- **Backend**: 
  - **Node.js** and **Express.js** for creating the server-side API.
  - **Socket.IO** for real-time messaging and push notifications.
  - **JWT (JSON Web Tokens)** for user authentication and secure communication.
  
- **Database**: 
  - **MongoDB** for storing user data, chat messages, and other application data. Mongoose is used for schema modeling.
  
- **Email Service**: 
  - **Nodemailer** to send email verification links to users after registration.
  
- **File Storage**: 
  - **Multer** for file handling and uploading.

- **Security**: 
  - **JWT** for secure authentication.

---

## Live Link

You can view the live version of the app here:

[Live Demo - QualityConnect Chat App](https://qualityconnect.onrender.com)

---

## Screenshots

Here are some screenshots of the app in action:

### Login Page
![Login Page](assets/login%20chat-app.PNG)  
*The login page where users can sign in or register.*

### Home Page
![Home Page](assets/home%20page.PNG)  
*The home page where users can see their chat interface and start new conversations.*

### AI Chat
![AI Chat](assets/Ai%20chat.PNG)  
*The AI-powered chat feature where users can engage in fun and interactive conversations with the AI.*

### Creating Group Chat
![Creating Group Chat](assets/grp%20chat.PNG)  
*A screenshot showing how users can create a new group chat and manage members.*

---

## Installation

### Prerequisites

Make sure the following software is installed:

- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/)
- [npm](https://www.npmjs.com/) (Node Package Manager)

### Steps to Run the Application

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Abdul-Raheem324/MERN-chat-app.git
   cd MERN-chat-app


2. **Install Backend Dependencies**:
   ```bash
   npm install

3. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install

4. **Run the Backend**:
   ```bash
   node backend/server.js

5. **Run the Frontend**:
   ```bash
   npm run dev

6. **Access the App**:
   - Open your browser and go to http://localhost:3000 to access the app.







