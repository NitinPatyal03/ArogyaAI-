import { useRef, useState } from "react";
import toast from "react-hot-toast";

function FloatingScanner() {
  const fileInput = useRef();

  const [prescriptionText, setPrescriptionText] = useState("");

  const [showResult, setShowResult] = useState(false);

  const [loading, setLoading] = useState(false);

  const scanPrescription = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    try {
      setLoading(true);

      toast.loading("Scanning Prescription...", {
        id: "scan",
      });

      const response = await fetch(
        "https://arogyaai-backend-wudu.onrender.com/scan-prescription",

        {
          method: "POST",

          body: formData,
        },
      );

      const data = await response.json();

      setPrescriptionText(data.text || "No text detected.");

      setShowResult(true);

      toast.success(
        "Prescription Scanned Successfully",

        {
          id: "scan",
        },
      );
    } catch (error) {
      console.log(error);

      toast.error(
        "Failed to Scan Prescription",

        {
          id: "scan",
        },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Camera Button */}

      <button
        onClick={() => fileInput.current.click()}
        className="
    floating-camera
    fixed
    bottom-6
    left-6
    w-16
    h-16
    rounded-full
    bg-green-600
    hover:bg-green-700
    text-white
    text-3xl
    shadow-xl
    hover:shadow-green-400/60
    hover:scale-110
    transition-all
    duration-300
    z-50
  "
      >
        📷
      </button>

      {/* Hidden File Input */}

      <input
        type="file"
        accept="image/*"
        ref={fileInput}
        hidden
        onChange={scanPrescription}
      />

      {/* Loading Overlay */}

      {loading && (
        <div
          className="
            fixed
            inset-0
            bg-black/40
            flex
            justify-center
            items-center
            z-50
            "
        >
          <div
            className="
              bg-white
              p-8
              rounded-3xl
              shadow-xl
              text-center
              "
          >
            <div className="text-5xl">⏳</div>

            <p className="mt-4">Scanning Prescription...</p>
          </div>
        </div>
      )}

      {/* OCR Result Popup */}

      {showResult && (
        <div
          className="
            fixed
            inset-0
            bg-black/50
            flex
            justify-center
            items-center
            z-50
            "
        >
          <div
            className="
              bg-white
              rounded-3xl
              shadow-2xl
              w-[700px]
              max-w-[95%]
              max-h-[90vh]
              overflow-hidden
              "
          >
            {/* Header */}

            <div
              className="
                bg-blue-600
                text-white
                p-5
                flex
                justify-between
                items-center
                "
            >
              <h2 className="text-2xl font-bold">
                📄 Prescription Scan Result
              </h2>

              <button onClick={() => setShowResult(false)} className="text-2xl">
                ✕
              </button>
            </div>

            {/* Body */}

            <div className="p-6">
              <h3 className="font-bold mb-3">Extracted Text</h3>

              <textarea
                value={prescriptionText}
                readOnly
                className="
                  w-full
                  h-64
                  border
                  rounded-xl
                  p-4
                  resize-none
                  bg-gray-50
                  "
              />

              <div
                className="
                  mt-6
                  flex
                  justify-end
                  gap-3
                  "
              >
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(prescriptionText)
                  }
                  className="
                    bg-green-600
                    hover:bg-green-700
                    text-white
                    px-5
                    py-3
                    rounded-xl
                    "
                >
                  📋 Copy
                </button>

                <button
                  onClick={() => setShowResult(false)}
                  className="
                    bg-red-600
                    hover:bg-red-700
                    text-white
                    px-5
                    py-3
                    rounded-xl
                    "
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FloatingScanner;
