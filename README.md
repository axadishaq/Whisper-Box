# <img src="./public/whisperBox.png" alt="Whisper Box" width="40" height="40" /> Whisper Box - Mysterious Messaging

![Whisper Box Banner](https://img.shields.io/badge/Whisper_Box-Messaging_Platform-98CCD3?style=for-the-badge&logo=comments&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15.4.2-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-4.5.4-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4.4.6-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Responsive](https://img.shields.io/badge/Responsive-Yes-111111?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

Whisper Box is a cutting-edge messaging application built with Next.js that provides seamless communication with modern UI/UX design and robust functionality.

## 🚀 Features

### ✨ Core Functionality
- **🔐 Secure Authentication** - Full user registration, login, and email verification system
- **💬 Real-time Messaging** - Send and receive messages instantly
- **📊 Analytics Dashboard** - Visual statistics with charts and metrics
- **👤 Custom User Profiles** - Personalized URLs for each user (`/u/username`)
- **📱 Responsive Design** - Works seamlessly across all devices

### 🎯 Advanced Features
- **Message Management** - Accept, delete, and organize messages
- **User Statistics** - Track message counts and engagement metrics
- **Email Notifications** - Verification emails via Resend
- **Modern UI Components** - Built with shadcn/ui for consistent design

## 📸 Application Preview

*(Screenshots would be added here showing the dashboard, messaging interface, and user profiles)*

## 🛠️ Technology Stack

### 🏗️ Core Framework
![Next.js](https://img.shields.io/badge/Next.js-15.4.2-000000?style=flat&logo=next.js&logoColor=white) 
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-4.5.4-007ACC?style=flat&logo=typescript&logoColor=white)

### 🗄️ Database & Storage
![MongoDB](https://img.shields.io/badge/MongoDB-4.4.6-47A248?style=flat&logo=mongodb&logoColor=white)

### 🔐 Authentication & Services
![NextAuth.js](https://img.shields.io/badge/NextAuth.js-4.24.11-000000?style=flat&logo=next.js&logoColor=white)
![Resend](https://img.shields.io/badge/Resend-6.0.1-FF6B6B?style=flat&logo=mailgun&logoColor=white)

### 🎨 UI Components
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-0.8.0-000000?style=flat&logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=flat&logo=tailwind-css&logoColor=white)


## 🎮 Usage

### Getting Started
1. **Sign Up** - Create a new account with email verification or with GOOGLE
2. **Customize Profile** - Set up your unique username and profile
3. **Share Your Link** - Share your profile URL (`/u/yourusername`) with others
4. **Send Messages** - Start receiving and managing messages

### Key Routes
- `/` - Home page
- `/signup` - User registration
- `/login` - User login
- `/dashboard` - User dashboard with analytics
- `/messages` - Message management
- `/u/[username]` - Public user profile
- `/setting` - User profile settings

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── chat/          # Chat functionality
│   │   └── messages/      # Message management
│   ├── dashboard/         # User dashboard
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── u/[username]/      # User to send message
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── providers/        # Context providers
├── context/              # React context
├── lib/                  # Utility libraries
├── models/               # Database models
├── schemas/              # Validation schemas
└── types/                # TypeScript type definitions
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [issues page](https://github.com/axadishaq/whisper-box/issues)
2. Create a new issue with detailed description
3. Join our community discussions

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team for the amazing framework
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [MongoDB](https://www.mongodb.com/) for reliable database
- [Resend](https://resend.com/) for email services

---

⭐ **Star this repo if you find it useful!**
