import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
// import GoogleFitLogin from "./GoogleFitLogin";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// -----------------------------------
// Symptoms List
// -----------------------------------
const symptomOptions = [
  "fever",
  "cough",
  "headache",
  "fatigue",
  "chills",
  "nausea",
  "vomiting",
  "diarrhea",
  "joint pain",
  "breathlessness",
  "sore throat",
  "dizziness",
  "chest pain",
  "sweating",
  "weight loss",
  "persistent cough",
  "high fever",
  "blood in urine",
  "seizures",
];

// -----------------------------------
// Multi-language Support
// -----------------------------------
const translations = {
  en: {
    subtitle: "Your Virtual Health Assistant",
    selectSymptoms: "Select Symptoms",
    askButton: "Ask ArogyaAI",
    listening: "Listening...",
    micOff: "Microphone Off",
    voiceInput: "Voice Input",
    aiChat: "AI Chat",
    download: "Download Report",
    location: "Get My Location",
    hospitals: "Nearby Hospitals",
    logout: "Logout",
  },

  hi: {
    subtitle: "आपका वर्चुअल हेल्थ असिस्टेंट",
    selectSymptoms: "लक्षण चुनें",
    askButton: "पूछें",
    listening: "सुन रहा है...",
    micOff: "माइक्रोफोन बंद",
    voiceInput: "आवाज़ इनपुट",
    aiChat: "एआई चैट",
    download: "रिपोर्ट डाउनलोड करें",
    location: "मेरा स्थान प्राप्त करें",
    hospitals: "नज़दीकी अस्पताल",
    logout: "लॉगआउट",
  },

  pa: {
    subtitle: "ਤੁਹਾਡਾ ਵਰਚੁਅਲ ਹੈਲਥ ਅਸਿਸਟੈਂਟ",
    selectSymptoms: "ਲੱਛਣ ਚੁਣੋ",
    askButton: "ਪੁੱਛੋ",
    listening: "ਸੁਣ ਰਿਹਾ ਹੈ...",
    micOff: "ਮਾਈਕ੍ਰੋਫੋਨ ਬੰਦ",
    voiceInput: "ਆਵਾਜ਼ ਇਨਪੁੱਟ",
    aiChat: "ਏਆਈ ਚੈਟ",
    download: "ਰਿਪੋਰਟ ਡਾਊਨਲੋਡ ਕਰੋ",
    location: "ਮੇਰਾ ਸਥਾਨ ਲਵੋ",
    hospitals: "ਨੇੜਲੇ ਹਸਪਤਾਲ",
    logout: "ਲੌਗਆਉਟ",
  },
};

function App() {
  // -----------------------------------
  // Route Protection
  // -----------------------------------

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.replace("/login");
    }
  }, []);

  // -----------------------------------
  // States
  // -----------------------------------
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  const [messages, setMessages] = useState([]);

  const [language, setLanguage] = useState("en");

  const [location, setLocation] = useState(null);

  const [prediction, setPrediction] = useState(null);

  const [chatInput, setChatInput] = useState("");

  const [prescriptionText, setPrescriptionText] = useState("");

  const [medicineExplanation, setMedicineExplanation] = useState("");

  // -----------------------------------
  // Voice Recognition
  // -----------------------------------
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  // -----------------------------------
  // Get User Location
  // -----------------------------------
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,

          longitude: position.coords.longitude,
        });
      },

      () => {
        toast.error("Location access denied");
      },
    );
  };

  // -----------------------------------
  // Logout
  // -----------------------------------
  const logout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("role");

    localStorage.removeItem("name");

    window.location.href = "/login";
  };

  // -----------------------------------
  // Download PDF Report
  // -----------------------------------
  const downloadReport = async () => {
    if (!prediction) {
      toast.error("No prediction available");

      return;
    }

    try {
      await fetch("http://127.0.0.1:5000/generate-report", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          disease: prediction.disease,

          doctor: prediction.doctor,

          medicine: prediction.medicine,

          diet: prediction.diet,

          precaution: prediction.precaution,

          severity: prediction.severity,

          alert: prediction.alert,

          aiRecommendation:
            prediction.severity === "Critical"
              ? "Your symptoms appear serious. Please seek immediate medical attention."
              : prediction.severity === "High"
                ? "Your condition may require doctor consultation soon."
                : prediction.severity === "Medium"
                  ? "Your condition looks manageable but should be monitored."
                  : "Your symptoms appear mild. Maintain healthy habits.",
        }),
      });

      toast.success("PDF Downloaded 📄");

      // Open PDF
      window.open(
        "http://127.0.0.1:5000/medical_report.pdf",

        "_blank",
      );
    } catch (error) {
      console.log(error);

      toast.error("PDF generation failed");
    }
  };
  const sendEmailReport = async () => {
    const email = prompt("Enter email address");

    if (!email) return;

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/send-email",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email,
          }),
        },
      );

      const data = await response.json();

      toast.success(data.message);
    } catch (error) {
      console.log(error);

      toast.error("Email failed");
    }
  };

  const sendAIMessage = async () => {
    if (!chatInput) return;

    // User Message
    const userMessage = {
      sender: "user",

      text: chatInput,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/ai-chat",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message: chatInput,
          }),
        },
      );

      const data = await response.json();

      // AI Reply
      const botMessage = {
        sender: "bot",

        text: data.reply || "AI response not available",

        severity: "Low",
      };

      setMessages((prev) => [...prev, botMessage]);

      // Voice
      const speech = new SpeechSynthesisUtterance(data.reply);

      window.speechSynthesis.speak(speech);

      setChatInput("");
    } catch (error) {
      console.log(error);
    }
  };

  const scanPrescription = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/scan-prescription",

        {
          method: "POST",

          body: formData,
        },
      );

      const data = await response.json();

      setPrescriptionText(data.text);
      explainMedicine(data.text);
    } catch (error) {
      console.log(error);
    }
  };

  const explainMedicine = async (text) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/explain-medicine",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            text,
          }),
        },
      );

      const data = await response.json();

      setMedicineExplanation(data.reply);
    } catch (error) {
      console.log(error);
    }
  };

  // -----------------------------------
  // Predict Disease
  // -----------------------------------
  const predictDisease = async () => {
    let symptomList = selectedSymptoms;

    // Detect Symptoms from Voice
    if (transcript) {
      symptomList = symptomOptions.filter((symptom) =>
        transcript.toLowerCase().includes(symptom),
      );
    }

    // No Symptoms
    if (symptomList.length === 0) {
      toast.error("Please select or speak symptoms");

      return;
    }

    // User Message
    const userMessage = {
      sender: "user",

      text: `I have ${symptomList.join(", ")}`,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      // API Request
      const response = await fetch(
        "http://127.0.0.1:5000/predict",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            symptoms: symptomList,

            email: localStorage.getItem("email"),
          }),
        },
      );

      const data = await response.json();

      console.log(data);

      // Save Prediction
      setPrediction(data);

      // -----------------------------------
      // AI Smart Recommendation
      // -----------------------------------
      let aiExtraMessage = "";

      if (data.severity === "Critical") {
        aiExtraMessage =
          "Your symptoms appear serious. Please seek immediate medical attention.";
      } else if (data.severity === "High") {
        aiExtraMessage = "Your condition may require doctor consultation soon.";
      } else if (data.severity === "Medium") {
        aiExtraMessage =
          "Your condition looks manageable but should be monitored.";
      } else {
        aiExtraMessage = "Your symptoms appear mild. Maintain healthy habits.";
      }

      // -----------------------------------
      // AI Chat Response
      // -----------------------------------
      const botReply = `

🤖 ArogyaAI Analysis

Based on your symptoms,
you may have:

🩺 ${data.disease || "Unknown Disease"}

👨‍⚕ Recommended Specialist:
${data.doctor || "General Physician"}

💊 Suggested Medicine:
${data.medicine || "Not Available"}

🥗 Recommended Diet:
${data.diet || "Not Available"}

⚠ Precautions:
${data.precaution || "Not Available"}

🚨 Severity Level:
${data.severity || "Unknown"}

🚑 Emergency Advice:
${data.alert || "No Alert"}

🧠 AI Recommendation:
${aiExtraMessage}

🩺 Health Tip:
Drink plenty of water,
take proper rest,
and monitor your symptoms regularly.

`;

      // Bot Message
      const botMessage = {
        sender: "bot",

        text: botReply,

        severity: data.severity,
      };

      setMessages((prev) => [...prev, botMessage]);

      // Voice Output
      const speech = new SpeechSynthesisUtterance(
        `You may have ${data.disease}.
        Recommended doctor is ${data.doctor}.
        Recommended medicine is ${data.medicine}.
        Severity level is ${data.severity}.`,
      );

      window.speechSynthesis.speak(speech);

      // Reset Voice Transcript
      resetTranscript();
    } catch (error) {
      console.log(error);

      toast.error("Prediction Failed");
    }
  };

  // -----------------------------------
  // UI
  // -----------------------------------
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center p-6">
      {/* Header */}
      <div className="text-center mb-6 flex flex-col items-center">
        <div className="flex gap-4 mb-4">
          {/* Dashboard */}
          <a
            href="/dashboard"
            className="
  bg-blue-700
  hover:bg-blue-800
  text-white
  px-4
  py-2
  rounded-xl
  transition
  "
          >
            📊 Dashboard
          </a>

          <a
            href="/history"
            className="
  bg-indigo-600
  hover:bg-indigo-700
  text-white
  px-6
  py-3
  rounded-2xl
  shadow-lg
  "
          >
            📋 Medical History
          </a>

          <a
            href="/appointment"
            className="
  bg-green-600
  hover:bg-green-700
  text-white
  px-4
  py-2
  rounded-xl
  transition
  "
          >
            📅 Appointments
          </a>

          <a
            href="/sos"
            className="
  bg-red-600
  hover:bg-red-700
  text-white
  px-5
  py-3
  rounded-2xl
  shadow-lg
  animate-pulse
  "
          >
            🚨 Emergency SOS
          </a>

          <a
            href="/medicine-reminder"
            className="
  bg-purple-600
  hover:bg-purple-700
  text-white
  px-5
  py-3
  rounded-2xl
  shadow-lg
  transition
  duration-300
  "
          >
            💊 Medicine Reminder
          </a>

          <a
            href="/health-monitor"
            className="
  bg-cyan-600
  hover:bg-cyan-700
  text-white
  px-5
  py-3
  rounded-2xl
  shadow-lg
  "
          >
            ⌚ Health Monitor
          </a>

          {localStorage.getItem("role") === "admin" && (
            <a
              href="/admin"
              className="
  bg-black
  hover:bg-gray-800
  text-white
  px-5
  py-3
  rounded-2xl
  shadow-lg
  "
            >
              👨‍⚕️ Admin
            </a>
          )}

          {/* Logout */}
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-xl"
          >
            {translations[language].logout}
          </button>
        </div>
        {/* <div className="mb-6">
  <GoogleFitLogin />
</div> */}

        <h1 className="text-5xl font-bold text-blue-700">ArogyaAI 🩺</h1>

        <p className="text-gray-600 mt-2">{translations[language].subtitle}</p>
      </div>

      {/* Main Card */}
      <div className="bg-white w-full max-w-2xl p-6 rounded-2xl shadow-lg">
        {/* Language Selector */}
        <div className="mb-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border p-3 rounded-xl"
          >
            <option value="en">English</option>

            <option value="hi">हिन्दी</option>

            <option value="pa">ਪੰਜਾਬੀ</option>
          </select>
        </div>

        {/* Symptoms Heading */}
        <h2 className="text-2xl font-semibold mb-4">
          {translations[language].selectSymptoms}
        </h2>

        {/* Location Button */}
        <button
          onClick={getLocation}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl mb-4"
        >
          📍 {translations[language].location}
        </button>

        {/* Voice Buttons */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={() =>
              SpeechRecognition.startListening({
                continuous: true,
              })
            }
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
          >
            🎤 Start Voice
          </button>

          <button
            onClick={() => SpeechRecognition.stopListening()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"
          >
            ⏹ Stop
          </button>
        </div>

        {/* Listening Status */}
        <p className="mb-4 text-sm text-gray-600">
          {listening
            ? translations[language].listening
            : translations[language].micOff}
        </p>

        {/* Voice Transcript */}
        <div className="bg-gray-100 p-4 rounded-xl mb-4">
          <p className="font-bold">{translations[language].voiceInput}</p>

          <p>{transcript}</p>
        </div>

        {/* Symptoms Select */}
        <select
          multiple
          value={selectedSymptoms}
          onChange={(e) =>
            setSelectedSymptoms(
              [...e.target.selectedOptions].map((option) => option.value),
            )
          }
          className="w-full border rounded-xl p-4 h-56"
        >
          {symptomOptions.map((symptom) => (
            <option key={symptom} value={symptom}>
              {symptom}
            </option>
          ))}
        </select>

        {/* Predict Button */}
        <button
          onClick={predictDisease}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl w-full"
        >
          {translations[language].askButton}
        </button>
      </div>

      {/* Prescription Scanner */}
      <div className="bg-white w-full max-w-2xl mt-6 p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">📸 Prescription Scanner</h2>

        <input
          type="file"
          accept="image/*"
          onChange={scanPrescription}
          className="mb-4"
        />

        {prescriptionText && (
          <div className="bg-gray-100 p-4 rounded-xl whitespace-pre-wrap">
            {prescriptionText}
          </div>
        )}
      </div>
      {/* AI Medicine Explanation */}
      {medicineExplanation && (
        <div className="bg-blue-50 p-4 rounded-xl mt-4 whitespace-pre-wrap">
          <h3 className="font-bold text-lg mb-2">🧠 AI Medicine Explanation</h3>

          {medicineExplanation}
        </div>
      )}

      {/* Chat Section */}
      <div className="bg-white w-full max-w-2xl mt-6 p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">
          {translations[language].aiChat}
        </h2>

        {/* Messages */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.sender === "user"
                  ? "flex justify-end"
                  : "flex justify-start"
              }
            >
              <div
                className={
                  msg.sender === "user"
                    ? "bg-blue-600 text-white p-4 rounded-2xl max-w-md"
                    : msg.severity === "Critical"
                      ? "bg-red-500 text-white p-4 rounded-2xl max-w-md"
                      : msg.severity === "High"
                        ? "bg-orange-400 text-black p-4 rounded-2xl max-w-md"
                        : msg.severity === "Medium"
                          ? "bg-yellow-300 text-black p-4 rounded-2xl max-w-md"
                          : "bg-gray-200 text-black p-4 rounded-2xl max-w-md"
                }
              >
                {/* Message Text */}
                <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>

                {/* Bot Buttons */}
                {msg.sender === "bot" && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {/* Download PDF */}
                    <button
                      onClick={downloadReport}
                      className="bg-green-600 text-white px-4 py-2 rounded-xl"
                    >
                      {translations[language].download}
                    </button>

                    {/* Nearby Hospitals */}
                    {location && (
                      <a
                        href={`https://www.google.com/maps/search/hospitals/@${location.latitude},${location.longitude},15z`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-red-600 text-white px-4 py-2 rounded-xl"
                      >
                        🚑 {translations[language].hospitals}
                      </a>
                    )}

                    {/* Email Report */}
                    <button
                      onClick={sendEmailReport}
                      className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                    >
                      📧 Email Report
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Gemini AI Input */}
        <div className="flex gap-4 mt-6">
          <input
            type="text"
            placeholder="Ask ArogyaAI..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendAIMessage();
              }
            }}
            className="flex-1 border p-3 rounded-xl"
          />

          <button
            onClick={sendAIMessage}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
