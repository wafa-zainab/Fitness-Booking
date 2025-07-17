import { useEffect, useState } from "react";
import axios from "axios";
import "./CL.css";

function ClassList({ email }) {
  const [classes, setClasses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [hideFull, setHideFull] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    axios
      .get(`http://localhost:5000/classes?timezone=${timezone}&email=${email}`)
      .then((res) => {
        setClasses(res.data);
        setError("");
      })
      .catch(() => setError("⚠️ Failed to load classes."));
  }, [email]);

  useEffect(() => {
    let result = classes;

    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(s) ||
          c.instructor.toLowerCase().includes(s)
      );
    }

    if (hideFull) {
      result = result.filter((c) => c.available_slots > 0);
    }

    setFiltered(result);
  }, [classes, search, hideFull]);

  if (error) return <p>{error}</p>;

  return (
    <div className="class-list">
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by class or instructor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={hideFull}
            onChange={() => setHideFull((prev) => !prev)}
          />
          Hide Full Classes
        </label>
      </div>

      {filtered.length === 0 ? (
        <p>No classes found.</p>
      ) : (
        filtered.map((c) => (
          <div
            key={c.id}
            className={`class-card ${c.available_slots === 0 ? "full" : ""}`}
          >
            <div className="class-details">
              <h3>{c.name}</h3>
              <p>
                <strong>Time:</strong> {c.datetime}
              </p>
              <p>
                <strong>Instructor:</strong> {c.instructor}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {c.already_booked
                  ? "✅ You booked this"
                  : c.available_slots === 0
                  ? "❌ Full"
                  : `${c.available_slots} slot(s) left`}
              </p>
            </div>
            {c.already_booked && <span className="badge booked">Booked</span>}
          </div>
        ))
      )}
    </div>
  );
}

export default ClassList;
