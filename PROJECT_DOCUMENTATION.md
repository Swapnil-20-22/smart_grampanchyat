# Smart Gram Panchayat - Complete Documentation

## 📋 Project Overview

A full-stack web application for village governance and administration built with React, FastAPI, and MongoDB.

---

## 🔐 Login Credentials

### Admin Account
- **Email**: `admin@admin.com`
- **Password**: `admin`
- **Role**: Administrator

### Test User Account
- **Email**: `testuser@test.com`
- **Password**: `test123`
- **Role**: User

### Create New User
Users can register via `/register` page

---

## ✨ Features

### User Features
- ✅ User Registration & Login
- ✅ Submit Complaints (with Name, Phone, Address, Category, Title, Description)
- ✅ Apply for Certificates (Income, Residence, Caste, Birth, Death)
- ✅ Track Complaint Status (Pending, In Progress, Resolved)
- ✅ Track Certificate Application Status (Pending, Approved, Rejected)
- ✅ View Bills
- ✅ View Meetings Schedule
- ✅ View Panchayat Members
- ✅ View Notices/Announcements

### Admin Features
- ✅ Admin Dashboard with Analytics
- ✅ View & Manage All Complaints
- ✅ Change Complaint Status
- ✅ View & Manage Certificate Applications
- ✅ Approve/Reject Certificates
- ✅ User Management (View, Change Roles, Delete)
- ✅ Add/Edit/Delete Meetings
- ✅ Post/Delete Notices
- ✅ Reports with Charts (Pie & Bar)
- ✅ Print Reports Feature

---

## 🛠️ Tech Stack

### Frontend
- **React** 18.x
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Shadcn UI** components
- **Axios** for API calls
- **Recharts** for data visualization
- **Framer Motion** for animations
- **Sonner** for toast notifications

### Backend
- **FastAPI** (Python)
- **MongoDB** (Motor async driver)
- **Pydantic** for validation
- **bcrypt** for password hashing
- **PyJWT** for authentication
- **Python 3.11**

---

## 📦 Installation & Setup

### Prerequisites
```bash
# Node.js 16+ and Yarn
node --version
yarn --version

# Python 3.11+
python3 --version

# MongoDB
mongod --version
```

### Backend Setup

1. **Navigate to backend directory**
```bash
cd /app/backend
```

2. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

3. **Environment Variables** (`.env` file)
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=grampanchayat_db
CORS_ORIGINS=*
JWT_SECRET=a7f8d9c6b4e5f3a2d1c9b8e7f6a5d4c3b2e1f0a9d8c7b6e5f4a3d2c1b0a9f8e7d6c5b4a3
ADMIN_EMAIL=admin@admin.com
ADMIN_PASSWORD=admin
FRONTEND_URL=http://localhost:3000
```

4. **Start Backend Server**
```bash
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd /app/frontend
```

2. **Install dependencies**
```bash
yarn install
```

3. **Environment Variables** (`.env` file)
```env
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false
```

4. **Start Frontend**
```bash
yarn start
```

The application will open at `http://localhost:3000`

---

## 🗄️ Database Setup

### MongoDB Collections

1. **users** - User accounts with authentication
2. **complaints** - User complaints with tracking
3. **certificates** - Certificate applications
4. **bills** - Bills for users
5. **meetings** - Panchayat meetings schedule
6. **members** - Panchayat member information
7. **notices** - Announcements and notices

### Seed Data

The application automatically seeds:
- Admin user account
- 6 Panchayat Members
- 5 Sample Bills
- 6 Meetings
- 6 Notices

### Manual Database Operations

```bash
# Connect to MongoDB
mongosh grampanchayat_db

# View all collections
show collections

# Count documents
db.users.countDocuments()
db.complaints.countDocuments()

# Clear specific collection
db.complaints.deleteMany({})

# View all users
db.users.find({}, {password_hash: 0})
```

---

## 🔗 API Endpoints

### Base URL
- **Development**: `http://localhost:8001`
- **Production**: `https://your-app.preview.emergentagent.com`

### Authentication Endpoints

```bash
# Register new user
POST /api/auth/register
Body: {
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}

# Login
POST /api/auth/login
Body: {
  "email": "user@example.com",
  "password": "password123"
}

# Get current user
GET /api/auth/me

# Logout
POST /api/auth/logout
```

### User Endpoints

```bash
# Get all complaints (user sees only their own, admin sees all)
GET /api/complaints

# Submit complaint
POST /api/complaints
Body: {
  "title": "Complaint Title",
  "description": "Details",
  "complainant_name": "Name",
  "phone": "+91 1234567890",
  "address": "Address",
  "category": "Water Supply"
}

# Get certificates
GET /api/certificates

# Apply for certificate
POST /api/certificates
Body: {
  "certificate_type": "Income Certificate",
  "details": "Details",
  "applicant_name": "Name",
  "father_name": "Father Name",
  "address": "Address",
  "phone": "+91 1234567890",
  "aadhar_number": "123456789012",
  "purpose": "Bank loan"
}

# Get bills
GET /api/bills

# Get meetings
GET /api/meetings

# Get members
GET /api/members

# Get notices
GET /api/notices
```

### Admin Endpoints

```bash
# Get admin reports
GET /api/admin/reports

# Get all users
GET /api/admin/users

# Update user role
PATCH /api/admin/users/{user_id}/role
Body: { "role": "admin" }

# Delete user
DELETE /api/admin/users/{user_id}

# Update complaint status
PATCH /api/complaints/{complaint_id}/status
Body: { "status": "In Progress" }

# Update certificate status
PATCH /api/certificates/{certificate_id}/status
Body: { "status": "Approved" }

# Create meeting
POST /api/admin/meetings
Body: {
  "title": "Meeting Title",
  "agenda": "Agenda",
  "date": "2026-03-15T14:00:00",
  "location": "Location",
  "status": "Upcoming"
}

# Update meeting
PATCH /api/admin/meetings/{meeting_id}

# Delete meeting
DELETE /api/admin/meetings/{meeting_id}

# Create notice
POST /api/admin/notices
Body: {
  "title": "Notice Title",
  "content": "Content",
  "priority": "High"
}

# Delete notice
DELETE /api/admin/notices/{notice_id}
```

---

## 🚀 Running the Application

### Using Supervisor (Production)

```bash
# Start all services
sudo supervisorctl start all

# Restart backend
sudo supervisorctl restart backend

# Restart frontend
sudo supervisorctl restart frontend

# Check status
sudo supervisorctl status

# View logs
tail -f /var/log/supervisor/backend.err.log
tail -f /var/log/supervisor/frontend.out.log
```

### Manual Start

```bash
# Terminal 1 - Backend
cd /app/backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Terminal 2 - Frontend
cd /app/frontend
yarn start
```

---

## 📁 Project Structure

```
/app
├── backend/
│   ├── server.py              # Main FastAPI application
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
│
├── frontend/
│   ├── public/                # Static files
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── ui/           # Shadcn UI components
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Landing.js
│   │   │   ├── DashboardLayout.js
│   │   │   ├── DashboardOverview.js
│   │   │   ├── Complaints.js
│   │   │   ├── Certificates.js
│   │   │   ├── Bills.js
│   │   │   ├── Meetings.js
│   │   │   ├── Members.js
│   │   │   ├── Notices.js
│   │   │   ├── AdminReports.js
│   │   │   ├── AdminUsers.js
│   │   │   ├── AdminMeetings.js
│   │   │   └── AdminNotices.js
│   │   ├── context/
│   │   │   └── AuthContext.js  # Authentication context
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env
│
└── memory/
    └── test_credentials.md    # Test credentials
```

---

## 🎨 Design System

### Colors
- **Primary**: `#2D4238` (Moss Green)
- **Accent**: `#C84B31` (Terracotta)
- **Secondary**: `#D97736` (Warm Orange)
- **Success**: `#3A654D` (Forest Green)
- **Background**: `#FAFAFA` (Light Gray)
- **Text**: `#1A1A1A` (Near Black)

### Fonts
- **Headings**: Cabinet Grotesk
- **Body**: Work Sans

---

## 🧪 Testing

### Test with cURL

```bash
# Set backend URL
API_URL="http://localhost:8001"

# Register user
curl -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "test123",
    "name": "Test User"
  }'

# Login
curl -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@admin.com",
    "password": "admin"
  }' \
  -c cookies.txt

# Get user info (using cookies)
curl -X GET "$API_URL/api/auth/me" \
  -b cookies.txt

# Submit complaint
curl -X POST "$API_URL/api/complaints" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Test Complaint",
    "description": "Test Description",
    "complainant_name": "Test User",
    "phone": "+91 1234567890",
    "address": "Test Address",
    "category": "Water Supply"
  }'
```

---

## 🐛 Troubleshooting

### Backend Issues

**Port already in use**
```bash
# Find process using port 8001
lsof -i :8001

# Kill the process
kill -9 <PID>
```

**MongoDB connection error**
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

**Module not found**
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend Issues

**Port 3000 already in use**
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

**Dependencies error**
```bash
# Clear cache and reinstall
rm -rf node_modules yarn.lock
yarn install
```

**Environment variables not loading**
```bash
# Make sure .env file exists in /app/frontend/
# Restart the frontend server
```

### Common Errors

**"Failed to load data"**
- Check if backend is running
- Verify REACT_APP_BACKEND_URL in frontend/.env
- Check browser console for errors
- Verify user is logged in

**"Invalid token" or "Not authenticated"**
- Clear browser cookies
- Login again
- Check JWT_SECRET in backend/.env

**Database errors**
- Check MongoDB is running
- Verify MONGO_URL in backend/.env
- Check database exists: `mongosh grampanchayat_db`

---

## 🔒 Security Notes

### Production Checklist

1. **Change Default Credentials**
```bash
# Update in backend/.env
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=strong-password-here
JWT_SECRET=generate-new-secret-key
```

2. **Generate New JWT Secret**
```python
import secrets
print(secrets.token_urlsafe(32))
```

3. **Update CORS Settings**
```python
# In server.py
allow_origins=["https://your-domain.com"]
```

4. **Enable HTTPS**
- Use SSL certificates
- Update frontend/.env with HTTPS URL

5. **Environment Variables**
- Never commit .env files
- Use different secrets for production

---

## 📊 Sample Data

### Bills (5 entries)
- Water Supply Bill - ₹250
- Property Tax - ₹1,500
- Sanitation Charges - ₹100
- Street Light Maintenance - ₹75
- Community Hall Rental - ₹500

### Panchayat Members (6 members)
- Rajesh Kumar (Sarpanch)
- Sunita Devi (Deputy Sarpanch)
- Mohan Singh (Ward Member)
- Lakshmi Reddy (Secretary)
- Ramesh Patel (Ward Member)
- Geeta Sharma (Ward Member)

### Meetings (6 meetings)
- Village Development Planning
- Health & Sanitation Drive Planning
- Education Committee Meeting
- New Community Meeting
- Budget Review Meeting
- Agricultural Subsidy Distribution

### Notices (6 notices)
- Water Supply Maintenance (High Priority)
- Vaccination Drive (Medium Priority)
- Property Tax Collection Drive (High Priority)
- Community Cleanliness Drive (Medium Priority)
- New Street Lights Installation (Low Priority)
- Free Legal Aid Camp (Medium Priority)

---

## 🔄 Deployment

### Environment Setup

**Backend Port**: 8001 (internal)
**Frontend Port**: 3000 (internal)
**MongoDB**: localhost:27017

### Required Environment Variables

**Backend (.env)**
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=grampanchayat_db
JWT_SECRET=<your-secret>
ADMIN_EMAIL=<admin-email>
ADMIN_PASSWORD=<admin-password>
FRONTEND_URL=<frontend-url>
```

**Frontend (.env)**
```
REACT_APP_BACKEND_URL=<backend-url>
```

---

## 📝 Additional Commands

### Database Backup
```bash
# Backup database
mongodump --db grampanchayat_db --out /backup/

# Restore database
mongorestore --db grampanchayat_db /backup/grampanchayat_db/
```

### View Logs
```bash
# Backend logs
tail -f /var/log/supervisor/backend.err.log
tail -f /var/log/supervisor/backend.out.log

# Frontend logs
tail -f /var/log/supervisor/frontend.out.log
```

### Clear Collections
```bash
mongosh grampanchayat_db --eval "
db.complaints.deleteMany({});
db.certificates.deleteMany({});
"
```

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review error logs
3. Verify all services are running
4. Check environment variables
5. Contact Emergent support

---

## 📅 Last Updated
Generated: April 8, 2026

---

**Project Status**: ✅ Fully Functional
**All Features**: ✅ Tested and Working
**Documentation**: ✅ Complete
