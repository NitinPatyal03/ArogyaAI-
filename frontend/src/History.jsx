import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import toast from "react-hot-toast";

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const [search, setSearch] = useState("");

  const fetchHistory = async () => {
    const email = localStorage.getItem("email");

    const response = await fetch(`http://127.0.0.1:5000/history/${email}`);

    const data = await response.json();

    setHistory(data);
  };

  const deleteHistory = async (id) => {
    const confirmDelete = window.confirm("Delete this record?");

    if (!confirmDelete) return;

    await fetch(
      `http://127.0.0.1:5000/history/delete/${id}`,

      {
        method: "DELETE",
      },
    );

    fetchHistory();
  };

  const getSeverityColor = (severity) => {
    if (severity === "High") return "bg-red-100 text-red-700";

    if (severity === "Medium") return "bg-yellow-100 text-yellow-700";

    return "bg-green-100 text-green-700";
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);

    doc.text("ArogyaAI Medical History", 20, 20);

    let y = 40;

    history.forEach((item) => {
      doc.setFontSize(12);

      doc.text(
        `Disease: ${item.disease}`,

        20,
        y,
      );

      y += 10;

      doc.text(
        `Doctor: ${item.doctor}`,

        20,
        y,
      );

      y += 10;

      doc.text(
        `Medicine: ${item.medicine}`,

        20,
        y,
      );

      y += 10;

      doc.text(
        `Severity: ${item.severity}`,

        20,
        y,
      );

      y += 10;

      doc.text(
        `Date: ${item.date}`,

        20,
        y,
      );

      y += 20;
    });

    doc.save("Medical_History.pdf");
  };

  const filteredHistory = history.filter((item) =>
    item.disease.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-5xl font-bold text-blue-700">📋 Medical History</h1>

        <div className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="Search Disease..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
    border
    p-3
    rounded-xl
    flex-1
    "
          />

          <button
            onClick={downloadPDF}
            className="
    bg-green-600
    hover:bg-green-700
    text-white
    px-5
    rounded-xl
    "
          >
            📄 Export PDF
          </button>
        </div>

        <a
          href="/"
          className="
          bg-blue-600
          hover:bg-blue-700
          text-white
          px-6
          py-3
          rounded-2xl
          shadow-lg
          "
        >
          🏠 Back Home
        </a>
      </div>

      {history.length === 0 ? (
        <div
          className="
    bg-white
    p-8
    rounded-3xl
    shadow-xl
    text-center
    "
        >
          <h2 className="text-2xl">No Medical History Found</h2>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredHistory.map((item) => (
            <div
              key={item._id}
              className="
        bg-white
        p-6
        rounded-3xl
        shadow-xl
        "
            >
              <div
                className="
          flex
          justify-between
          items-center
          mb-4
          "
              >
                <h2
                  className="
            text-3xl
            font-bold
            text-blue-700
            "
                >
                  {item.disease}
                </h2>

                <div className="flex gap-3 items-center">
                  <span
                    className={`
              px-4
              py-2
              rounded-full
              font-bold
              ${getSeverityColor(item.severity)}
              `}
                  >
                    {item.severity}
                  </span>

                  <button
                    onClick={() => deleteHistory(item._id)}
                    className="
              bg-red-600
              hover:bg-red-700
              text-white
              px-4
              py-2
              rounded-xl
              "
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>

              <div
                className="
          grid
          md:grid-cols-3
          gap-4
          "
              >
                <div>
                  <p className="font-bold">👨‍⚕️ Doctor</p>

                  <p>{item.doctor}</p>
                </div>

                <div>
                  <p className="font-bold">💊 Medicine</p>

                  <p>{item.medicine}</p>
                </div>

                <div>
                  <p className="font-bold">📅 Date</p>

                  <p>{item.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default History;
