# Fire Warden Tracker - Quick Start Guide

## Getting Started in 5 Minutes

### 1. Install Dependencies (First Time Only)
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Database
Edit `server/.env` with your Azure SQL Database password:
```env
DB_PASSWORD=YourActualPassword
```

### 3. Start the Application

**Terminal 1 - Start Backend:**
```bash
cd server
node index.js
```

You should see:
```
✅ SERVER FILE LOADED
✅ Server listening on http://localhost:5000
✅ Connected to Azure SQL Database
✅ Database tables initialized
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm start
```

Application will open at: **http://localhost:3000**

---

## Features Overview

### Check-In Tab
- Fire wardens can log their working location
- All fields are required
- Instant feedback with toast notifications
- Large, accessible form controls

### Dashboard Tab
- View all current fire warden locations
- Shows active count badge
- Edit existing check-ins
- Delete check-ins with confirmation
- Responsive table that scrolls on mobile

---

## Key Improvements (New UI)

### ✅ Accessibility
- WCAG 2.1 Level AA compliant
- Full keyboard navigation
- Screen reader compatible
- High contrast colors
- Clear focus indicators

### ✅ Modern Design
- Professional Chakra UI components
- Card-based layout
- Clean, modern interface
- Consistent spacing and colors
- University-appropriate styling

### ✅ Better UX
- Toast notifications for feedback
- Loading spinners
- Icon buttons with tooltips
- Large touch targets (mobile-friendly)
- Hover states on interactive elements

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check server status |
| GET | `/api/locations` | Get all fire warden locations |
| GET | `/api/checkins` | Get all check-ins |
| POST | `/api/checkins` | Create new check-in |
| PUT | `/api/checkins/:id` | Update check-in |
| DELETE | `/api/checkins/:id` | Delete check-in |

---

## Testing the Connection

```bash
cd server
node test-connection.js
```

Should show:
```
✅ Successfully connected to Azure SQL Database!
✅ Test 1: PASSED
✅ Test 2: PASSED
✅ Test 3: PASSED
✅ Test 4: PASSED
✅ Test 5: PASSED
```

---

## Common Issues

### Issue: Connection Timeout
**Solution:** Check Azure SQL firewall rules - add your IP address

### Issue: Login Failed
**Solution:** Verify DB_PASSWORD in `server/.env` file

### Issue: Table Already Exists Error
**Solution:** This is normal! The server handles existing tables gracefully

### Issue: Port Already in Use
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill
```

---

## Project Structure

```
fire-warden-tracker/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.js         # Main application (Chakra UI)
│   │   └── index.js       # React entry point (ChakraProvider)
│   └── package.json
│
├── server/                # Node.js backend
│   ├── index.js          # Express server + Azure SQL
│   ├── test-connection.js # Connection test script
│   ├── .env              # Database credentials (not in git)
│   └── package.json
│
├── database-setup.sql     # SQL setup script
└── Documentation files    # Comprehensive guides
```

---

## Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview |
| `QUICK-START.md` | This file - quick start guide |
| `CONNECTION-SUMMARY.md` | Azure connection summary |
| `AZURE-CONNECTION-GUIDE.md` | Detailed Azure setup |
| `DATABASE-SETUP-INSTRUCTIONS.md` | SQL database setup |
| `ACCESSIBILITY-WCAG-COMPLIANCE.md` | Accessibility details |
| `DESIGN-SYSTEM.md` | Chakra UI design system |
| `UI-UPGRADE-SUMMARY.md` | Complete upgrade details |

---

## Technology Stack

### Frontend
- **React 19** - UI framework
- **Chakra UI 2.x** - Component library
- **Emotion** - CSS-in-JS
- **Framer Motion** - Animations

### Backend
- **Node.js** - Runtime
- **Express 5** - Web framework
- **mssql** - Azure SQL Database driver
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing

### Database
- **Azure SQL Database** - Cloud database
- **Microsoft SQL Server** - Database engine

---

## Development Commands

### Backend
```bash
# Start server
npm start

# Test database connection
node test-connection.js
```

### Frontend
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

---

## Deployment Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] Database connection working
- [ ] Environment variables configured
- [ ] Build completes successfully
- [ ] Accessibility audit passed (90+ score)

### Azure Deployment
- [ ] Create Azure App Service
- [ ] Configure environment variables
- [ ] Deploy backend and frontend
- [ ] Configure custom domain (optional)
- [ ] Enable HTTPS
- [ ] Test production deployment

### Post-deployment
- [ ] Monitor application logs
- [ ] Check database connections
- [ ] Verify all features work
- [ ] Test on multiple devices
- [ ] Gather user feedback

---

## Support

### Getting Help
1. Check documentation files
2. Review error messages in console
3. Run connection test script
4. Check Azure Portal for database status
5. Review GitHub issues (if repository is public)

### Resources
- [Node.js Docs](https://nodejs.org/docs)
- [React Docs](https://react.dev)
- [Chakra UI Docs](https://chakra-ui.com)
- [Azure SQL Docs](https://docs.microsoft.com/azure/sql-database)
- [Express Docs](https://expressjs.com)

---

## Tips for Success

### Development
1. Always start backend before frontend
2. Check console for errors
3. Use browser DevTools for debugging
4. Test on multiple browsers
5. Test keyboard navigation

### Database
1. Regularly backup your database
2. Monitor connection pool usage
3. Check query performance
4. Review error logs
5. Keep credentials secure

### Accessibility
1. Test with keyboard only
2. Use screen reader for testing
3. Check color contrast
4. Verify ARIA labels
5. Run Lighthouse audits regularly

---

## Next Steps

1. ✅ Review `UI-UPGRADE-SUMMARY.md` for complete feature list
2. ✅ Check `ACCESSIBILITY-WCAG-COMPLIANCE.md` for accessibility details
3. ✅ Review `DESIGN-SYSTEM.md` to understand the design
4. ✅ Test the application thoroughly
5. ✅ Customize colors to match University branding (if needed)
6. ✅ Deploy to Azure
7. ✅ Share with stakeholders

---

## Quick Reference

### Environment Variables (server/.env)
```env
PORT=5000
DB_SERVER=firewarden-sql-watkinson.database.windows.net
DB_PORT=1433
DB_DATABASE=firewarden_db
DB_USER=firewarden_admin@firewarden-sql-watkinson
DB_PASSWORD=YourPassword
```

### Package.json Scripts
```json
// Backend (server/package.json)
"start": "node index.js"

// Frontend (client/package.json)
"start": "react-scripts start"
"build": "react-scripts build"
"test": "react-scripts test"
```

---

**You're ready to go! 🚀**

Start the backend and frontend, then open http://localhost:3000 to see your modern, accessible Fire Warden Tracker!
