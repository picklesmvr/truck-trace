# TruckTrace - Food Truck Location Sharing Platform

<div align="center">

🚛 **Connecting communities through food, one location at a time**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

[Features](#-features) • [Quick Start](#-quick-start) • [Deployment](#-deployment-guide) • [Documentation](#-project-structure) • [Contributing](#-contributing)

</div>

---

## 📖 Overview

**TruckTrace** is a comprehensive web platform that connects food truck owners with hungry customers through real-time location sharing, menu discovery, and community engagement.

### 🌟 Features

<table>
<tr>
<td width="50%">

#### For Customers 👥
- 🗺️ **Real-time Location Tracking** - Never miss your favorite food truck again
- 📍 **Interactive Maps** - Google Maps integration with truck markers
- 🔍 **Advanced Search & Filtering** - Find trucks by cuisine, distance, rating
- ⭐ **Favorites System** - Save your favorite trucks and get notifications
- 📱 **Mobile Responsive** - Works perfectly on all devices

</td>
<td width="50%">

#### For Food Truck Owners 🚛
- 🏢 **Easy Location Updates** - One-click location broadcasting
- 📋 **Menu Management** - Complete CRUD for menu items and pricing
- 📊 **Customer Analytics** - Track views, favorites, and engagement
- 💬 **Customer Direct Communication** - Built-in contact features

</td>
</tr>
</table>

---

## 🏗️ Technical Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 TruckTrace Platform                     │
├─────────────────────────────────────────────────────────┤
│  Frontend (React + Vite + Tailwind)                     │
│  • Customer Dashboard with Map/List Views               │
│  • Truck Profile Pages with Menu Display                │
│  • Owner Dashboard for Truck Management                 │
│  • Authentication System (JWT)                          │
│  • Real-time Geolocation                                │
├─────────────────────────────────────────────────────────┤
│  Backend (Node.js + Express + PostgreSQL)               │
│  • RESTful API with Validation                          │
│  • PostgreSQL with PostGIS for Geospatial               │
│  • JWT Authentication & Role Management                 │
│  • File Upload with Cloudinary                          │
│  • Rate Limiting & Security                             │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18+ and npm
- PostgreSQL 12+ with PostGIS extension
- Google Maps API key
- Cloudinary account (for image uploads)

---

### 1️⃣ Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-username/truck-trace.git
cd truck-trace

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### 2️⃣ Environment Setup

#### Backend Environment

Create `backend/.env` with:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/trucktrace
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
CLOUDINARY_URL=your-cloudinary-url
NODE_ENV=development
PORT=3001
```

#### Frontend Environment

Create `frontend/.env` with:

```env
VITE_API_URL=http://localhost:3001/api
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
```

---

### 3️⃣ Database Setup

```bash
# Create database with PostGIS extension
createdb trucktrace
psql trucktrace
CREATE EXTENSION postgis;

# Run migrations (automatically creates all tables)
cd backend
npm run migrate
```

---

### 4️⃣ Start the Application

```bash
# Start backend (in backend folder)
npm run dev

# Start frontend (in frontend folder, new terminal)
cd ../frontend
npm run dev
```

**Access the application:**

- 🌐 **Frontend**: http://localhost:3000
- 📡 **Backend API**: http://localhost:3001/api
- 💚 **Health Check**: http://localhost:3001/health

---

## 🔑 Getting API Keys

### Google Maps API Key

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Go to "APIs & Services" → "Library"
4. Enable "Maps JavaScript API" and "Places API"
5. Go to "Credentials" → "Create Credentials" → "API Key"
6. Copy the API key to your `.env` files

### Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard → Settings → Upload
3. Copy your "Cloud name" from the account details
4. Generate API keys in "Security" section
5. Add Cloudinary URL to backend `.env`

---

## 🚀 Deployment Guide

### Option 1: Railway (Recommended) 🚂

#### Backend + Database Deployment

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Deploy backend
cd backend
railway up

# 4. Add PostgreSQL database
railway add postgresql

# 5. Set environment variables in Railway dashboard
# Add all variables from backend/.env

# 6. Run migrations
railway run npm run migrate
```

#### Frontend Deployment

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy frontend
cd frontend
vercel --prod
```

---

### Option 2: Manual Docker Setup 🐳

```bash
# Build Docker images
docker build -t trucktrace-backend ./backend
docker build -t trucktrace-frontend ./frontend

# Run with Docker Compose
docker-compose up -d
```

---

## 💻 Local Development Workflow

### Daily Development Commands

```bash
# Start both frontend and backend together
npm run dev:all    # Starts both services

# Run tests
npm test             # Run all tests
npm run test:watch   # Watch mode

# Code quality
npm run lint          # Check code style
npm run lint:fix      # Fix auto-fixable issues

# Database operations
npm run migrate        # Run migrations
npm run seed          # Add sample data
```

### Development Tips

- 🔄 **Hot Reload**: Both frontend and backend auto-restart on file changes
- 🐛 **Debug Mode**: Frontend runs with React DevTools, backend logs detailed requests
- 📝 **Database Seeding**: Use `npm run seed` to populate with sample data
- 🔧 **Environment**: Variables are loaded automatically from `.env` files

---

## 🧪 Troubleshooting

<details>
<summary><strong>❌ Database Connection Errors</strong></summary>

```bash
# Check PostgreSQL is running
brew services list | grep postgresql

# Reset database
dropdb trucktrace && createdb trucktrace
npm run migrate
```
</details>

<details>
<summary><strong>❌ Port Already in Use</strong></summary>

```bash
# Find what's using port 3000
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000 -xargs)
```
</details>

<details>
<summary><strong>❌ Google Maps Not Loading</strong></summary>

1. Verify API key is correct and enabled
2. Check browser console for specific error messages
3. Ensure billing is enabled in Google Cloud Console
</details>

<details>
<summary><strong>❌ CORS Issues</strong></summary>

```bash
# Verify frontend URL is whitelisted in backend
# Check environment variables are set correctly
# Restart both services after .env changes
```
</details>

---

## 📁 Project Structure

```
truck-trace/
├── frontend/                 # React.js web application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API calls and external services
│   │   ├── contexts/        # React contexts for state management
│   │   ├── utils/           # Helper functions
│   │   └── styles/          # CSS/Tailwind styles
│   ├── public/               # Static assets
│   ├── package.json
│   └── vite.config.js       # Build configuration
│
├── backend/                 # Node.js Express API server
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API route definitions
│   │   ├── middleware/      # Express middleware
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions
│   │   └── config/          # Configuration files
│   ├── database/            # Database migrations and seeds
│   └── package.json
│
└── docs/                   # Documentation
```

---

## 🛠️ Available Scripts

### Backend Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Production server |
| `npm run dev` | Development with nodemon |
| `npm test` | Run test suite |
| `npm run migrate` | Run database migrations |
| `npm run seed` | Populate with sample data |

### Frontend Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Preview production build |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview built app |
| `npm run lint` | ESLint code checking |
| `npm run lint:fix` | Auto-fix ESLint issues |

---

## 🔧 Configuration

### Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Secret key for JWT tokens |
| `GOOGLE_MAPS_API_KEY` | ✅ | Google Maps JavaScript API key |
| `CLOUDINARY_URL` | ✅ | Cloudinary cloud URL for image uploads |
| `NODE_ENV` | ✅ | Environment (development/production) |
| `PORT` | ✅ | Backend server port |

---

## 🔒 Security Features

- ✅ **JWT Authentication** with refresh tokens
- ✅ **Input Validation** with express-validator
- ✅ **Rate Limiting** to prevent abuse
- ✅ **CORS Protection** with configured origins
- ✅ **SQL Injection Prevention** with parameterized queries
- ✅ **XSS Protection** with content security policy
- ✅ **Password Hashing** with bcrypt

---

## 📊 Performance Optimizations

- ⚡ **Code Splitting** - Routes loaded on demand
- ⚡ **Image Optimization** - Lazy loading and WebP support
- ⚡ **Database Indexing** - Spatial indexes for location queries
- ⚡ **API Caching** - Response compression and caching
- ⚡ **Bundle Optimization** - Tree shaking and minification

---

## 📱 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | Latest 2 | ✅ Full |
| Firefox | Latest 2 | ✅ Full |
| Safari | Latest 2 | ✅ Full |
| Edge | Latest 2 | ✅ Full |
| Mobile | iOS 12+, Android 8+ | ✅ Full |

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with clear, descriptive commits
4. **Run tests**: `npm test`
5. **Push your branch**: `git push origin feature/amazing-feature`
6. **Create a Pull Request** with detailed description

### Development Standards

- 📝 Follow ES6+ and React best practices
- 🎨 Use Tailwind CSS for styling
- 📱 Ensure mobile responsiveness
- 🧪 Write tests for new features
- 📝 Keep documentation updated

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support & Community

<div align="center">

| Channel | Link |
|---------|------|
| 📧 **Issues** | [GitHub Issues](https://github.com/your-username/truck-trace/issues) |
| 💬 **Discussions** | [GitHub Discussions](https://github.com/your-username/truck-trace/discussions) |
| 📧 **Email** | support@trucktrace.app |
| 📱 **Twitter** | [@trucktrace](https://twitter.com/trucktrace) |

</div>

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.dev/chart.svg?repo=your-username/truck-trace&type=Date)](https://star-history.com/#your-username/truck-trace&Date)

---

<div align="center">

**Built with ❤️ by the TruckTrace team**

*Connecting communities through food, one location at a time* 🚛

</div>
