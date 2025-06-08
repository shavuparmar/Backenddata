const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;
const cors = require("cors");
app.use(cors({
  origin: 'https://your-frontend.vercel.app' // Allow frontend
}));

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Schema and Model
const contactSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    address: String,
    mobile: String,
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

// POST route to receive form data
app.post("/api/contacts", async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json({ message: "Contact saved successfully." });
  } catch (error) {
    console.error("Error saving contact:", error);
    res.status(500).json({ message: "Error saving contact." });
  }
});

// *** NEW GET route to fetch all contacts ***
app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }); // latest first
    res.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Error fetching contacts." });
  }
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
