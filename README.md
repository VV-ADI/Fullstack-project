# Charmender Zone

A full-stack **MERN** application for location-based public safety that tracks user location in real-time, displays containment/restricted zones on an interactive map, and triggers alerts when a user approaches or enters a restricted area.

## Tech Stack

- **Frontend:** React.js, Leaflet.js (react-leaflet), TailwindCSS, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken), bcrypt.js
- **Location:** Browser Geolocation API
- **Notifications:** In-app toast alerts (react-toastify)

## Features

- 🗺️ **Interactive Map** - Real-time map with containment zones displayed as color-coded circles
- 📍 **Real-time Location Tracking** - Continuous monitoring of user position
- 🚨 **Proximity Alerts** - Toast notifications when approaching a zone (200m buffer)
- ⚠️ **Entry Alerts** - Modal warnings when entering a restricted zone
- 👤 **User Authentication** - JWT-based login/registration with role-based access
- 🛡️ **Admin Dashboard** - Create, edit, and delete containment zones
- 📊 **Alert History** - View and manage triggered alerts

## Project Structure

```
charmender-zone/
├── client/                          # React frontend
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Map/                 # Map components
│   │   │   ├── Alerts/              # Alert components
│   │   │   ├── Admin/               # Admin dashboard
│   │   │   ├── Auth/                # Login/Register
│   │   │   └── Layout/              # Navbar, PrivateRoute
│   │   ├── context/                 # React Context providers
│   │   ├── hooks/                   # Custom hooks
│   │   ├── services/                # API service
│   │   └── utils/                   # Utility functions
│   └── package.json
│
├── server/                          # Node.js backend
│   ├── config/                      # Database config
│   ├── controllers/                 # Route controllers
│   ├── middleware/                  # Auth & role middleware
│   ├── models/                      # Mongoose models
│   ├── routes/                      # API routes
│   ├── services/                    # Business logic
│   ├── .env                         # Environment variables
│   └── server.js                    # Entry point
│
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Setup Instructions

### 1. Clone the repository

```bash
cd charmender-zone
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your MongoDB URI and JWT secret

# Start the server
npm run dev
```

### 3. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 4. Environment Variables

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/containment_zone_db
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

## API Routes

### Authentication - `/api/auth`

| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login + receive JWT | Public |
| GET | `/api/auth/me` | Get current user profile | Protected |

### Zones - `/api/zones`

| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| GET | `/api/zones` | Fetch all containment zones | Protected |
| GET | `/api/zones/:id` | Fetch single zone by ID | Protected |
| POST | `/api/zones` | Create a new zone | Admin only |
| PUT | `/api/zones/:id` | Update a zone | Admin only |
| DELETE | `/api/zones/:id` | Delete a zone | Admin only |

### Alerts - `/api/alerts`

| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| GET | `/api/alerts` | Get all alerts (admin) or user's alerts | Protected |
| POST | `/api/alerts` | Create alert when user enters zone | Protected |
| PATCH | `/api/alerts/:id` | Update alert status (dismiss) | Protected |

## Usage

1. **Register** as a new user or admin
2. **Grant location permission** when prompted
3. **View the map** with your current location and containment zones
4. **Receive alerts** when approaching or entering zones
5. **Admin users** can manage zones via the Admin Dashboard

## Severity Levels

| Level | Color | Description |
|-------|-------|-------------|
| Low | 🟢 Green | Minimal risk areas |
| Medium | 🟡 Yellow | Moderate caution required |
| High | 🟠 Orange | High risk - avoid if possible |
| Critical | 🔴 Red | Extreme danger - do not enter |

## License

ISC
