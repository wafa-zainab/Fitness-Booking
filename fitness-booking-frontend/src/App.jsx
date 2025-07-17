import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import ClassList from "./components/ClassList";
import BookingForm from "./components/BookingForm";
import BookingList from "./components/BookingList";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState("list");

  const validEmail = /\S+@\S+\.\S+/.test(email.trim());

  const handleClick = (target) => {
    if (target === "my" && !validEmail) {
      alert("⚠️ Please enter a valid email to view your bookings.");
      return;
    }
    setMode(target);
  };

  return (
    <div className="app">
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1>🏋️ Fitness studio Booking</h1>

        <motion.input
          type="email"
          placeholder="Please enter a valid email to view your bookings"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="email-input"
          whileFocus={{ scale: 1.02 }}
        />

        <div className="btns">
          {[
            { key: "list", label: "All Classes" },
            { key: "form", label: "Book a Class" },
            { key: "my", label: "My Bookings" },
          ].map((btn) => (
            <motion.button
              key={btn.key}
              onClick={() => handleClick(btn.key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {btn.label}
            </motion.button>
          ))}
        </div>

        <div className="content">
          <AnimatePresence mode="wait">
            {mode === "list" && (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <ClassList email={validEmail ? email.trim() : ""} />
              </motion.div>
            )}

            {mode === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <BookingForm />
              </motion.div>
            )}

            {mode === "my" && (
              <motion.div
                key="my"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <BookingList email={email.trim()} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default App;
