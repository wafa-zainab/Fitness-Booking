import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./BF.css";

function BookingForm() {
  const [form, setForm] = useState({
    class_id: "",
    client_name: "",
    client_email: "",
  });

  const [classes, setClasses] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(false);

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // ✅ useCallback prevents ESLint warning
  const fetchClasses = useCallback(() => {
    axios
      .get(`http://localhost:5000/classes?timezone=${timezone}`)
      .then((res) => setClasses(res.data))
      .catch(() => setClasses([]));
  }, [timezone]);

  useEffect(() => {
    fetchClasses(); // ✅ ESLint-compliant
  }, [fetchClasses]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!isValidEmail(form.client_email)) {
      setMessage("Please enter a valid email.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/book", form);
      setMessage(res.data.message);
      setMessageType("success");
      setForm({ ...form, class_id: "", client_name: "" });
      fetchClasses(); // 🔄 refresh class list
    } catch (err) {
      const error = err.response?.data?.error || "Booking failed.";
      setMessage(error);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h2>📅 Book a Class</h2>

      <label>
        Select Class:
        <select
          name="class_id"
          value={form.class_id}
          onChange={handleChange}
          required
        >
          <option value="">-- Choose a class --</option>
          {classes.map((c) => (
            <option
              key={c.id}
              value={c.id}
              disabled={c.already_booked || c.available_slots <= 0}
            >
              {c.name} ({c.datetime}) — {c.instructor} [{c.available_slots} slots]
              {c.already_booked ? " - Already Booked" : ""}
            </option>
          ))}
        </select>
      </label>

      <label>
        Your Name:
        <input
          type="text"
          name="client_name"
          value={form.client_name}
          onChange={handleChange}
          placeholder="e.g., John Doe"
          required
        />
      </label>

      <label>
        Email:
        <input
          type="email"
          name="client_email"
          value={form.client_email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Booking..." : "Book Now"}
      </button>

      {message && (
        <p className={`feedback ${messageType}`}>
          {messageType === "success" ? "✅" : "❌"} {message}
        </p>
      )}
    </form>
  );
}

export default BookingForm;
