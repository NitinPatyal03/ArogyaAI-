import pandas as pd
import joblib

from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.model_selection import (
    train_test_split,
    cross_val_score
)
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

print("=" * 60)
print("AROGYAAI MODEL TRAINING (VERSION 2)")
print("=" * 60)

# -----------------------------------
# Load Dataset
# -----------------------------------

print("\nLoading dataset...")

df = pd.read_csv("datasets/disease_info_v2.csv")

print("Dataset Loaded Successfully")

# -----------------------------------
# Convert Symptoms to List
# -----------------------------------

df["Symptoms"] = df["Symptoms"].apply(

    lambda x: [

        symptom.strip().lower()

        for symptom in str(x).split(",")

    ]

)

# -----------------------------------
# Encode Symptoms
# -----------------------------------

print("\nEncoding Symptoms...")

mlb = MultiLabelBinarizer()

X = mlb.fit_transform(df["Symptoms"])

y = df["Disease"]

# -----------------------------------
# Split Dataset
# -----------------------------------

X_train, X_test, y_train, y_test = train_test_split(

    X,

    y,

    test_size=0.20,

    random_state=42,

    stratify=y

)

# -----------------------------------
# Train Model
# -----------------------------------

print("\nTraining Random Forest Model...")

model = RandomForestClassifier(

    n_estimators=700,

    random_state=42,

    n_jobs=-1,

    class_weight="balanced"

)

model.fit(

    X_train,

    y_train

)

# -----------------------------------
# Prediction
# -----------------------------------

predictions = model.predict(X_test)

accuracy = accuracy_score(

    y_test,

    predictions

)

# -----------------------------------
# Cross Validation
# -----------------------------------

cv_scores = cross_val_score(

    model,

    X,

    y,

    cv=5,

    n_jobs=-1

)

# -----------------------------------
# Results
# -----------------------------------

print("\n" + "=" * 60)

print("MODEL EVALUATION")

print("=" * 60)

print(f"\nAccuracy : {accuracy*100:.2f}%")

print(f"\nCross Validation Accuracy : {cv_scores.mean()*100:.2f}%")

print("\nClassification Report\n")

print(

    classification_report(

        y_test,

        predictions

    )

)

print("\nConfusion Matrix Size :")

cm = confusion_matrix(

    y_test,

    predictions

)

print(cm.shape)

# -----------------------------------
# Dataset Statistics
# -----------------------------------

print("\n" + "=" * 60)

print("DATASET STATISTICS")

print("=" * 60)

print(f"\nTotal Diseases : {len(model.classes_)}")

print(f"Total Symptoms : {len(mlb.classes_)}")

print(f"Training Samples : {len(df)}")

print(f"Training Data : {len(X_train)}")

print(f"Testing Data : {len(X_test)}")

# -----------------------------------
# Save Model
# -----------------------------------

print("\nSaving Model...")

joblib.dump(

    model,

    "models/model_v2.pkl"

)

joblib.dump(

    mlb,

    "models/mlb_v2.pkl"

)

print("\nModel Saved Successfully!")

print("\nFiles Created:")

print("models/model_v2.pkl")

print("models/mlb_v2.pkl")

print("\nTraining Completed Successfully!")

print("=" * 60)