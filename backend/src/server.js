const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const professionalRoutes = require("./routes/pro.routes");
const userRoutes = require("./routes/user.routes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use(cors({
  origin: true, 
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  credentials: true
}));

app.get("/", (req, res) => res.status(200).json({message:"Mini docto +"}));
app.use("/api/auth", authRoutes);
app.use("/api/professionals", professionalRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
