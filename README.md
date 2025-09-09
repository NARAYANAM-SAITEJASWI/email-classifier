# 📧 Smart Email Verifier

A full-stack email verification and analytics application built with Express.js, MongoDB, and a modern frontend.

## ✨ Features

### Backend API
- **Email Verification** - Format validation, MX record lookup, disposable email detection
- **Email Sending** - Simulate sending emails with tracking
- **Open Tracking** - Track when emails are opened
- **Analytics Dashboard** - Real-time statistics and metrics

### Frontend
- **Modern UI** - Responsive design with beautiful gradients
- **Real-time Verification** - Instant email validation results
- **Email Management** - Send and track emails
- **Analytics View** - Visual dashboard with statistics

## 🚀 Quick Deploy to Render

### Option 1: One-Click Deploy
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

### Option 2: Manual Deploy
1. **Fork this repository**
2. **Go to [Render](https://render.com)**
3. **Connect your GitHub repository**
4. **Configure:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node
5. **Add environment variables:**
   - `NODE_ENV=production`
   - `MONGODB_URI=your_mongodb_connection_string`
6. **Deploy!**

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Use as `MONGODB_URI` environment variable

### Local MongoDB
```bash
# Install MongoDB locally
# Then use: mongodb://localhost:27017/smart-email-verifier
```

## 🛠️ Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/NARAYANAM-SAITEJASWI/email-classifier.git
   cd email-classifier
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI
   ```

4. **Start MongoDB:**
   ```bash
   mongod --dbpath ./data --port 27017
   ```

5. **Run the application:**
   ```bash
   npm run dev
   ```

6. **Open in browser:**
   ```
   http://localhost:3000
   ```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/verify` | Verify email address |
| `POST` | `/api/send` | Send email |
| `GET` | `/api/open/:id` | Mark email as opened |
| `GET` | `/api/analytics` | Get analytics data |

## 🎯 Usage Examples

### Verify Email
```bash
curl -X POST http://localhost:3000/api/verify \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com"}'
```

### Send Email
```bash
curl -X POST http://localhost:3000/api/send \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","subject":"Hello","body":"Test message"}'
```

### Get Analytics
```bash
curl http://localhost:3000/api/analytics
```

## 🏗️ Project Structure

```
smart-email-verifier/
├── src/
│   ├── index.js          # Main server file
│   ├── routes.js         # API routes
│   └── models/
│       └── Email.js      # MongoDB model
├── public/
│   ├── index.html        # Frontend HTML
│   ├── style.css         # Styling
│   └── script.js         # Frontend JavaScript
├── package.json          # Dependencies
├── render.yaml           # Render deployment config
└── README.md             # This file
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/smart-email-verifier` |

## 🚀 Deployment Platforms

- **Render** - [render.com](https://render.com) (Recommended)
- **Railway** - [railway.app](https://railway.app)
- **Heroku** - [heroku.com](https://heroku.com)
- **Vercel** - [vercel.com](https://vercel.com)

## 📝 License

MIT License - feel free to use this project for learning and development!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Built with ❤️ using Express.js, MongoDB, and modern web technologies**
