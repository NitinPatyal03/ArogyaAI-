from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Read MongoDB URI from .env
MONGO_URI = os.getenv("MONGO_URI")

# Connect to MongoDB Atlas
client = MongoClient(MONGO_URI)

# Database Name
db = client["arogyaai"]

# Collections
users_collection = db["users"]
prediction_history_collection = db["prediction_history"]
appointments_collection = db["appointments"]