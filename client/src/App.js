import { useEffect, useState } from "react";

function App() {
  const [locations, setLocations] = useState([]);
  const [staffNumber, setStaffNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState("");

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

  return (
    <div style={{ fontFamily: "Arial", padding: 24, maxWidth: 600 }}>
      <h1>Fire Warden Check-In</h1>

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

      <button style={{ padding: "10px 14px" }}>
        Submit (we’ll wire this next)
      </button>
    </div>
  );
}

export default App;


