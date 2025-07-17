import { useEffect, useState } from "react";
import axios from "axios";
import "./BL.css";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

function BookingList({ email }) {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Valid email is required to view bookings.");
      setLoading(false);
      return;
    }

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    axios
      .get(`http://localhost:5000/bookings?email=${email}&timezone=${timezone}`)
      .then((res) => {
        setBookings(res.data);
        setError("");
      })
      .catch(() => setError("❌ Failed to load bookings. Please try again later."))
      .finally(() => setLoading(false));
  }, [email]);

  const cancel = async (booking_id, class_id) => {
    try {
      await axios.post("http://localhost:5000/cancel", {
        class_id: class_id,
        client_email: email,
      });
      setBookings((prev) => prev.filter((b) => b.booking_id !== booking_id));
    } catch {
      alert("❌ Failed to cancel booking.");
    }
  };

  if (loading) return <p>⏳ Loading your bookings...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <AnimatePresence>
          {bookings.map((b) => (
            <motion.div
              key={b.booking_id}
              className="class-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <strong>{b.class_name}</strong> — {b.datetime}
              <button className="cancel-btn" onClick={() => cancel(b.booking_id, b.class_id)}>
                Cancel
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}

export default BookingList;
