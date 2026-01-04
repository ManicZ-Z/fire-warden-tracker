const express = require("express");
const cors = require("cors");

console.log("✅ SERVER FILE LOADED:", __filename);

const app = express();

const LOCATIONS = [
 // in-memory storage

  "Alwyn Hall",
  "Beech Glade",
  "Bowers Building",
  "Burma Road Student Village",
  "Centre for Sport",
  "Chapel",
  "The Cottage",
  "Fred Wheeler Building",
  "Herbert Jarman Building",
  "Holm Lodge",
  "Kenneth Kettle Building",
  "King Alfred Centre",
  "Martial Rose Library",
  "Masters Lodge",
  "Medecroft",
  "Medecroft Annexe",
  "Paul Chamberlain Building",
  "Queen’s Road Student Village",
  "St Alphege",
  "St Edburga",
  "St Elizabeth’s Hall",
  "St Grimbald’s Court",
  "St James’ Hall",
  "St Swithun’s Lodge",
  "The Stripe",
  "Business School",
  "Tom Atkinson Building",
  "West Downs Centre",
  "West Downs Student Village",
  "Winton Building",
  "Students’ Union"
];
let CHECKINS = [];
let NEXT_ID = 1;

app.use(cors());
app.use(express.json());

// Log every request so we KNOW the server is alive
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running ✅" });
});

app.get("/api/locations", (req, res) => {
  res.json(LOCATIONS);
});

// Catch-all (helps debug missing routes)
app.use((req, res) => {
  res.status(404).send(`Cannot ${req.method} ${req.url}`);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});



