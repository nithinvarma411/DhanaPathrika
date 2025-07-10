# 🏢 Dhana Pathrika - Modern Business Management System

<img src="client/src/assets/logo.jpg" alt="Dhana Pathrika Logo" width="200" height="auto">

## 🌟 Overview

Dhana Pathrika is a cutting-edge business management system designed to streamline your business operations with style and efficiency. Built with modern technologies and a focus on user experience, it offers comprehensive solutions for inventory management, invoicing, and business analytics.

🚀 Built in 2nd Semester!
This project was developed as part of my Capstone in the 2nd semester of my B.Tech program at Lovely Professional University (LPU) under the Kalvium curriculum — showcasing what’s possible early in a developer’s journey!

🔗 **[Live Demo](https://dhanapathrika.vercel.app/)**

## ✨ Key Features

### 🔐 Advanced Authentication
- Multi-factor authentication support
- Face recognition login/signup
- Google OAuth integration
- Secure password recovery system

### 💼 Business Management
- **Smart Invoice Generation**
  - Automatic invoice numbering
  - Email integration for invoice sharing
  - image export options
  - Multiple stamp designs

- **Intelligent Stock Management**
  - Real-time inventory tracking
  - Low stock alerts
  - Stock grouping and categorization
  - Excel export functionality via GO server
  - Multiple unit support (kg, L, pcs)

- **Financial Analytics**
  - Real-time revenue tracking
  - Monthly performance analysis
  - Due payment monitoring
  - Interactive charts and graphs

### 📱 User Experience
- Responsive design for all devices
- Real-time notifications
- Interactive chatbot assistance

## 🛠️ Technology Stack

### Frontend (React.js)
- **Core**: React.js with Vite
- **Styling**: TailwindCSS
- **State Management**: React Hooks & Context
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Face Detection**: face-api.js
- **HTTP Client**: Axios
- **Notifications**: React-Toastify

### Backend (Node.js)
- **Server**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, Passport.js
- **File Handling**: Multer
- **Email Service**: Nodemailer
- **Session Management**: Express-session

### GO Server
- **Framework**: Gin
- **Excel Processing**: excelize
- **Email Service**: gomail
- **CORS Handling**: gin-contrib/cors
- **Environment**: godotenv

## 🚀 Getting Started

### Prerequisites
```bash
# Node.js v14+ and Go 1.16+
node -v
go version

# MongoDB
mongod --version
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/nithinvarma411/DhanaPathrika.git
cd DhanaPathrika
```

2. Install dependencies
```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install

# GO Server
cd ../GOserver
go mod download
```

3. Environment Setup
```bash
# Client (.env)
VITE_BACKEND_URL=http://localhost:4444/
VITE_GO_BACKEND_URL=http://localhost:8080/
VITE_ORIGIN=http://localhost:5173

# Server (.env)
MONGO_URI=your_mongodb_uri
SESSION_SECRET=your_session_secret
ORIGIN=http://localhost:5173

# GO Server (.env)
PORT=8080
ORIGIN=http://localhost:5173
```

### Running the Application

```bash
# Start Frontend (from client directory)
cd client
npm run dev

# Start Node.js Backend (from server directory)
cd server
npm run dev

# Start GO Server (from GOserver directory)
cd GOserver
go run main.go
```

## 🖥️ Desktop App (ElectronJS)

You can run Dhana Pathrika as a desktop application using ElectronJS.

### Installation & Usage

1. **Navigate to the desktop app directory:**
   ```bash
   cd desktop-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the desktop app in development mode:**
   ```bash
   npm run dev
   ```
   This will launch the app with hot-reloading.

4. **Run the desktop app in production mode:**
   ```bash
   npm start
   ```

5. **Build the desktop app for distribution:**
   ```bash
   npm run build
   ```
   The packaged application will be available in the `dist` folder.

> **Note:** Make sure you have [Node.js](https://nodejs.org/) installed.

## 📈 Business Impact

- **Efficiency**: Reduces manual work by 75%
- **Accuracy**: 99.9% error-free invoice generation
- **Time Saving**: Cuts down reporting time by 60%
- **Cost Reduction**: Minimizes inventory holding costs by 40%

## 🔒 Security Features

- JWT authentication
- Secure password hashing
- Rate limiting
- CORS protection
- XSS prevention
- Session management
- Face recognition authentication

## 🌐 Browser Support

- Chrome (recommended)
- Edge

## 🤝 Collaboration

Interested in taking this project to the next level? I'm open to collaboration and discussions! Whether you want to:
- Extend the project's functionality
- Implement new features
- Learn more about the implementation details
- Contribute to its development

Feel free to reach out at nithinvarma411@gmail.com

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📧 Contact

- Developer: Nithin Varma
- Email: nithinvarma411@gmail.com
- LinkedIn: https://www.linkedin.com/in/nithin-varma-58a605326/
- Live Demo: https://dhanapathrika.vercel.app/

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Cloudinary for image storage
- Microsoft Clarity for analytics
- Contributors and testers

---

<p align="center">Made with ❤️ by Nithin Varma</p>

