# Fire Warden Tracker

Cloud-based fire warden location tracking system for University of Winchester campus safety.

## Live Application

**Production URL:** https://firewarden-tracker.azurewebsites.net

## Features

- User authentication (login/register) with JWT
- Fire warden check-in system with location tracking
- Real-time dashboard showing all active wardens
- Admin panel for user management
- Role-based access control (user/admin)
- WCAG 2.1 AA compliant UI with Chakra UI

## Tech Stack

**Frontend:**
- React 19
- Chakra UI (accessible component library)
- React Router

**Backend:**
- Node.js with Express 5
- Azure SQL Database
- JWT authentication
- bcrypt for password hashing

**Deployment:**
- Azure App Service
- GitHub Actions CI/CD

## Local Development

### Prerequisites
- Node.js 18+
- Azure SQL Database

### Setup

1. Clone the repository
```bash
git clone https://github.com/ManicZ-Z/fire-warden-tracker.git
cd fire-warden-tracker
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables

Create `server/.env` with:
```env
PORT=5000
NODE_ENV=development

# Azure SQL Database
DB_SERVER=your-server.database.windows.net
DB_PORT=1433
DB_DATABASE=your_database_name
DB_USER=your_username@your-server
DB_PASSWORD=your_password

# JWT Secret
JWT_SECRET=your-secret-key-change-this-in-production
```

4. Run development servers

**Terminal 1 - Backend (port 5000):**
```bash
npm run dev:server
```

**Terminal 2 - Frontend (port 3000):**
```bash
npm run dev:client
```

5. Open http://localhost:3000

## Database

The application automatically creates required tables on startup:
- `users` - User accounts with authentication
- `checkins` - Fire warden location check-ins

No manual SQL setup required!

## Deployment

The app automatically deploys to Azure App Service via GitHub Actions when you push to the `main` branch.

### Azure Configuration

Set these environment variables in Azure App Service:
- `NODE_ENV=production`
- `DB_SERVER`, `DB_PORT`, `DB_DATABASE`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login

### Check-ins (Protected)
- `GET /api/checkins` - List all check-ins
- `POST /api/checkins` - Create check-in
- `PUT /api/checkins/:id` - Update check-in
- `DELETE /api/checkins/:id` - Delete check-in

### Admin (Admin Only)
- `GET /api/admin/users` - List all users
- `GET /api/admin/stats` - System statistics
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user

### Utility
- `GET /api/health` - Health check
- `GET /api/locations` - Available locations

## Project Structure

```
fire-warden-tracker/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── App.js         # Main app component
│       ├── Login.js       # Login page
│       ├── Register.js    # Registration page
│       ├── Dashboard.js   # Check-in & dashboard
│       └── Admin.js       # Admin panel
├── server/                # Express backend
│   ├── index.js          # Main server file
│   └── .env.example      # Environment template
├── .github/
│   └── workflows/        # CI/CD configuration
└── package.json          # Root deployment config
```

## License

ISC **
