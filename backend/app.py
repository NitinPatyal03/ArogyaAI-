from urllib import response
from dotenv import load_dotenv
import os

load_dotenv()
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from bson.objectid import ObjectId
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)
from bson import ObjectId
from reportlab.lib.styles import (
    getSampleStyleSheet
)
from werkzeug.utils import secure_filename
from flask import send_from_directory

from functools import wraps
import pandas as pd
import joblib
import smtplib
import requests
import pytesseract
from PIL import Image
import os
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email import encoders
from bson import ObjectId

# Authentication
from flask_bcrypt import Bcrypt
from pymongo import MongoClient
import jwt
from datetime import datetime, timedelta
import requests
import time
# -----------------------------------
# Flask App
# -----------------------------------
app = Flask(__name__)

CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=True
)

bcrypt = Bcrypt(app)

# JWT Secret Key
app.config["SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

# -----------------------------------
# Gemini AI Configuration
# -----------------------------------
# GEMINI_API_KEY = "AIzaSyAzuHyPrgicK7w4rRKu4xdhqvy7Xhub62w"

# client_ai = genai.Client(
#     api_key=GEMINI_API_KEY
# )

# UPLOAD_FOLDER = "uploadss/profile"
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# -----------------------------------
# MongoDB Connection
# -----------------------------------
client = MongoClient(
    os.getenv("MONGO_URI"),
    serverSelectionTimeoutMS=5000
)

client.admin.command("ping")

print("MongoDB Connected Successfully")

db = client["arogyaai"]

users_collection = db["users"]

history_collection = db["history"]

appointments_collection = db["appointments"]

health_collection = db["health_metrics"]

prediction_history_collection = db["prediction_history"]

# -----------------------------------
# Load ML Model
# -----------------------------------
# Production Model V2

model = None
mlb = None

def load_model():
    global model, mlb

    if model is None:
        model = joblib.load("models/model_v2.pkl")

    if mlb is None:
        mlb = joblib.load("models/mlb_v2.pkl")

# -----------------------------------
# Load Dataset
# -----------------------------------
df = pd.read_csv(
    "datasets/disease_info.csv"
)

# Clean disease names
df["Disease"] = (
    df["Disease"]
    .str.strip()
    .str.lower()
)

# -----------------------------------
# AI Severity Detection
# -----------------------------------
def detect_severity(symptoms):

    critical_symptoms = [

        "chest pain",
        "breathlessness",
        "seizures",
        "unconsciousness",

    ]

    high_symptoms = [

        "high fever",
        "blood in urine",
        "persistent cough",
        "weight loss",

    ]

    medium_symptoms = [

        "vomiting",
        "dizziness",
        "joint pain",
        "fatigue",

    ]

    # Critical
    if any(
        symptom in symptoms
        for symptom in critical_symptoms
    ):

        return {

            "level": "Critical",

            "alert":
            "🚨 Emergency! Visit nearest hospital immediately."

        }

    # High
    elif any(
        symptom in symptoms
        for symptom in high_symptoms
    ):

        return {

            "level": "High",

            "alert":
            "⚠ Serious condition. Consult doctor soon."

        }

    # Medium
    elif any(
        symptom in symptoms
        for symptom in medium_symptoms
    ):

        return {

            "level": "Medium",

            "alert":
            "🩺 Monitor symptoms and take precautions."

        }

    # Low
    else:

        return {

            "level": "Low",

            "alert":
            "✅ Condition appears manageable."

        }

# -----------------------------------
# Doctor Recommendation System
# -----------------------------------
def recommend_doctor(disease):

    disease = disease.lower()

    doctor_map = {

        "asthma":
        "Pulmonologist",

        "malaria":
        "General Physician",

        "diabetes":
        "Endocrinologist",

        "heart attack":
        "Cardiologist",

        "hypertension":
        "Cardiologist",

        "skin allergy":
        "Dermatologist",

        "arthritis":
        "Orthopedic",

        "migraine":
        "Neurologist",

        "tuberculosis":
        "Pulmonologist",

        "covid-19":
        "General Physician",

        "kidney stone":
        "Urologist",

        "depression":
        "Psychiatrist",

        "epilepsy":
        "Neurologist",

    }

    return doctor_map.get(

        disease,

        "General Physician"

    )

# -----------------------------------
# Home Route
# -----------------------------------
@app.route("/")
def home():

    return "ArogyaAI Backend Running 🚀"

# -----------------------------------
# Test Database Route
# -----------------------------------
@app.route("/test-db")
def test_db():

    try:

        users_collection.insert_one({
            "test": "working"
        })

        return "MongoDB Working ✅"

    except Exception as e:

        return str(e)
    
    # -----------------------------------
# Admin Users API
# -----------------------------------
# -----------------------------------
# Get All Users
# -----------------------------------
@app.route("/admin/users", methods=["GET"])
def get_users():

    try:

        users = []

        cursor = users_collection.find({}, {

            "password": 0

        })

        for user in cursor:

            users.append({

                "id": str(user["_id"]),

                "name": user.get("name", ""),

                "email": user.get("email", ""),

                "phone": user.get("phone", ""),

                "age": user.get("age", ""),

                "bloodGroup": user.get("bloodGroup", ""),

                "gender": user.get("gender", ""),

                "status": user.get("status", "active"),

                "profileImage": user.get("profileImage", ""),

                "role": user.get("role", "user")

            })

        return jsonify(users)

    except Exception as e:

        return jsonify({

            "success": False,

            "error": str(e)

        }), 500
@app.route("/testdb")
def testdb():
    try:
        count = users_collection.count_documents({})
        return jsonify({
            "status": "Connected",
            "users": count
        })
    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500
# -----------------------------------
# Signup API
# -----------------------------------
@app.route("/signup", methods=["POST"])
def signup():

    try:

        data = request.json

        existing_user = users_collection.find_one({

            "email": data["email"]

        })

        if existing_user:

            return jsonify({

                "message":
                "User already exists"

            }), 400

        hashed_password = (
            bcrypt.generate_password_hash(
                data["password"]
            )
            .decode("utf-8")
        )

        users_collection.insert_one({

    "name":
    data["name"],

    "email":
    data["email"],

    "password":
    hashed_password,

    "role":
    "user"

        })

        return jsonify({

            "message":
            "Signup successful"

        })

    except Exception as e:

        return jsonify({

            "error":
            str(e)

        }), 500

# -----------------------------------
# Login API
# -----------------------------------
@app.route("/login", methods=["POST"])
def login():

    try:

        data = request.json

        user = users_collection.find_one({

            "email": data["email"]

        })

        # User not found
        if not user:

            return jsonify({

                "message": "User not found"

            }), 404

        # Check if account is blocked
        if user.get("status") == "blocked":

            return jsonify({

                "message": "Your account has been blocked by the administrator."

            }), 403

        # Verify password
        if bcrypt.check_password_hash(

            user["password"],

            data["password"]

        ):

            token = jwt.encode(

                {

                    "email": user["email"],

                    "role": user.get("role", "user"),

                    "exp": datetime.utcnow() + timedelta(hours=24)

                },

                app.config["SECRET_KEY"],

                algorithm="HS256"

            )

            return jsonify({

                "message": "Login successful",

                "token": token,

                "role": user.get("role", "user"),

                "name": user.get("name", ""),

                "email": user.get("email", ""),

                "phone": user.get("phone", ""),

                "age": user.get("age", ""),

                "bloodGroup": user.get("bloodGroup", ""),

                "gender": user.get("gender", ""),

                "profileImage": user.get("profileImage", ""),

                "status": user.get("status", "active")

            })

        else:

            return jsonify({

                "message": "Invalid password"

            }), 401

    except Exception as e:

        return jsonify({

            "error": str(e)

        }), 500

# # -----------------------------------
# # Get All Users (Admin)
# # -----------------------------------

# @app.route("/admin/users", methods=["GET"])
# def get_users():

#     users = []

#     for user in users_collection.find({}, {"password": 0}):

#         user["_id"] = str(user["_id"])

#         users.append(user)

#     return jsonify(users)

# from bson import ObjectId

# # -----------------------------------
# # Delete User (Admin)
# # -----------------------------------
# @app.route("/admin/delete-user/<id>", methods=["DELETE"])
# def delete_user(id):

#     try:

#         users_collection.delete_one({

#             "_id": ObjectId(id)

#         })

#         return jsonify({

#             "success": True,

#             "message": "User deleted successfully"

#         })

#     except Exception as e:

#         return jsonify({

#             "success": False,

#             "error": str(e)

#         }), 500


#UPDATE PROFILE IMAGE ##
@app.route("/upload-profile-image", methods=["POST"])
def upload_profile_image():

    try:

        email = request.form.get("email")

        file = request.files.get("image")

        if not file:

            return jsonify({
                "success": False,
                "message": "No image selected"
            })

        extension = file.filename.split(".")[-1]

        filename = secure_filename(

            email.replace("@", "_") + "." + extension

        )

        filepath = os.path.join(

            app.config["UPLOAD_FOLDER"],
            filename

        )

        file.save(filepath)

        users_collection.update_one(

            {"email": email},

            {

                "$set": {

                    "profileImage": filename

                }

            }

        )

        return jsonify({

            "success": True,

            "image": filename

        })

    except Exception as e:

        return jsonify({

            "success": False,

            "error": str(e)

        }), 500    
    
@app.route("/profile-image/<filename>")
def profile_image(filename):

    return send_from_directory(

        app.config["UPLOAD_FOLDER"],

        filename

    )

#--------------
#Delete User API
#--------------
@app.route("/admin/delete-user/<id>", methods=["DELETE"])
def delete_user(id):

    users_collection.delete_one({

        "_id": ObjectId(id)

    })

    return jsonify({

        "success": True

    })

#--------------
#Block User API
#--------------
@app.route("/admin/block-user/<id>", methods=["PUT"])
def block_user(id):

    users_collection.update_one(

        {

            "_id": ObjectId(id)

        },

        {

            "$set": {

                "status": "blocked"

            }

        }

    )

    return jsonify({

        "success": True

    })

#--------------
#Unblock User API
#--------------
@app.route("/admin/unblock-user/<id>", methods=["PUT"])
def unblock_user(id):

    users_collection.update_one(

        {

            "_id": ObjectId(id)

        },

        {

            "$set": {

                "status": "active"

            }

        }

    )

    return jsonify({

        "success": True

    })

#-----------------------------------
#update user role
#-----------------------------------
@app.route("/admin/update-user/<id>", methods=["PUT"])
def update_user(id):

    data = request.json

    users_collection.update_one(

        {

            "_id": ObjectId(id)

        },

        {

            "$set": {

                "name": data["name"],

                "phone": data["phone"],

                "age": data["age"],

                "bloodGroup": data["bloodGroup"],

                "gender": data["gender"]

            }

        }

    )

    return jsonify({

        "success": True

    })

# -----------------------------------
# Emergency SOS Email API
# -----------------------------------
@app.route("/send-sos-email", methods=["POST"])
def send_sos_email():
    try:
        data = request.json

        receiver_email = data["emergencyEmail"]

        sender_email = data["email"]
        latitude = data["latitude"]
        longitude = data["longitude"]

        api_key = os.getenv("RESEND_API_KEY")

        html_content = f"""
        <h2>🚨 Emergency SOS Alert</h2>

        <p>User needs immediate medical assistance.</p>

        <p>
            <b>Location:</b><br>
            <a href="https://maps.google.com/?q={latitude},{longitude}">
                Open Location
            </a>
        </p>

        <p>Please respond immediately.</p>

        <hr>

        <p>ArogyaAI Emergency System</p>
        """

        response = requests.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "from": "onboarding@resend.dev",
                "to": [receiver_email],
                "subject": "🚨 Emergency SOS Alert",
                "html": html_content
            }
        )

        if response.status_code in [200, 201]:
            return jsonify({
                "message": "SOS Email Sent Successfully"
            })

        return jsonify({
            "error": response.text
        }), 500

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


@app.route("/save-health", methods=["POST"])
def save_health():

    try:

        data = request.get_json()

        from datetime import datetime

        data["createdAt"] = datetime.now().strftime(
            "%d %b %Y %I:%M %p"
        )

        health_collection.insert_one(data)

        return jsonify({

            "message": "Health data saved"

        })

    except Exception as e:

        return jsonify({

            "error": str(e)

        }), 500

    
# @app.route("/health-history", methods=["GET"])
# def health_history():

    try:

        records = []

        for item in health_collection.find():

            records.append({

                "heartRate":
                item["heartRate"],

                "steps":
                item["steps"],

                "calories":
                item["calories"],

                "sleep":
                item["sleep"]

            })

        return jsonify(records)

    except Exception as e:

        return jsonify({

            "error":
            str(e)

        }), 500
    
@app.route("/delete-health/<email>/<date>", methods=["DELETE"])
def delete_health(email, date):

    try:

        health_collection.delete_one({
            "email": email,
            "createdAt": date
        })

        return jsonify({
            "message": "Deleted Successfully"
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


@app.route(
    "/history/delete/<id>",
    methods=["DELETE"]
)
def delete_history(id):

    try:

        prediction_history_collection.delete_one({

            "_id":
            ObjectId(id)

        })



        return jsonify({

            "message":
            "Deleted Successfully"

        })

    except Exception as e:

        return jsonify({

            "error":
            str(e)

        }), 500

@app.route("/dashboard", methods=["GET"])
def dashboard():

    try:

        email = request.args.get("email")

        # User
        user = users_collection.find_one(
            {"email": email}
        )

        # Prediction History
        predictions = list(

            prediction_history_collection.find({

                "email": email

            }).sort("_id", -1)

        )

        # Appointment
        appointment = appointments_collection.find_one(

            {

                "email": email,

                "status": "Booked"

            },

            sort=[("_id", -1)]

        )

        prediction_count = len(predictions)

        last_prediction = (

            predictions[0]

            if predictions

            else None

        )

        # Health Score

        health_score = 100

        if last_prediction:

            severity = last_prediction.get(
                "severity",
                "Low"
            )

            if severity == "Critical":

                health_score = 35

            elif severity == "High":

                health_score = 55

            elif severity == "Medium":

                health_score = 75

            else:

                health_score = 95

        return jsonify({

            "name":

            user["name"]

            if user

            else "User",

            "predictionCount":

            prediction_count,

            "healthScore":

            health_score,

            "lastPrediction":

            last_prediction["disease"]

            if last_prediction

            else "Healthy",

            "nextAppointment":

            {

                "doctor":

                appointment["doctor"],

                "date":

                appointment["date"],

                "time":

                appointment["time"]

            }

            if appointment

            else None

        })

    except Exception as e:

        return jsonify({

            "error": str(e)

        }),500

@app.route("/admin/dashboard", methods=["GET"])
def admin_dashboard():

    try:

        return jsonify({

            "totalUsers":
            users_collection.count_documents({}),

            "totalPredictions":
            prediction_history_collection.count_documents({}),

            "totalAppointments":
            appointments_collection.count_documents({}),

            "totalHealthRecords":
            health_collection.count_documents({}),

            "totalSOS":
            sos_collection.count_documents({}),

            "totalAIChats":
            ai_chat_collection.count_documents({})

        })

    except Exception as e:

        return jsonify({

            "error": str(e)

        }),500
    
@app.route("/update-profile", methods=["POST"])
def update_profile():

    data = request.json

    users_collection.update_one(

        {"email": data["email"]},

        {
            "$set": {

                "name": data["name"],
                "phone": data["phone"],
                "age": data["age"],
                "bloodGroup": data["bloodGroup"],
                "gender": data["gender"]

            }
        }

    )

    return jsonify({

        "success": True

    })
    
@app.route("/recent-activity", methods=["GET"])
def recent_activity():

    try:

        email = request.args.get("email")

        activities = []

        # Prediction History
        predictions = prediction_history_collection.find(
            {"email": email}
        ).sort("_id", -1).limit(5)

        for item in predictions:

            activities.append({

                "icon": "🩺",

                "title": item["disease"],

                "subtitle": "Disease Prediction",

                "date": item["date"]

            })

        # Appointments
        appointments = appointments_collection.find(
            {"email": email}
        ).sort("_id", -1).limit(5)

        for item in appointments:

            activities.append({

                "icon": "📅",

                "title": item["doctor"],

                "subtitle": "Appointment Booked",

                "date": item["date"]

            })

        activities.sort(
            key=lambda x: x["date"],
            reverse=True
        )

        return jsonify(activities)

    except Exception as e:

        return jsonify({

            "error": str(e)

        }), 500

@app.route("/google-fit-data", methods=["POST"])
def google_fit_data():

    try:

        data = request.json
        access_token = data["token"]

        headers = {
            
            #add your Google Fit API access token here

            "Content-Type":
            "application/json"
        }

        end_time = int(time() * 1000)
        start_time = end_time - (24 * 60 * 60 * 1000)

        def get_metric(data_type):

            body = {
                "aggregateBy": [{
                    "dataTypeName": data_type
                }],
                "bucketByTime": {
                    "durationMillis": 86400000
                },
                "startTimeMillis": start_time,
                "endTimeMillis": end_time
            }

            response = requests.post(
                "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
                headers=headers,
                json=body
            )

            return response.json()

        # Fetch data
        steps_data = get_metric(
            "com.google.step_count.delta"
        )

        # Extract Steps
        steps = 0

        try:

            bucket = steps_data["bucket"][0]

            dataset = bucket["dataset"][0]

            if dataset["point"]:

                steps = dataset["point"][0]["value"][0]["intVal"]

        except Exception as e:

            print("Steps Parse Error:", e)

        return jsonify({

            "success": True,

            "steps": steps,

            # Dummy values for now
            "heartRate": 82,

            "calories": 520,

            "sleep": 7.2

        })

    except Exception as e:

        return jsonify({

            "success": False,

            "error": str(e)

        }), 500

       
# -----------------------------------
# Disease Prediction API
# -----------------------------------
@app.route("/predict", methods=["POST"])
def predict():

    load_model()

    try:

        data = request.get_json()

        symptoms = data.get("symptoms", [])

        if isinstance(symptoms, str):
            symptoms = symptoms.split(",")

        symptoms = [
            symptom.strip().lower()
            for symptom in symptoms
            if symptom.strip()
        ]

        # -----------------------------------
        # No Symptoms
        # -----------------------------------

        if len(symptoms) == 0:

            return jsonify({

                "disease": "No Symptoms",

                "confidence": 0,

                "doctor": "General Physician",

                "medicine": "Not Available",

                "diet": "Not Available",

                "precaution": "Please enter symptoms.",

                "severity": "Unknown",

                "alert": "No symptoms provided.",

                "aiRecommendation":
                    "Please enter at least one symptom to receive a prediction.",

                "predictions": []

            })

        print("Symptoms :", symptoms)

        # -----------------------------------
        # Encode Symptoms
        # -----------------------------------

        input_data = mlb.transform([symptoms])

        # -----------------------------------
        # Predict Disease
        # -----------------------------------

        prediction = model.predict(input_data)[0]

        probabilities = model.predict_proba(input_data)[0]

        confidence = round(max(probabilities) * 100, 2)

        disease = str(prediction).strip()

        print("Predicted Disease :", disease)

        print("Confidence :", confidence)

        # -----------------------------------
        # Top 3 Predictions
        # -----------------------------------

        top3_index = probabilities.argsort()[-3:][::-1]

        predictions = []

        for i in top3_index:

            predictions.append({

                "disease": model.classes_[i],

                "confidence": round(probabilities[i] * 100, 2)

            })

        # -----------------------------------
        # Disease Details
        # -----------------------------------

        disease_data = df[
            df["Disease"].str.strip().str.lower()
            ==
            disease.strip().lower()
        ]

        # -----------------------------------
        # Disease Not Found
        # -----------------------------------

        if disease_data.empty:

            return jsonify({

                "disease": disease,

                "confidence": confidence,

                "doctor": "General Physician",

                "medicine": "Not Available",

                "diet": "Not Available",

                "precaution": "Not Available",

                "severity": "Unknown",

                "alert": "Disease information not found.",

                "aiRecommendation":
                    "Please consult a qualified healthcare professional.",

                "predictions": predictions

            })

        disease_data = disease_data.iloc[0]

        # -----------------------------------
        # Severity
        # -----------------------------------

        severity_result = detect_severity(symptoms)

        # -----------------------------------
        # Doctor Recommendation
        # -----------------------------------

        doctor = recommend_doctor(disease)

        # -----------------------------------
        # AI Recommendation
        # -----------------------------------

        disease_lower = disease.lower()

        if "diabetes" in disease_lower:

            ai_recommendation = (
                "Monitor your blood sugar regularly, "
                "avoid sugary foods, exercise daily, "
                "and follow your doctor's advice."
            )

        elif "hypertension" in disease_lower:

            ai_recommendation = (
                "Reduce salt intake, manage stress, "
                "exercise regularly, and monitor blood pressure."
            )

        elif "dengue" in disease_lower:

            ai_recommendation = (
                "Drink plenty of fluids, rest well, "
                "monitor platelet count, and seek medical care immediately if symptoms worsen."
            )

        elif "malaria" in disease_lower:

            ai_recommendation = (
                "Complete the prescribed medication course, "
                "stay hydrated, and avoid mosquito exposure."
            )

        elif "covid" in disease_lower:

            ai_recommendation = (
                "Isolate if necessary, stay hydrated, "
                "monitor oxygen levels, and seek medical attention if breathing becomes difficult."
            )

        else:

            ai_recommendation = (
                "Drink plenty of water, eat nutritious food, "
                "take adequate rest, follow your prescribed medication, "
                "and consult a doctor if symptoms worsen."
            )

        # -----------------------------------
        # Save Prediction History
        # -----------------------------------

        try:

            prediction_history_collection.insert_one({

                "email": data.get("email", ""),

                "symptoms": symptoms,

                "disease": disease,

                "confidence": confidence,

                "doctor": doctor,

                "medicine": disease_data["Medicine"],

                "severity": severity_result["level"],

                "date": datetime.now().strftime("%d-%m-%Y %H:%M")

            })

        except Exception as mongo_error:

            print("MongoDB Error :", mongo_error)

        # -----------------------------------
        # Final Response
        # -----------------------------------

        return jsonify({

            "disease": disease,

            "confidence": confidence,

            "doctor": doctor,

            "medicine": disease_data["Medicine"],

            "diet": disease_data["Diet"],

            "precaution": disease_data["Precaution"],

            "severity": severity_result["level"],

            "alert": severity_result["alert"],

            "aiRecommendation": ai_recommendation,

            "predictions": predictions

        })

    except Exception as e:

        print("Prediction Error :", str(e))

        return jsonify({

            "disease": "Prediction Failed",

            "confidence": 0,

            "doctor": "General Physician",

            "medicine": "Not Available",

            "diet": "Not Available",

            "precaution": "Not Available",

            "severity": "Unknown",

            "alert": str(e),

            "aiRecommendation":
                "Unable to generate recommendation at this time.",

            "predictions": []

        }), 500
# -----------------------------------
# AI Chat API (OpenRouter FREE)
# -----------------------------------
@app.route("/ai-chat", methods=["POST"])
def ai_chat():

    try:

        data = request.get_json()

        user_message = data.get(
            "message",
            ""
        )

        if not user_message:

            return jsonify({

                "reply":
                "Please enter a message."

            })

        # OpenRouter API
        response = requests.post(

            url="https://openrouter.ai/api/v1/chat/completions",

            headers={
    "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
    "Content-Type": "application/json",
    "HTTP-Referer": "https://arogyaaiv2.netlify.app",
    "X-Title": "ArogyaAI"
},

            json={

                "model":
                "openai/gpt-3.5-turbo",

                "messages": [

                    {

                        "role":
                        "system",

                        "content":
                    
"""
You are ArogyaAI,
an advanced AI Healthcare Assistant.

Rules:

- Answer like a friendly doctor.
- Keep answers short and easy to understand.
- Suggest healthy lifestyle tips.
- Never claim to replace a real doctor.
- Recommend consulting a healthcare professional for serious symptoms.
- Answer questions about:
  • Diseases
  • Medicines
  • Diet
  • Exercise
  • Mental health
  • First aid
  • Medical reports
  • Lab tests
- Use bullet points whenever helpful.
- End important medical answers with:
  '⚠️ This information is for educational purposes and is not a substitute for professional medical advice.'
"""

                    },

                    {

                        "role":
                        "user",

                        "content":
                        user_message

                    }

                ]

            }

        )

        result = response.json()

        ai_reply = result["choices"][0]["message"]["content"]

        print(ai_reply)

        return jsonify({

            "reply":
            ai_reply

        })

    except Exception as e:

        print(str(e))

        return jsonify({

            "reply":
            "AI service temporarily unavailable."

        }), 500
    
    
@app.route("/history/<email>", methods=["GET"])
def get_history(email):

    try:

        history = []

        data = prediction_history_collection.find({
            "email": email
        }).sort("_id", -1)

        for item in data:

            history.append({

                "_id": str(item["_id"]),
                "disease": item["disease"],
                "doctor": item["doctor"],
                "medicine": item["medicine"],
                "severity": item["severity"],
                "date": item["date"]

            })

        return jsonify(history)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

# -----------------------------------
# Prediction History API
# -----------------------------------
@app.route("/history", methods=["GET"])
def history():

    try:

        records = []

        history_data = history_collection.find()

        for item in history_data:

            records.append({

                "symptoms":
                item["symptoms"],

                "disease":
                item["disease"],

                "severity":
                item["severity"]

            })

        return jsonify(records)

    except Exception as e:

        return jsonify({

            "error":
            str(e)

        }), 500

# -----------------------------------
# Book Appointment API
# -----------------------------------
@app.route("/book-appointment", methods=["POST"])
def book_appointment():

    try:

        data = request.json

        appointment = {

            "patient":
            data["patient"],

            "email":
            data["email"],

            "doctor":
            data["doctor"],

            "date":
            data["date"],

            "time":
            data["time"],

            "status":
            "Booked"

        }

        # Save Appointment
        appointments_collection.insert_one(
            appointment
        )

        # -----------------------------------
        # Send Booking Confirmation Email
        # -----------------------------------
        sender_email = "patyalnitin69@gmail.com"

        sender_password = "umls icnq lbny ocze"

        receiver_email = data["email"]

        message = MIMEMultipart()

        message["From"] = sender_email

        message["To"] = receiver_email

        message["Subject"] = "Appointment Confirmation - ArogyaAI"

        body = f"""

Hello {data["patient"]},

Your appointment has been booked successfully.

Doctor:
{data["doctor"]}

Date:
{data["date"]}

Time:
{data["time"]}

Thank you for using ArogyaAI.

"""

        message.attach(
            MIMEText(body, "plain")
        )

        # Gmail SMTP
        server = smtplib.SMTP(
    "smtp.gmail.com",
    587,
    timeout=10
)

        server.starttls()

        server.login(
            sender_email,
            sender_password
        )

        text = message.as_string()

        server.sendmail(

            sender_email,

            receiver_email,

            text

        )

        server.quit()

        return jsonify({

            "message":
            "Appointment booked successfully"

        })

    except Exception as e:

        return jsonify({

            "error":
            str(e)

        }), 500
    

    # -----------------------------------
# Get Appointments API
# -----------------------------------
@app.route("/appointment", methods=["GET"])
def get_appointments():

    try:

        appointments = []

        data = appointments_collection.find()

        for item in data:

            appointments.append({

                "_id":
                str(item["_id"]),

                "patient":
                item["patient"],

                
                "doctor":
                item["doctor"],

                "date":
                item["date"],

                "time":
                item["time"],

                "status":
                item["status"]

            })

        return jsonify(appointments)

    except Exception as e:

        return jsonify({

            "error":
            str(e)

        }), 500
    
#    # -----------------------------------
# # Get All Appointments
# # -----------------------------------
# @app.route("/appointments", methods=["GET"])
# def get_appointments():

#     try:

#         appointments = list(
#             appointments_collection.find()
#         )

#         # Convert ObjectId to string
#         for appointment in appointments:

#             appointment["_id"] = str(
#                 appointment["_id"]
#             )

#         return jsonify(appointments)

#     except Exception as e:

#         return jsonify({

#             "error":
#             str(e)

#         }), 500
    \

# ============================================
# HEALTH HISTORY
# ============================================

@app.route("/health-history/<email>", methods=["GET"])
def get_health_history(email):

    try:

        records = list(

            health_collection.find(

                {

                    "email": email

                },

                {

                    "_id": 0

                }

            ).sort(

                "createdAt",

                -1

            )

        )

        return jsonify(records)

    except Exception as e:

        return jsonify({

            "error": str(e)

        }),500


    # -----------------------------------
# Delete Appointment API
# -----------------------------------
@app.route("/delete-appointment/<id>", methods=["DELETE"])
def delete_appointment(id):

    try:

        appointments_collection.delete_one({

            "_id":
            ObjectId(id)

        })

        return jsonify({

            "message":
            "Appointment cancelled"

        })

    except Exception as e:

        return jsonify({

            "error":
            str(e)

        }), 500
    

# -----------------------------------
# Generate PDF Report API
# -----------------------------------
@app.route("/generate-report", methods=["POST"])
def generate_report():

    try:

        data = request.json

        disease = data["disease"]

        doctor = data["doctor"]

        medicine = data["medicine"]

        diet = data["diet"]

        precaution = data["precaution"]

        severity = data["severity"]

        alert = data["alert"]

        ai_recommendation = data["aiRecommendation"]

        # PDF File
        file_path = "medical_report.pdf"

        doc = SimpleDocTemplate(file_path)

        styles = getSampleStyleSheet()

        elements = []

        elements.append(

            Paragraph(
                "ArogyaAI Medical Report",
                styles["Title"]
            )

        )

        elements.append(
            Spacer(1, 20)
        )

        elements.append(

            Paragraph(
                f"<b>Disease:</b> {disease}",
                styles["BodyText"]
            )

        )

        elements.append(
            Spacer(1, 10)
        )

        elements.append(

            Paragraph(
                f"<b>Recommended Doctor:</b> {doctor}",
                styles["BodyText"]
            )

        )

        elements.append(
            Spacer(1, 10)
        )

        elements.append(

            Paragraph(
                f"<b>Medicine:</b> {medicine}",
                styles["BodyText"]
            )

        )

        elements.append(
            Spacer(1, 10)
        )

        elements.append(

            Paragraph(
                f"<b>Diet:</b> {diet}",
                styles["BodyText"]
            )

        )

        elements.append(
            Spacer(1, 10)
        )

        elements.append(

            Paragraph(
                f"<b>Precaution:</b> {precaution}",
                styles["BodyText"]
            )

        )

        elements.append(
            Spacer(1, 10)
        )

        elements.append(

            Paragraph(
                f"<b>Severity:</b> {severity}",
                styles["BodyText"]
            )

        )

        elements.append(
            Spacer(1, 10)
        )

        elements.append(

            Paragraph(
                f"<b>Emergency Advice:</b> {alert}",
                styles["BodyText"]
            )

        )

        elements.append(
            Spacer(1, 10)
        )

        elements.append(

            Paragraph(
                f"<b>AI Recommendation:</b> {ai_recommendation}",
                styles["BodyText"]
            )

        )

        elements.append(
            Spacer(1, 20)
        )

        elements.append(

            Paragraph(
                "<b>Health Tip:</b> Drink plenty of water, take proper rest, and maintain a healthy lifestyle.",
                styles["BodyText"]
            )

        )

        # Build PDF
        doc.build(elements)

        return jsonify({

            "message":
            "PDF generated successfully",

            "file":
            file_path

        })

    except Exception as e:

        return jsonify({

            "error":
            str(e)

        }), 500

# -----------------------------------
# Send Email Report API
# -----------------------------------
@app.route("/send-email", methods=["POST"])
def send_email():

    try:

        data = request.json

        receiver_email = data["email"]

        # Sender Email
        sender_email = "patyalnitin69@gmail.com"

        # Gmail App Password
        sender_password = "umls icnq lbny ocze"

        # Email Setup
        message = MIMEMultipart()

        message["From"] = sender_email

        message["To"] = receiver_email

        message["Subject"] = "ArogyaAI Medical Report"

        body = """

Hello,

Your AI-generated medical report is attached.

Regards,
ArogyaAI Team

"""

        message.attach(
            MIMEText(body, "plain")
        )

        # Attach PDF
        filename = "medical_report.pdf"

        attachment = open(filename, "rb")

        part = MIMEBase(
            "application",
            "octet-stream"
        )

        part.set_payload(
            attachment.read()
        )

        encoders.encode_base64(part)

        part.add_header(

            "Content-Disposition",

            f"attachment; filename={filename}"

        )

        message.attach(part)

        # Gmail SMTP
        server = smtplib.SMTP(
    "smtp.gmail.com",
    587,
    timeout=10
)

        server.starttls()

        server.login(
            sender_email,
            sender_password
        )

        text = message.as_string()

        server.sendmail(

            sender_email,

            receiver_email,

            text

        )

        server.quit()

        return jsonify({

            "message":
            "Email sent successfully"

        })

    except Exception as e:

        return jsonify({

            "error":
            str(e)

        }), 500

# -----------------------------------
# Download PDF Route
# -----------------------------------
@app.route("/medical_report.pdf")
def download_pdf():

    return send_file(

        "medical_report.pdf",

        as_attachment=False

    )

#Symptoms List API
@app.route("/symptoms", methods=["GET"])
def symptoms():

    df = pd.read_csv("datasets/symptoms_master.csv")

    return jsonify(

        df["Symptom"].tolist()

    )

# Doctor List API
@app.route("/doctors", methods=["GET"])
def doctors():

    return jsonify([

        "General Physician",
        "Cardiologist",
        "Pulmonologist",
        "Neurologist",
        "Dermatologist",
        "Gastroenterologist",
        "Endocrinologist",
        "Nephrologist",
        "Urologist",
        "Orthopedic Surgeon",
        "ENT Specialist",
        "Ophthalmologist",
        "Hematologist",
        "Psychiatrist",
        "Psychologist",
        "Rheumatologist",
        "Infectious Disease Specialist",
        "General Surgeon",
        "Pediatrician",
        "Gynecologist",
        "Oncologist",
        "Allergist / Immunologist",
        "Dentist",
        "Physiotherapist",
        "Plastic Surgeon",
        "Vascular Surgeon",
        "Neurosurgeon",
        "Cardiothoracic Surgeon",
        "Hepatologist",
        "Immunologist",
        "Pain Management Specialist",
        "Sports Medicine Specialist",
        "Critical Care Specialist",
        "Emergency Medicine Physician",
        "Family Medicine Physician",
        "Sleep Medicine Specialist",
        "Nutritionist / Dietitian",
        "Rehabilitation Specialist",
        "Radiologist",
        "Pathologist"
    ])


# -----------------------------------
# AI Medicine Explanation API
# -----------------------------------
@app.route("/explain-medicine", methods=["POST"])
def explain_medicine():

    try:

        data = request.get_json()

        prescription_text = data.get(
            "text",
            ""
        )

        prompt = f"""
You are a healthcare AI assistant.

Explain these medicines simply.

Include:
- medicine purpose
- dosage guidance
- precautions

Prescription:
{prescription_text}
"""

        response = requests.post(

            url="https://openrouter.ai/api/v1/chat/completions",

            headers={
    "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
    "Content-Type": "application/json",
    "HTTP-Referer": "https://arogyaaiv2.netlify.app",
    "X-Title": "ArogyaAI"
},

            json={

                "model":
                "openai/gpt-3.5-turbo",

                "messages": [

                    {

                        "role":
                        "user",

                        "content":
                        prompt

                    }

                ]

            }

        )

        result = response.json()

        ai_reply = result["choices"][0]["message"]["content"]

        return jsonify({

            "reply":
            ai_reply

        })

    except Exception as e:

        print(str(e))

        return jsonify({

            "reply":
            "Unable to explain medicines."

        }), 500

# -----------------------------------
# Prescription OCR API
# -----------------------------------
@app.route("/scan-prescription", methods=["POST"])
def scan_prescription():

    try:

        if "file" not in request.files:

            return jsonify({

                "error":
                "No file uploaded"

            }), 400

        file = request.files["file"]

        if file.filename == "":

            return jsonify({

                "error":
                "Empty file"

            }), 400

        # Save File
        upload_path = os.path.join(
            "uploads",
            file.filename
        )

        file.save(upload_path)

        # OCR Extraction
        image = Image.open(upload_path)

        extracted_text = pytesseract.image_to_string(
            image
        )

        print(extracted_text)

        return jsonify({

            "text":
            extracted_text

        })

    except Exception as e:

        print(str(e))

        return jsonify({

            "error":
            str(e)

        }), 500
    
    # -----------------------------------
# Send Medicine Reminder Email
# -----------------------------------
@app.route("/send-medicine-email", methods=["POST"])
def send_medicine_email():

    try:

        data = request.get_json()

        email = data.get("email")
        medicine = data.get("medicine")

        payload = {

            "service_id": os.getenv("EMAILJS_SERVICE_ID"),

            "template_id": os.getenv("EMAILJS_MEDICINE_TEMPLATE_ID"),

            "user_id": os.getenv("EMAILJS_PUBLIC_KEY"),

            "template_params": {

                "to_email": email,

                "medicine": medicine,

                "app_name": "ArogyaAI"

            }

        }

        response = requests.post(

            "https://api.emailjs.com/api/v1.0/email/send",

            json=payload,

            headers={
                "Content-Type": "application/json"
            },

            timeout=15

        )

        if response.status_code == 200:

            return jsonify({

                "message": "Reminder email sent successfully"

            })

        return jsonify({

            "error": response.text

        }), response.status_code

    except Exception as e:

        return jsonify({

            "error": str(e)

        }), 500
# -----------------------------------
# Run Flask App
# -----------------------------------
if __name__ == "__main__":

    app.run(debug=True)