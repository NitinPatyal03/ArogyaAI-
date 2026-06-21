import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import MultiLabelBinarizer
import joblib

# Load dataset
df = pd.read_csv("datasets/disease_info.csv", encoding="latin1")

# Convert symptoms string into list
df["Symptoms"] = df["Symptoms"].apply(lambda x: x.split(","))

# Convert symptoms into binary vectors
mlb = MultiLabelBinarizer()
X = mlb.fit_transform(df["Symptoms"])

# Target column
y = df["Disease"]

# Train model
model = RandomForestClassifier()
model.fit(X, y)

# Save model and encoder
joblib.dump(model, "model.pkl")
joblib.dump(mlb, "mlb.pkl")

print("✅ Model trained successfully")