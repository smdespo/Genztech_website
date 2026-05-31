from datetime import datetime, timezone
import os
import smtplib

import pymongo
from dotenv import load_dotenv
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

# -----------------------------
# Environment Config
# -----------------------------
account_sid = os.getenv("ACCOUNT_SID")
auth_token = os.getenv("AUTH_TOKEN")
sender_email = os.getenv("SENDER_EMAIL")
app_password = os.getenv("APP_PASSWORD")

# -----------------------------
# MongoDB Connection
# -----------------------------
mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")
db = mongo_client["genztech"]
users_collection = db["userdata"]
applications_collection = db["applydata"]
queries_collection = db["userquery"]
enrollments_collection = db["enroll"]
sessions_collection = db["sessionbooking"]

# -----------------------------
# FastAPI App
# -----------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# -----------------------------
# Pydantic Models
# -----------------------------
class Userinput(BaseModel):
    Full_Name: str
    Email: str
    Phone_Number: str
    Password: str
    Confirm_Password: str


class UserLogin(BaseModel):
    Email: str
    Password: str


class QueryInput(BaseModel):
    Full_Name: str
    Email: str
    Subject: str
    message: str
    Phone_Number: str = ""
    Course_Interest: str = ""
    Source_Page: str = ""


class EmailSend(BaseModel):
    reciever_email: str
    subject: str
    body: str


class EnrollInput(BaseModel):
    Full_Name: str
    Email: str
    Course: str
    Qualification: str
    Interested_course: str = ""
    collegeorlearning_institute: str = ""
    prefrred_mode_of_learning: str
    goal: str = ""
    Phone_Number: str = ""
    Category: str = ""
    Source_Page: str = ""
    Context: str = ""


class BookSessionInput(BaseModel):
    Full_Name: str
    Email: str
    Domain_of_interest: str
    Phone_Number: str = ""
    Source_Page: str = ""


class ApplyFormInput(BaseModel):
    Full_Name: str
    Email: str
    Phone_Number: str
    applying_for: str
    Qualification: str
    Experience_level: str
    prefrred_mode_of_learning: str
    goal: str
    Source_Page: str = ""
    Context: str = ""


# -----------------------------
# Helpers
# -----------------------------
def timestamp_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def serialize_document(document: dict) -> dict:
    serialized = dict(document)
    serialized["id"] = str(serialized.pop("_id", ""))
    return serialized


def fetch_collection_records(collection) -> list[dict]:
    return [
        serialize_document(document)
        for document in collection.find().sort("created_at", pymongo.DESCENDING)
    ]


def insert_record(collection, record: dict) -> dict:
    payload = {
        **record,
        "created_at": timestamp_now()
    }
    collection.insert_one(payload)
    return payload


async def send_email(reciever_email: str, subject: str, body: str):
    if not sender_email or not app_password:
        return {"message": "Email skipped because SMTP credentials are not configured."}

    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = reciever_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, app_password)
        server.sendmail(sender_email, reciever_email, msg.as_string())
        server.quit()
    except Exception as error:
        print(f"Error sending email: {error}")

    return {"message": "Email processed"}


# -----------------------------
# Auth Routes
# -----------------------------
@app.post("/signup")
async def signup(user: Userinput):
    if user.Password != user.Confirm_Password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    existing_user = users_collection.find_one({"Email": user.Email})
    if existing_user:
        raise HTTPException(status_code=409, detail="An account with this email already exists")

    record = {
        "Full_Name": user.Full_Name,
        "Email": user.Email,
        "Phone_Number": user.Phone_Number,
        "Password": user.Password,
        "Confirm_Password": user.Confirm_Password,
        "created_at": timestamp_now()
    }

    users_collection.insert_one(record)

    await send_email(
        user.Email,
        "Welcome to GenzTech",
        f"""
Welcome to GenzTech!

Hi {user.Full_Name},

Thank you for signing up with GenzTech.
We're excited to have you onboard.

Team GenzTech
        """.strip()
    )

    return {
        "message": "User created successfully",
        "user": {
            "Full_Name": user.Full_Name,
            "Email": user.Email,
            "Phone_Number": user.Phone_Number
        }
    }


@app.post("/login")
async def login(user: UserLogin):
    record = users_collection.find_one({"Email": user.Email, "Password": user.Password})

    if not record:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "message": "Login successful",
        "user": {
            "Full_Name": record.get("Full_Name", ""),
            "Email": record.get("Email", ""),
            "Phone_Number": record.get("Phone_Number", "")
        }
    }


# -----------------------------
# Submission Routes
# -----------------------------
@app.post("/query")
async def handle_query(query_input: QueryInput):
    record = insert_record(
        queries_collection,
        {
            "Full_Name": query_input.Full_Name,
            "Email": query_input.Email,
            "Phone_Number": query_input.Phone_Number,
            "Subject": query_input.Subject,
            "Course_Interest": query_input.Course_Interest,
            "message": query_input.message,
            "Source_Page": query_input.Source_Page
        }
    )

    await send_email(
        record["Email"],
        "We Have Received Your Enquiry",
        f"""
Dear {query_input.Full_Name},

Thank you for contacting GenzTech.
We have received your enquiry and our team will get back to you shortly.

Best Regards,
Team GenzTech
        """.strip()
    )

    return {"message": "Query received successfully", "record": record}


@app.post("/enroll")
async def enroll_course(enrollment: EnrollInput):
    record = insert_record(
        enrollments_collection,
        {
            "Full_Name": enrollment.Full_Name,
            "Email": enrollment.Email,
            "Phone_Number": enrollment.Phone_Number,
            "Category": enrollment.Category,
            "Course": enrollment.Course,
            "Qualification": enrollment.Qualification,
            "Interested_course": enrollment.Interested_course,
            "collegeorlearning_institute": enrollment.collegeorlearning_institute,
            "prefrred_mode_of_learning": enrollment.prefrred_mode_of_learning,
            "goal": enrollment.goal,
            "Source_Page": enrollment.Source_Page,
            "Context": enrollment.Context
        }
    )

    await send_email(
        record["Email"],
        "Enrollment Form Successfully Received",
        f"""
Dear {enrollment.Full_Name},

Thank you for completing your enrollment form.
Your enrollment request has been received successfully and our team will contact you soon.

Warm Regards,
Team GenzTech
        """.strip()
    )

    return {"message": "Enrollment form received successfully", "record": record}


@app.post("/book_session")
async def book_session(session: BookSessionInput):
    record = insert_record(
        sessions_collection,
        {
            "Full_Name": session.Full_Name,
            "Email": session.Email,
            "Phone_Number": session.Phone_Number,
            "Domain_of_interest": session.Domain_of_interest,
            "Source_Page": session.Source_Page
        }
    )

    await send_email(
        record["Email"],
        "Free Counseling Request Received",
        f"""
Dear {session.Full_Name},

Thank you for registering for our free counseling session.
Your request has been received and our team will connect with you shortly.

Warm Regards,
Team GenzTech
        """.strip()
    )

    return {"message": "Session booked successfully", "record": record}


@app.post("/apply")
async def apply(application: ApplyFormInput):
    record = insert_record(
        applications_collection,
        {
            "Full_Name": application.Full_Name,
            "Email": application.Email,
            "Phone_Number": application.Phone_Number,
            "applying_for": application.applying_for,
            "Qualification": application.Qualification,
            "Experience_level": application.Experience_level,
            "prefrred_mode_of_learning": application.prefrred_mode_of_learning,
            "goal": application.goal,
            "Source_Page": application.Source_Page,
            "Context": application.Context
        }
    )

    await send_email(
        record["Email"],
        "Application Received Successfully",
        f"""
Dear {application.Full_Name},

Thank you for submitting your application.
We have received your application successfully and our team is reviewing it.

Best Regards,
Team GenzTech
        """.strip()
    )

    return {"message": "Application form received successfully", "record": record}


# -----------------------------
# Admin Dashboard Route
# -----------------------------
@app.get("/admin/dashboard")
async def get_admin_dashboard():
    enquiries = fetch_collection_records(queries_collection)
    enrollments = fetch_collection_records(enrollments_collection)
    applications = fetch_collection_records(applications_collection)
    counselling = fetch_collection_records(sessions_collection)

    return {
        "summary": {
            "enquiries": len(enquiries),
            "enrollments": len(enrollments),
            "applications": len(applications),
            "counselling": len(counselling)
        },
        "enquiries": enquiries,
        "enrollments": enrollments,
        "applications": applications,
        "counselling": counselling
    }
