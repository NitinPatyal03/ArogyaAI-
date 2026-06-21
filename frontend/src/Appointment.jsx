import { useState, useEffect } from "react";
import toast from "react-hot-toast";

function Appointment() {
  // -----------------------------------
  // States
  // -----------------------------------
  const [patient, setPatient] = useState("");

  const [doctor, setDoctor] = useState("");

  const [date, setDate] = useState("");

  const [time, setTime] = useState("");

  const [appointments, setAppointments] = useState([]);

  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  
  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
  fetch("https://arogyaai-backend-wudu.onrender.com/doctors")
    .then((res) => res.json())
    .then((data) => {
      setDoctors(data);
    })
    .catch((err) => {
      console.error(err);
    });
}, []);
  // -----------------------------------
  // Fetch Appointments
  // -----------------------------------
  const fetchAppointments = async () => {
    try {
      const response = await fetch("https://arogyaai-backend-wudu.onrender.com/appointment");

      const data = await response.json();

      setAppointments(data);
    } catch (error) {
      console.log(error);
    }
  };

  // -----------------------------------
  // Book Appointment
  // -----------------------------------
  const bookAppointment = async () => {
    if (!patient || !doctor || !date || !time) {
      toast.error("Please fill all fields");

      return;
    }

    try {
      const response = await fetch(
        "https://arogyaai-backend-wudu.onrender.com/book-appointment",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            patient,
            email,
            doctor,
            date,
            time,
          }),
        },
      );

      const data = await response.json();

      toast.success(data.message);

      fetchAppointments();

      // Reset
      setPatient("");
      setDoctor("");
      setDate("");
      setTime("");
    } catch (error) {
      console.log(error);

      toast.error("Booking failed");
    }
  };

  // -----------------------------------
  // Cancel Appointment
  // -----------------------------------
  const cancelAppointment = async (id) => {
    try {
      const response = await fetch(
        `https://arogyaai-backend-wudu.onrender.com/delete-appointment/${id}`,

        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      toast.success(data.message);

      fetchAppointments();
    } catch (error) {
      console.log(error);
    }
  };

  // -----------------------------------
  // Load Appointments
  // -----------------------------------
  useEffect(() => {
    fetchAppointments();
  }, []);

  // -----------------------------------
  // UI
  // -----------------------------------
  return (
    <div className="min-h-screen bg-blue-50 p-6">
      {/* Header */}
      <div className="relative mb-10">
        <h1 className="text-center text-5xl font-bold text-blue-700">
          Doctor Appointment System 📅
        </h1>

        <a
          href="/"
          className="
        absolute
        right-0
        top-0
        bg-blue-600
        hover:bg-blue-700
        text-white
        px-6
        py-3
        rounded-2xl
        shadow-lg
        transition
        duration-300
        "
        >
          🏠 Back Home
        </a>
      </div>

      {/* Appointment Form */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl mx-auto border border-blue-100">

  {/* Header */}

  <div className="mb-8">

    <h2 className="text-3xl font-bold text-blue-700">
      📅 Book Appointment
    </h2>

    <p className="text-gray-500 mt-2">
      Schedule your consultation with a healthcare specialist.
    </p>

  </div>

  {/* Patient Name */}

  <div className="mb-5">

    <label className="block text-gray-700 font-semibold mb-2">
      👤 Patient Name
    </label>

    <input
      type="text"
      placeholder="Enter Patient Name"
      value={patient}
      onChange={(e) => setPatient(e.target.value)}
      className="w-full border border-gray-300 rounded-2xl p-4 focus:ring-4 focus:ring-blue-200 outline-none transition"
    />

  </div>

  {/* Email */}

  <div className="mb-5">

    <label className="block text-gray-700 font-semibold mb-2">
      📧 Email Address
    </label>

    <input
      type="email"
      value={email}
      readOnly
      className="w-full border border-gray-300 rounded-2xl p-4 bg-gray-100 cursor-not-allowed"
    />

  </div>

  {/* Doctor */}

  <div className="mb-5">

    <label className="block text-gray-700 font-semibold mb-2">
      👨‍⚕️ Select Doctor
    </label>

    <select
      value={doctor}
      onChange={(e) => setDoctor(e.target.value)}
      className="w-full border border-gray-300 rounded-2xl p-4 focus:ring-4 focus:ring-blue-200 outline-none"
    >

      <option value="">🩺 Select Doctor</option>

      <optgroup label="General Medicine">
        <option>General Physician</option>
        <option>Family Medicine Physician</option>
        <option>Emergency Medicine Physician</option>
      </optgroup>

      <optgroup label="Heart & Blood">
        <option>Cardiologist</option>
        <option>Cardiothoracic Surgeon</option>
        <option>Hematologist</option>
        <option>Vascular Surgeon</option>
      </optgroup>

      <optgroup label="Brain & Mental Health">
        <option>Neurologist</option>
        <option>Neurosurgeon</option>
        <option>Psychiatrist</option>
        <option>Psychologist</option>
      </optgroup>

      <optgroup label="Respiratory">
        <option>Pulmonologist</option>
        <option>Critical Care Specialist</option>
      </optgroup>

      <optgroup label="Digestive System">
        <option>Gastroenterologist</option>
        <option>General Surgeon</option>
        <option>Hepatologist</option>
      </optgroup>

      <optgroup label="Hormones & Diabetes">
        <option>Endocrinologist</option>
        <option>Nutritionist / Dietitian</option>
      </optgroup>

      <optgroup label="Kidney & Urinary">
        <option>Nephrologist</option>
        <option>Urologist</option>
      </optgroup>

      <optgroup label="Bones & Muscles">
        <option>Orthopedic Surgeon</option>
        <option>Sports Medicine Specialist</option>
        <option>Physiotherapist</option>
        <option>Rehabilitation Specialist</option>
      </optgroup>

      <optgroup label="Skin & Allergy">
        <option>Dermatologist</option>
        <option>Allergist / Immunologist</option>
        <option>Immunologist</option>
      </optgroup>

      <optgroup label="ENT & Eye">
        <option>ENT Specialist</option>
        <option>Ophthalmologist</option>
        <option>Dentist</option>
      </optgroup>

      <optgroup label="Women's & Children's Health">
        <option>Gynecologist</option>
        <option>Pediatrician</option>
      </optgroup>

      <optgroup label="Cancer Care">
        <option>Oncologist</option>
      </optgroup>

      <optgroup label="Other Specialists">
        <option>Rheumatologist</option>
        <option>Infectious Disease Specialist</option>
        <option>Pain Management Specialist</option>
        <option>Plastic Surgeon</option>
        <option>Radiologist</option>
        <option>Pathologist</option>
      </optgroup>

    </select>

  </div>

  {/* Date & Time */}

  <div className="grid md:grid-cols-2 gap-5 mb-6">

    <div>

      <label className="block text-gray-700 font-semibold mb-2">
        📅 Appointment Date
      </label>

      <input
        type="date"
        min={new Date().toISOString().split("T")[0]}
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full border border-gray-300 rounded-2xl p-4 focus:ring-4 focus:ring-blue-200 outline-none"
      />

    </div>

    <div>

      <label className="block text-gray-700 font-semibold mb-2">
        ⏰ Appointment Time
      </label>

      <input
        type="time"
        min="09:00"
        max="18:00"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-full border border-gray-300 rounded-2xl p-4 focus:ring-4 focus:ring-blue-200 outline-none"
      />

    </div>

  </div>

  {/* Info */}

  <div className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-100">

    <p className="text-sm text-blue-700">

      ℹ️ Appointment requests are available between <b>09:00 AM</b> and <b>06:00 PM</b>. Please arrive 10–15 minutes before your scheduled time.

    </p>

  </div>

  {/* Button */}

  <button
    onClick={bookAppointment}
    className="
    w-full
    bg-gradient-to-r
    from-blue-600
    to-cyan-600
    hover:from-blue-700
    hover:to-cyan-700
    text-white
    text-lg
    font-bold
    py-4
    rounded-2xl
    shadow-xl
    transition
    duration-300
    hover:scale-[1.02]
    "
  >

    📅 Confirm Appointment

  </button>

</div>

      {/* Appointment List */}
      <div className="bg-white p-6 m-5 rounded-2xl shadow-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">My Appointments</h2>

        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="border p-4 rounded-xl flex justify-between items-center"
            >
              <div>
                <p>
                  <b>Patient:</b> {appointment.patient}
                </p>

                <p>
                  <b>Doctor:</b> {appointment.doctor}
                </p>

                <p>
                  <b>Date:</b> {appointment.date}
                </p>

                <p>
                  <b>Time:</b> {appointment.time}
                </p>

                <p>
                  <b>Status:</b> {appointment.status}
                </p>
              </div>

              {/* Cancel Button */}
              <button
                onClick={() => cancelAppointment(appointment._id)}
                className="bg-red-600 text-white px-4 py-2 rounded-xl"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Appointment;
