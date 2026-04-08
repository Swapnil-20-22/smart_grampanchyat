from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from pathlib import Path
import os

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional, Literal
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import secrets
import logging
from bson import ObjectId

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# JWT Configuration
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7

def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]

# Password Hashing
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

# JWT Token Management
def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        "type": "access"
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
        "type": "refresh"
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

# Auth Helper
async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_admin(request: Request) -> dict:
    user = await get_current_user(request)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# Pydantic Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str = Field(alias="_id")
    email: str
    name: str
    role: str
    created_at: datetime
    
    model_config = ConfigDict(populate_by_name=True)

class ComplaintCreate(BaseModel):
    title: str
    description: str

class ComplaintResponse(BaseModel):
    id: str
    title: str
    description: str
    status: Literal["Pending", "In Progress", "Resolved"]
    user_id: str
    user_name: str
    created_at: str
    updated_at: str

class ComplaintStatusUpdate(BaseModel):
    status: Literal["Pending", "In Progress", "Resolved"]

class CertificateCreate(BaseModel):
    certificate_type: str
    details: str

class CertificateResponse(BaseModel):
    id: str
    certificate_type: str
    details: str
    status: Literal["Pending", "Approved", "Rejected"]
    user_id: str
    user_name: str
    created_at: str
    updated_at: str

class CertificateStatusUpdate(BaseModel):
    status: Literal["Approved", "Rejected"]

class BillResponse(BaseModel):
    id: str
    title: str
    amount: float
    due_date: str
    description: str
    created_at: str

class MeetingResponse(BaseModel):
    id: str
    title: str
    agenda: str
    date: str
    location: str
    status: Literal["Upcoming", "Completed"]

class MemberResponse(BaseModel):
    id: str
    name: str
    position: str
    photo_url: str
    contact: str

class NoticeResponse(BaseModel):
    id: str
    title: str
    content: str
    priority: Literal["Low", "Medium", "High"]
    created_at: str

# Admin Seeding
async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@grampanchayat.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        hashed = hash_password(admin_password)
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hashed,
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc)
        })
        logging.info(f"Admin user created: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}}
        )
        logging.info(f"Admin password updated: {admin_email}")
    
    # Write test credentials
    os.makedirs("/app/memory", exist_ok=True)
    with open("/app/memory/test_credentials.md", "w") as f:
        f.write("# Test Credentials\n\n")
        f.write("## Admin Account\n")
        f.write(f"Email: {admin_email}\n")
        f.write(f"Password: {admin_password}\n")
        f.write(f"Role: admin\n\n")
        f.write("## Test User Account\n")
        f.write("Email: user@test.com\n")
        f.write("Password: user123\n")
        f.write("Role: user\n\n")
        f.write("## Auth Endpoints\n")
        f.write("- POST /api/auth/register\n")
        f.write("- POST /api/auth/login\n")
        f.write("- GET /api/auth/me\n")
        f.write("- POST /api/auth/logout\n")

async def seed_sample_data():
    # Seed Panchayat Members
    if await db.members.count_documents({}) == 0:
        members = [
            {
                "name": "Rajesh Kumar",
                "position": "Sarpanch",
                "photo_url": "https://images.unsplash.com/photo-1649433658557-54cf58577c68?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDB8MHwxfHNlYXJjaHwzfHxpbmRpYW4lMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwwfHx8fDE3NzU2MzI2NDd8MA&ixlib=rb-4.1.0&q=85",
                "contact": "+91 98765 43210"
            },
            {
                "name": "Sunita Devi",
                "position": "Deputy Sarpanch",
                "photo_url": "https://images.pexels.com/photos/7580822/pexels-photo-7580822.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                "contact": "+91 98765 43211"
            },
            {
                "name": "Mohan Singh",
                "position": "Ward Member",
                "photo_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
                "contact": "+91 98765 43212"
            },
            {
                "name": "Lakshmi Reddy",
                "position": "Secretary",
                "photo_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
                "contact": "+91 98765 43213"
            }
        ]
        await db.members.insert_many(members)
    
    # Seed Bills
    if await db.bills.count_documents({}) == 0:
        bills = [
            {
                "title": "Water Supply Bill - January 2026",
                "amount": 250.00,
                "due_date": "2026-01-31",
                "description": "Monthly water supply charges",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "title": "Property Tax - Q1 2026",
                "amount": 1500.00,
                "due_date": "2026-03-31",
                "description": "Quarterly property tax",
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.bills.insert_many(bills)
    
    # Seed Meetings
    if await db.meetings.count_documents({}) == 0:
        meetings = [
            {
                "title": "Village Development Planning",
                "agenda": "Discussion on road construction and water supply improvements",
                "date": "2026-02-15T10:00:00",
                "location": "Gram Panchayat Office",
                "status": "Upcoming"
            },
            {
                "title": "Budget Review Meeting",
                "agenda": "Annual budget review and allocation",
                "date": "2026-01-10T14:00:00",
                "location": "Community Hall",
                "status": "Completed"
            }
        ]
        await db.meetings.insert_many(meetings)
    
    # Seed Notices
    if await db.notices.count_documents({}) == 0:
        notices = [
            {
                "title": "Water Supply Maintenance",
                "content": "Water supply will be disrupted on 20th January from 10 AM to 4 PM for maintenance work.",
                "priority": "High",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "title": "Vaccination Drive",
                "content": "Free vaccination drive for children on 25th January at Community Health Center.",
                "priority": "Medium",
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.notices.insert_many(notices)

# Startup Event
@app.on_event("startup")
async def startup_event():
    await db.users.create_index("email", unique=True)
    await seed_admin()
    await seed_sample_data()
    logging.info("Application started successfully")

# Auth Routes
@api_router.post("/auth/register")
async def register(user_data: UserRegister, response: Response):
    email = user_data.email.lower()
    existing_user = await db.users.find_one({"email": email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = hash_password(user_data.password)
    user_doc = {
        "email": email,
        "password_hash": hashed,
        "name": user_data.name,
        "role": "user",
        "created_at": datetime.now(timezone.utc)
    }
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=900,
        path="/"
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=604800,
        path="/"
    )
    
    return {
        "_id": user_id,
        "email": email,
        "name": user_data.name,
        "role": "user"
    }

@api_router.post("/auth/login")
async def login(user_data: UserLogin, response: Response):
    email = user_data.email.lower()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(user_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_id = str(user["_id"])
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=900,
        path="/"
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=604800,
        path="/"
    )
    
    return {
        "_id": user_id,
        "email": user["email"],
        "name": user["name"],
        "role": user["role"]
    }

@api_router.get("/auth/me")
async def get_me(request: Request):
    user = await get_current_user(request)
    return user

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"message": "Logged out successfully"}

# Complaints Routes
@api_router.post("/complaints")
async def create_complaint(complaint: ComplaintCreate, request: Request):
    user = await get_current_user(request)
    complaint_doc = {
        "title": complaint.title,
        "description": complaint.description,
        "status": "Pending",
        "user_id": user["_id"],
        "user_name": user["name"],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    result = await db.complaints.insert_one(complaint_doc)
    complaint_doc["id"] = str(result.inserted_id)
    complaint_doc.pop("_id", None)
    return complaint_doc

@api_router.get("/complaints", response_model=List[ComplaintResponse])
async def get_complaints(request: Request):
    user = await get_current_user(request)
    if user["role"] == "admin":
        complaints = await db.complaints.find({}).to_list(1000)
    else:
        complaints = await db.complaints.find({"user_id": user["_id"]}).to_list(1000)
    
    for complaint in complaints:
        complaint["id"] = str(complaint["_id"])
        complaint.pop("_id", None)
    
    return complaints

@api_router.patch("/complaints/{complaint_id}/status")
async def update_complaint_status(
    complaint_id: str,
    status_update: ComplaintStatusUpdate,
    request: Request
):
    await get_current_admin(request)
    result = await db.complaints.update_one(
        {"_id": ObjectId(complaint_id)},
        {"$set": {"status": status_update.status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return {"message": "Status updated successfully"}

# Certificates Routes
@api_router.post("/certificates")
async def create_certificate(certificate: CertificateCreate, request: Request):
    user = await get_current_user(request)
    cert_doc = {
        "certificate_type": certificate.certificate_type,
        "details": certificate.details,
        "status": "Pending",
        "user_id": user["_id"],
        "user_name": user["name"],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    result = await db.certificates.insert_one(cert_doc)
    cert_doc["id"] = str(result.inserted_id)
    cert_doc.pop("_id", None)
    return cert_doc

@api_router.get("/certificates", response_model=List[CertificateResponse])
async def get_certificates(request: Request):
    user = await get_current_user(request)
    if user["role"] == "admin":
        certificates = await db.certificates.find({}).to_list(1000)
    else:
        certificates = await db.certificates.find({"user_id": user["_id"]}).to_list(1000)
    
    for cert in certificates:
        cert["id"] = str(cert["_id"])
        cert.pop("_id", None)
    
    return certificates

@api_router.patch("/certificates/{certificate_id}/status")
async def update_certificate_status(
    certificate_id: str,
    status_update: CertificateStatusUpdate,
    request: Request
):
    await get_current_admin(request)
    result = await db.certificates.update_one(
        {"_id": ObjectId(certificate_id)},
        {"$set": {"status": status_update.status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Certificate not found")
    return {"message": "Status updated successfully"}

# Bills Routes
@api_router.get("/bills", response_model=List[BillResponse])
async def get_bills(request: Request):
    await get_current_user(request)
    bills = await db.bills.find({}).to_list(1000)
    for bill in bills:
        bill["id"] = str(bill["_id"])
        bill.pop("_id", None)
    return bills

# Meetings Routes
@api_router.get("/meetings", response_model=List[MeetingResponse])
async def get_meetings(request: Request):
    await get_current_user(request)
    meetings = await db.meetings.find({}).to_list(1000)
    for meeting in meetings:
        meeting["id"] = str(meeting["_id"])
        meeting.pop("_id", None)
    return meetings

# Members Routes
@api_router.get("/members", response_model=List[MemberResponse])
async def get_members(request: Request):
    await get_current_user(request)
    members = await db.members.find({}).to_list(1000)
    for member in members:
        member["id"] = str(member["_id"])
        member.pop("_id", None)
    return members

# Notices Routes
@api_router.get("/notices", response_model=List[NoticeResponse])
async def get_notices(request: Request):
    await get_current_user(request)
    notices = await db.notices.find({}).to_list(1000)
    for notice in notices:
        notice["id"] = str(notice["_id"])
        notice.pop("_id", None)
    return notices

# Admin: Create Notice
class NoticeCreate(BaseModel):
    title: str
    content: str
    priority: Literal["Low", "Medium", "High"]

@api_router.post("/admin/notices")
async def create_notice(notice: NoticeCreate, request: Request):
    await get_current_admin(request)
    notice_doc = {
        "title": notice.title,
        "content": notice.content,
        "priority": notice.priority,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    result = await db.notices.insert_one(notice_doc)
    notice_doc["id"] = str(result.inserted_id)
    notice_doc.pop("_id", None)
    return notice_doc

# Admin: Delete Notice
@api_router.delete("/admin/notices/{notice_id}")
async def delete_notice(notice_id: str, request: Request):
    await get_current_admin(request)
    result = await db.notices.delete_one({"_id": ObjectId(notice_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Notice not found")
    return {"message": "Notice deleted successfully"}

# Admin: Create Meeting
class MeetingCreate(BaseModel):
    title: str
    agenda: str
    date: str
    location: str
    status: Literal["Upcoming", "Completed"] = "Upcoming"

@api_router.post("/admin/meetings")
async def create_meeting(meeting: MeetingCreate, request: Request):
    await get_current_admin(request)
    meeting_doc = {
        "title": meeting.title,
        "agenda": meeting.agenda,
        "date": meeting.date,
        "location": meeting.location,
        "status": meeting.status
    }
    result = await db.meetings.insert_one(meeting_doc)
    meeting_doc["id"] = str(result.inserted_id)
    meeting_doc.pop("_id", None)
    return meeting_doc

# Admin: Update Meeting
@api_router.patch("/admin/meetings/{meeting_id}")
async def update_meeting(meeting_id: str, meeting: MeetingCreate, request: Request):
    await get_current_admin(request)
    result = await db.meetings.update_one(
        {"_id": ObjectId(meeting_id)},
        {"$set": meeting.model_dump()}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return {"message": "Meeting updated successfully"}

# Admin: Delete Meeting
@api_router.delete("/admin/meetings/{meeting_id}")
async def delete_meeting(meeting_id: str, request: Request):
    await get_current_admin(request)
    result = await db.meetings.delete_one({"_id": ObjectId(meeting_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return {"message": "Meeting deleted successfully"}

# Admin: Get All Users
class UserListResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    created_at: str

@api_router.get("/admin/users", response_model=List[UserListResponse])
async def get_all_users(request: Request):
    await get_current_admin(request)
    users = await db.users.find({}, {"password_hash": 0}).to_list(1000)
    for user in users:
        user["id"] = str(user["_id"])
        user.pop("_id", None)
        if isinstance(user.get("created_at"), datetime):
            user["created_at"] = user["created_at"].isoformat()
    return users

# Admin: Update User Role
class UserRoleUpdate(BaseModel):
    role: Literal["user", "admin"]

@api_router.patch("/admin/users/{user_id}/role")
async def update_user_role(user_id: str, role_update: UserRoleUpdate, request: Request):
    await get_current_admin(request)
    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"role": role_update.role}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User role updated successfully"}

# Admin: Delete User
@api_router.delete("/admin/users/{user_id}")
async def delete_user(user_id: str, request: Request):
    admin = await get_current_admin(request)
    if admin["_id"] == user_id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    result = await db.users.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

# Admin: Reports Dashboard
class ReportsResponse(BaseModel):
    total_users: int
    total_complaints: int
    pending_complaints: int
    in_progress_complaints: int
    resolved_complaints: int
    total_certificates: int
    pending_certificates: int
    approved_certificates: int
    rejected_certificates: int
    complaints_by_status: dict
    certificates_by_status: dict

@api_router.get("/admin/reports", response_model=ReportsResponse)
async def get_admin_reports(request: Request):
    await get_current_admin(request)
    
    # Count users
    total_users = await db.users.count_documents({})
    
    # Count complaints
    total_complaints = await db.complaints.count_documents({})
    pending_complaints = await db.complaints.count_documents({"status": "Pending"})
    in_progress_complaints = await db.complaints.count_documents({"status": "In Progress"})
    resolved_complaints = await db.complaints.count_documents({"status": "Resolved"})
    
    # Count certificates
    total_certificates = await db.certificates.count_documents({})
    pending_certificates = await db.certificates.count_documents({"status": "Pending"})
    approved_certificates = await db.certificates.count_documents({"status": "Approved"})
    rejected_certificates = await db.certificates.count_documents({"status": "Rejected"})
    
    return {
        "total_users": total_users,
        "total_complaints": total_complaints,
        "pending_complaints": pending_complaints,
        "in_progress_complaints": in_progress_complaints,
        "resolved_complaints": resolved_complaints,
        "total_certificates": total_certificates,
        "pending_certificates": pending_certificates,
        "approved_certificates": approved_certificates,
        "rejected_certificates": rejected_certificates,
        "complaints_by_status": {
            "Pending": pending_complaints,
            "In Progress": in_progress_complaints,
            "Resolved": resolved_complaints
        },
        "certificates_by_status": {
            "Pending": pending_certificates,
            "Approved": approved_certificates,
            "Rejected": rejected_certificates
        }
    }

# Include router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
