import { useEffect, useState } from "react";

function App() {
  const [view, setView] = useState("checkin"); // "checkin" or "dashboard"
  const [locations, setLocations] = useState([]);
  const [staffNumber, setStaffNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState("");
  const [checkins, setCheckins] = useState([]);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch("/api/locations")
      .then((res) => res.json())
      .then((data) => {
        setLocations(data);
        if (data.length > 0) setLocation(data[0]);
      })
      .catch((err) => {
        console.error("Failed to load locations:", err);
      });
  }, []);

  const loadCheckins = () => {
    fetch("/api/checkins")
      .then((res) => res.json())
      .then((data) => setCheckins(data))
      .catch((err) => console.error("Failed to load check-ins:", err));
  };

  useEffect(() => {
    if (view === "dashboard") {
      loadCheckins();
    }
  }, [view]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!staffNumber || !firstName || !lastName || !location) {
      setMessage("All fields are required");
      return;
    }

    try {
      const url = editingId ? `/api/checkins/${editingId}` : "/api/checkins";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffNumber, firstName, lastName, location }),
      });

      if (response.ok) {
        setMessage(editingId ? "Check-in updated successfully!" : "Check-in submitted successfully!");
        setStaffNumber("");
        setFirstName("");
        setLastName("");
        setLocation(locations[0] || "");
        setEditingId(null);
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error}`);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleEdit = (checkin) => {
    setStaffNumber(checkin.staff_number);
    setFirstName(checkin.first_name);
    setLastName(checkin.last_name);
    setLocation(checkin.location);
    setEditingId(checkin.id);
    setView("checkin");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this check-in?")) {
      return;
    }

    try {
      const response = await fetch(`/api/checkins/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadCheckins();
      } else {
        alert("Failed to delete check-in");
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div style={{ fontFamily: "Arial", padding: 24, maxWidth: 900 }}>
      <div style={{ marginBottom: 20, borderBottom: "2px solid #ccc", paddingBottom: 10 }}>
        <button
          onClick={() => setView("checkin")}
          style={{
            padding: "10px 20px",
            marginRight: 10,
            backgroundColor: view === "checkin" ? "#007bff" : "#ccc",
            color: view === "checkin" ? "white" : "black",
            border: "none",
            cursor: "pointer",
          }}
        >
          Check-In
        </button>
        <button
          onClick={() => setView("dashboard")}
          style={{
            padding: "10px 20px",
            backgroundColor: view === "dashboard" ? "#007bff" : "#ccc",
            color: view === "dashboard" ? "white" : "black",
            border: "none",
            cursor: "pointer",
          }}
        >
          Dashboard
        </button>
      </div>

      {view === "checkin" && (
        <div style={{ maxWidth: 600 }}>
          <h1>{editingId ? "Edit Check-In" : "Fire Warden Check-In"}</h1>

          <form onSubmit={handleSubmit}>
            <label>Staff Number</label>
            <input
              value={staffNumber}
              onChange={(e) => setStaffNumber(e.target.value)}
              style={{ display: "block", width: "100%", padding: 8, margin: "6px 0 12px" }}
            />

            <label>First Name</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={{ display: "block", width: "100%", padding: 8, margin: "6px 0 12px" }}
            />

            <label>Last Name</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={{ display: "block", width: "100%", padding: 8, margin: "6px 0 12px" }}
            />

            <label>Working Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ display: "block", width: "100%", padding: 8, margin: "6px 0 12px" }}
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            <button type="submit" style={{ padding: "10px 14px", backgroundColor: "#28a745", color: "white", border: "none", cursor: "pointer" }}>
              {editingId ? "Update Check-In" : "Submit Check-In"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setStaffNumber("");
                  setFirstName("");
                  setLastName("");
                  setLocation(locations[0] || "");
                }}
                style={{ padding: "10px 14px", marginLeft: 10, backgroundColor: "#6c757d", color: "white", border: "none", cursor: "pointer" }}
              >
                Cancel
              </button>
            )}
          </form>

          {message && (
            <div style={{ marginTop: 20, padding: 10, backgroundColor: message.includes("Error") ? "#f8d7da" : "#d4edda", color: message.includes("Error") ? "#721c24" : "#155724" }}>
              {message}
            </div>
          )}
        </div>
      )}

      {view === "dashboard" && (
        <div>
          <h1>Fire Warden Dashboard</h1>
          <p>Current Fire Warden Locations</p>

          {checkins.length === 0 ? (
            <p>No check-ins recorded yet.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
                  <th style={{ padding: 12, textAlign: "left" }}>Staff Number</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Name</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Location</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Check-In Time</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {checkins.map((checkin) => (
                  <tr key={checkin.id} style={{ borderBottom: "1px solid #dee2e6" }}>
                    <td style={{ padding: 12 }}>{checkin.staff_number}</td>
                    <td style={{ padding: 12 }}>
                      {checkin.first_name} {checkin.last_name}
                    </td>
                    <td style={{ padding: 12 }}>{checkin.location}</td>
                    <td style={{ padding: 12 }}>{new Date(checkin.check_in_time).toLocaleString()}</td>
                    <td style={{ padding: 12 }}>
                      <button
                        onClick={() => handleEdit(checkin)}
                        style={{ padding: "5px 10px", marginRight: 5, backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(checkin.id)}
                        style={{ padding: "5px 10px", backgroundColor: "#dc3545", color: "white", border: "none", cursor: "pointer" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default App;


