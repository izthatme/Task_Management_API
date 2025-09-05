const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(helmet());

const allowedOrigins = [
  "https://task-management-api-1-w3gn.onrender.com", // ✅ frontend (deployed)
  "http://localhost:5173" // ✅ dev (optional)
];

app.use(cors({
  origin: function (origin, callback) {
    console.log("Incoming Origin:", origin); // 🟢 log to confirm deployment
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());

app.use('/api', routes);
app.get('/health', (_, res) => res.json({ ok: true }));

app.use(errorHandler);
module.exports = app;
